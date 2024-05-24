import { IWallet } from "./IWallet";
import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { bsc_api_key, bsc_api_url, bsc_rpc_url, net_name } from "../../configs";
import { ERC20ABI } from "../../abis/ERC20API";
import { IToken, IGetTokenBalanceRes } from "../../types/walletTypes";

class BSC implements IWallet {
  address: string;
  ticker: "BNB" = "BNB";

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
    const wallet = await BSC.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const result = (
        await (
          await fetch(
            `${bsc_api_url}?module=account&action=balance&address=${addr}&apikey=${bsc_api_key}`
          )
        ).json()
      ).result;
      return (result as number) / 1e9 / 1e9;
    } catch {
      return 0;
    }
  }

  static async getTransactions(addr: string): Promise<any> {
    try {
      return (
        await (
          await fetch(
            `${bsc_api_url}?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${bsc_api_key}`
          )
        ).json()
      ).result;
    } catch {
      return undefined;
    }
  }

  static async getTokenBalance(
    addr: string,
    tokens: IToken[]
  ): Promise<IGetTokenBalanceRes[]> {
    try {
      let result: IGetTokenBalanceRes[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (net_name === "testnet") {
          result.push({
            cmc: tokens[i].cmc,
            balance: 0,
          });
        } else {
          result.push({
            cmc: tokens[i].cmc,
            balance:
              ((
                await (
                  await fetch(
                    `${bsc_api_url}?module=account&action=tokenbalance&contractAddress=${tokens[i].address}&address=${addr}&apikey=${bsc_api_key}`
                  )
                ).json()
              ).result as number) /
              10 ** (tokens[i].decimals as number),
          });
        }
      }
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  static async sendERCTransaction(
    passphrase: string,
    tx: {
      recipients: any[];
      fee: string;
      vendorField?: string;
      tokenAddress: string;
    }
  ) {
    let wallet = await BSC.getWalletFromMnemonic(passphrase);
    const customProvider = new ethers.JsonRpcProvider(bsc_rpc_url);
    wallet = wallet.connect(customProvider);
    const tokenContract = new ethers.Contract(
      tx.tokenAddress,
      ERC20ABI,
      wallet
    );
    try {
      tx.recipients.map(async (recipient) => {
        const tx = await tokenContract.transfer(
          recipient.address,
          ethers.parseUnits("0.001", 18)
        );
        const receipt = await tx.wait(1); // wait for 1 confirmation
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
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  static async sendTransaction(
    passphrase: string,
    tx: { recipients: any[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length > 0) {
      try {
        let wallet = await BSC.getWalletFromMnemonic(passphrase);
        const customProvider = new ethers.JsonRpcProvider(bsc_rpc_url);
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
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
}

export default BSC;
