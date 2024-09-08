import { IWallet } from "./IWallet";
import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { net_name, op_api_key, op_api_url, op_rpc_url } from "../../configs";
import { ISupportToken, IBalance } from "../../types/walletTypes";

class Optimism implements IWallet {
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
    const wallet = new ethers.Wallet(childWallet.getPrivateKey().toString("hex"));
    return wallet;
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const wallet = await Optimism.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (net_name === "testnet") return 0;
      const result = (await (await fetch(`${op_api_url}?module=account&action=balance&address=${addr}&tag=latest&apikey=${op_api_key}`)).json()).result;
      return (result as number) / 1e9 / 1e9;
    } catch {
      return 0;
    }
  }

  static async getTokenBalance(addr: string, tokens: ISupportToken[]): Promise<IBalance[]> {
    try {
      let result: IBalance[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (net_name === "testnet") {
          result.push({
            symbol: tokens[i].symbol,
            balance: 0,
          });
        } else {
          result.push({
            symbol: tokens[i].symbol,
            balance:
              ((
                await (
                  await fetch(
                    `${op_api_url}?module=account&action=tokenbalance&contractAddress=${tokens[i].address}&address=${addr}&tag=latest&apikey=${op_api_key}`
                  )
                ).json()
              ).result as number) /
              10 ** (tokens[i].decimals as number),
          });
        }
      }
      return result;
    } catch (err) {
      console.log("Failed to OPTIMISM getTokenBalance: ", err);
      return [];
    }
  }

  static async getTransactions(addr: string): Promise<any> {
    try {
      return (
        await (
          await fetch(
            `${op_api_url}?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${op_api_key}`
          )
        ).json()
      ).result;
    } catch {
      return undefined;
    }
  }

  static async sendTransaction(passphrase: string, tx: { recipients: any[]; fee: string; vendorField?: string }) {
    if (tx.recipients.length > 0) {
      try {
        let wallet = await Optimism.getWalletFromMnemonic(passphrase);
        const customProvider = new ethers.JsonRpcProvider(op_rpc_url);
        wallet = wallet.connect(customProvider);
        tx.recipients.map(async (recipient) => {
          const response = await wallet.sendTransaction({
            to: recipient.address,
            value: ethers.parseEther(recipient.amount),
          });
          const receipt = await response.wait(1);
          const hash = receipt.transactionHash;
          const block = receipt.blockNumber;
          const status = receipt.status ? "Success" : "Failure";
          const gas = receipt.gasUsed.toString();
          console.log(`Transaction: [${hash}](^5^${hash})`);
          console.log(`Block: ${block}`);
          console.log(`Status: ${status}`);
          console.log(`Gas Used: ${gas}`);
          console.log("----------");
        });
        return true;
      } catch {
        return false;
      }
    }
  }
}

export default Optimism;
