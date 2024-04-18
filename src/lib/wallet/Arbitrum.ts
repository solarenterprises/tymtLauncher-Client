import { IWallet } from "./IWallet";
import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { arb_api_key, arb_api_url, arb_rpc_url } from "../../configs";
import { IToken, IGetTokenBalanceRes } from "../../types/walletTypes";

class Arbitrum implements IWallet {
  address: string;
  ticker: "ETH" = "ETH";

  constructor() {
    this.address = "";
  }

  static async getWalletFromMnemonic(mnemonic: string): Promise<any> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdNode = ethereumjsWallet.hdkey.fromMasterSeed(seed);
    const node = hdNode.derivePath(`m/44'/60'/0'`);
    const change = node.deriveChild(0);
    const childNode = change.deriveChild(0);
    const childWallet = childNode.getWallet();
    const wallet = new ethers.Wallet(
      childWallet.getPrivateKey().toString("hex")
    );
    return wallet;
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const wallet = await Arbitrum.getWalletFromMnemonic(
      mnemonic.normalize("NFD")
    );
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const result = (
        await (
          await fetch(
            `${arb_api_url}?module=account&action=balance&address=${addr}&tag=latest&apikey=${arb_api_key}`
          )
        ).json()
      ).result;
      return (result as number) / 1e9 / 1e9;
    } catch {
      return 0;
    }
  }

  static async getTokenBalance(
    addr: string,
    tokens: IToken[]
  ): Promise<IGetTokenBalanceRes[]> {
    try {
      let result: IGetTokenBalanceRes[] = [];
      for (let i = 0; i < tokens.length; i++) {
        result.push({
          cmc: tokens[i].cmc,
          balance:
            ((
              await (
                await fetch(
                  `${arb_api_url}?module=account&action=tokenbalance&contractAddress=${tokens[i].address}&address=${addr}&tag=latest&apikey=${arb_api_key}`
                )
              ).json()
            ).result as number) /
            10 ** (tokens[i].decimals as number),
        });
      }
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  static async getTransactions(addr: string): Promise<any> {
    try {
      return (
        await (
          await fetch(
            `${arb_api_url}?module=account&action=txlist&address=${addr}&startblock=0&endblock=latest&page=1&offset=10&sort=desc&apikey=${arb_api_key}`
          )
        ).json()
      ).result;
    } catch {
      return undefined;
    }
  }

  static async sendTransaction(
    passphrase: string,
    tx: { recipients: any[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length > 0) {
      try {
        let wallet = await Arbitrum.getWalletFromMnemonic(passphrase);
        const customProvider = new ethers.JsonRpcProvider(arb_rpc_url);
        wallet = wallet.connect(customProvider);
        tx.recipients.map(async (recipient) => {
          const response = await wallet.sendTransaction({
            to: recipient.address,
            value: ethers.parseEther(recipient.amount),
          });
          const receipt = await response.wait(1); // wait for 1 confirmation
          const hash = receipt.transactionHash;
          const block = receipt.blockNumber;
          const status = receipt.status ? "Success" : "Failure";
          const gas = receipt.gasUsed.toString();
          console.log(`Transaction: [${hash}](^5^${hash})`);
          console.log(`Block: ${block}`);
          console.log(`Status: ${status}`);
          console.log(`Gas Used: ${gas}`);
        });
        return true;
      } catch {
        return false;
      }
    }
  }
}

export default Arbitrum;
