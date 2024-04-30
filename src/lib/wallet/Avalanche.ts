import { IWallet } from "./IWallet";
import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { avax_api_url, avax_rpc_url, net_name } from "../../configs";
import { IToken, IGetTokenBalanceRes } from "../../types/walletTypes";

class Avalanche implements IWallet {
  address: string;
  ticker: "AVAX" = "AVAX";

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
    const wallet = await Avalanche.getWalletFromMnemonic(
      mnemonic.normalize("NFD")
    );
    return wallet.address;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      const customProvider = new ethers.JsonRpcProvider(avax_rpc_url);
      return (
        parseFloat(ethers.formatEther(await customProvider.getBalance(addr))) /
        1e9 /
        1e9
      );
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
        const tokenContractAddress = tokens[i].address;
        const tokenAbi = [
          "function balanceOf(address owner) view returns (uint256)",
        ];
        const customProvider = new ethers.JsonRpcProvider(avax_rpc_url);
        const tokenContract = new ethers.Contract(
          tokenContractAddress,
          tokenAbi,
          customProvider
        );
        result.push({
          cmc: tokens[i].cmc,
          balance:
            parseFloat(await tokenContract.balanceOf(addr)) /
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
    let endpoint = "";
    if (net_name === "mainnet") {
      endpoint = `${avax_api_url}/address/${addr}/erc20-transfers?limit=15`;
    } else {
      endpoint = `${avax_api_url}/address/${addr}/transactions?sort=desc&limit=15`;
    }
    try {
      return (await (await fetch(endpoint)).json()).items;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  static async sendTransaction(
    passphrase: string,
    tx: { recipients: any[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length > 0) {
      try {
        let wallet = await Avalanche.getWalletFromMnemonic(passphrase);
        const customProvider = new ethers.JsonRpcProvider(avax_rpc_url);
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
        });
        return true;
      } catch {
        return false;
      }
    }
  }
}

export default Avalanche;
