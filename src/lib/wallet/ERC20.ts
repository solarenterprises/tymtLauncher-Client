import { ethers } from "ethers";
import * as ethereumjsWallet from "ethereumjs-wallet";
import * as bip39 from "bip39";
import { IRecipient } from "../../features/wallet/CryptoApi";
import { INotification } from "../../features/wallet/CryptoSlice";
import * as multichainWallet from "multichain-crypto-wallet";
import { translateString } from "../api/Translate";

class ERC20 {
  static async getPrivateKeyFromMnemonic(mnemonic: string): Promise<string> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdNode = ethereumjsWallet.hdkey.fromMasterSeed(seed);
    const node = hdNode.derivePath(`m/44'/60'/0'`);
    const change = node.deriveChild(0);
    const childNode = change.deriveChild(0);
    const childWallet = childNode.getWallet();
    const wallet = new ethers.Wallet(
      childWallet.getPrivateKey().toString("hex")
    );
    return wallet.privateKey;
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
    const wallet = await ERC20.getWalletFromMnemonic(mnemonic.normalize("NFD"));
    return wallet.address;
  }

  static async getBalance(url: string): Promise<number> {
    try {
      const result = (await (await fetch(url)).json()).result;
      return (result as number) / 1000000000 / 1000000000;
    } catch {
      return 0;
    }
  }

  static async getTransactions(url: string): Promise<any> {
    try {
      return (await (await fetch(url)).json()).result;
    } catch {
      return undefined;
    }
  }

  static async sendTransaction(
    passphrase: string,
    rpc_url: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }
  ) {
    console.log("RPC_URL", rpc_url);
    console.log("passphrase", passphrase);
    if (tx.recipients.length < 1) {
      const noti: INotification = {
        status: "failed",
        title: await translateString("No Recipients"),
        message: await translateString("Please add recipients."),
      };
      return noti;
    }
    try {
      const privateKey = await ERC20.getPrivateKeyFromMnemonic(passphrase);
      console.log("privateKey", privateKey);
      const response = await Promise.all(
        tx.recipients.map((recipient) => {
          return multichainWallet.transfer({
            recipientAddress: recipient.address,
            amount: Number(recipient.amount),
            network: "ethereum",
            rpcUrl: rpc_url,
            privateKey: privateKey,
          });
        })
      );
      console.log("Response of send EVM native token transaction: ", response);
      const noti: INotification = {
        status: "success",
        title: await translateString("Success"),
        message: await translateString("Successfully Transferred!"),
        transactionId: response[0].hash,
      };
      return noti;
    } catch (err) {
      console.error("Failed to send EVM native token transaction: ", err);
      const translated = await translateString(err.toString());
      const noti: INotification = {
        status: "failed",
        title: await translateString("Failed"),
        message: translated,
      };
      return noti;
    }
  }

  static async sendTransactionAPI(
    passphrase: string,
    rpc_url: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }
  ) {
    console.log("RPC_URL", rpc_url);
    console.log("passphrase", passphrase);
    if (tx.recipients.length < 1) {
      const noti: INotification = {
        status: "failed",
        title: "Send EVM",
        message: "Please add recipients.",
      };
      return noti;
    }
    try {
      const privateKey = await ERC20.getPrivateKeyFromMnemonic(passphrase);
      console.log("privateKey", privateKey);
      const response = await Promise.all(
        tx.recipients.map((recipient) => {
          return multichainWallet.transfer({
            recipientAddress: recipient.address,
            amount: Number(recipient.amount),
            network: "ethereum",
            rpcUrl: rpc_url,
            privateKey: privateKey,
          });
        })
      );
      console.log("Response of send EVM native token transaction: ", response);
      const noti: INotification = {
        status: "success",
        title: "Send EVM",
        message: "Transaction is sent out.",
        transactionId: response[0].hash,
      };
      return noti;
    } catch (err) {
      console.error("Failed to send EVM native token transaction: ", err);
      const noti: INotification = {
        status: "failed",
        title: "Send EVM",
        message: err.toString(),
      };
      return noti;
    }
  }

  static async sendERCTransaction(
    passphrase: string,
    rpc_url: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length < 1) {
      const noti: INotification = {
        status: "failed",
        title: await translateString("No Recipients"),
        message: await translateString("Please add recipients."),
      };
      return noti;
    }
    try {
      const privateKey = await ERC20.getPrivateKeyFromMnemonic(passphrase);
      const response = await Promise.all(
        tx.recipients.map((recipient) => {
          return multichainWallet.transfer({
            recipientAddress: recipient.address,
            amount: Number(recipient.amount),
            network: "ethereum",
            rpcUrl: rpc_url,
            privateKey: privateKey,
            tokenAddress: recipient.tokenAddr,
          });
        })
      );
      console.log("Response of send EVM native token transaction: ", response);
      const noti: INotification = {
        status: "success",
        title: await translateString("Success"),
        message: await translateString("Successfully Transferred!"),
      };
      return noti;
    } catch (err) {
      console.error("Failed to send EVM native token transaction: ", err);
      const translated = await translateString(err.toString());
      const noti: INotification = {
        status: "failed",
        title: await translateString("Failed"),
        message: translated,
      };
      return noti;
    }
  }

  static async sendERCTransactionAPI(
    passphrase: string,
    rpc_url: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length < 1) {
      const noti: INotification = {
        status: "failed",
        title: "Send EVM",
        message: "Please add recipients.",
      };
      return noti;
    }
    try {
      const privateKey = await ERC20.getPrivateKeyFromMnemonic(passphrase);
      const response = await Promise.all(
        tx.recipients.map((recipient) => {
          return multichainWallet.transfer({
            recipientAddress: recipient.address,
            amount: Number(recipient.amount),
            network: "ethereum",
            rpcUrl: rpc_url,
            privateKey: privateKey,
            tokenAddress: recipient.tokenAddr,
          });
        })
      );
      console.log("Response of send EVM native token transaction: ", response);
      const noti: INotification = {
        status: "success",
        title: "Send EVM",
        message: "Transaction is sent out.",
        transactionId: response[0].hash,
      };
      return noti;
    } catch (err) {
      console.error("Failed to send EVM native token transaction: ", err);
      const noti: INotification = {
        status: "failed",
        title: "Send EVM",
        message: err.toString(),
      };
      return noti;
    }
  }

  static async getERCTransactions(url: string): Promise<any> {
    try {
      return (await (await fetch(url)).json()).result;
    } catch (e) {
      return undefined;
    }
  }

  static async getERCBalance(url): Promise<number> {
    try {
      const result = (await (await fetch(url)).json()).result;
      return (result as number) / 1000000000 / 1000000000;
    } catch {
      return 0;
    }
  }
}

export default ERC20;
