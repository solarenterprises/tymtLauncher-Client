import { IWallet } from "./IWallet";
import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { eth_api_url, eth_api_key, eth_rpc_url, net_name } from "../../configs/index";
import { IToken, IGetTokenBalanceRes } from "../../types/walletTypes";
import { validate } from "multicoin-address-validator";

class Ethereum implements IWallet {
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
    const wallet = await Ethereum.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static validateAddress(addr: string) {
    if (!addr) return false;
    return validate(addr, "eth");
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const result = (await (await fetch(`${eth_api_url}?module=account&action=balance&address=${addr}&tag=latest&apikey=${eth_api_key}`)).json()).result;
      return (result as number) / 1e9 / 1e9;
    } catch {
      return 0;
    }
  }

  static async getTokenBalance(addr: string, tokens: IToken[]): Promise<IGetTokenBalanceRes[]> {
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
                    `${eth_api_url}?module=account&action=tokenbalance&contractaddress=${tokens[i].address}&address=${addr}&tag=latest&apikey=${eth_api_key}`
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

  static async getTransactions(addr: string): Promise<any> {
    try {
      return (
        await (
          await fetch(
            `${eth_api_url}?module=account&action=txlist&address=${addr}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${eth_api_key}`
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
        let wallet = await Ethereum.getWalletFromMnemonic(passphrase);
        const customProvider = new ethers.JsonRpcProvider(eth_rpc_url);
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

  static async signMessage(message: string, passphrase: string): Promise<string> {
    try {
      const wallet = await Ethereum.getWalletFromMnemonic(passphrase);
      const signature = await wallet.signMessage(message);
      return signature;
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  static async verifyMessage(message: string, signature: string, address: string): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log(recoveredAddress);
      return recoveredAddress === address;
    } catch (error) {
      console.error("Error verifying message:", error);
      return false;
    }
  }
}

export default Ethereum;
