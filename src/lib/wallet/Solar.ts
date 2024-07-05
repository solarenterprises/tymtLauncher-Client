import { Managers, Identities, Transactions, Crypto } from "@solar-network/crypto";
import { generateMnemonic } from "bip39";
import { IWallet } from "./IWallet";
import Big from "big.js";
import SolarAPI from "../api/SolarAPI";
import { net_name, solar_api_url } from "../../configs/index";
import { IRecipient } from "../../features/wallet/CryptoApi";
import { multiWalletType } from "../../types/walletTypes";
import tymtStorage from "../Storage";
import { testAccountTokens } from "../../consts/testMnemonics";

export class Solar implements IWallet {
  address: string;
  name?: string;
  publicKey?: string;
  balance?: number;
  passphrase: string;
  secondPassphrase?: string;
  ticker: "SXP" = "SXP";

  constructor(mnemonic: string) {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");

    this.passphrase = mnemonic;
    this.address = Identities.Address.fromPassphrase(mnemonic);
    fetch(`${solar_api_url}/wallets/${this.address}`).then((response) => {
      response.json().then((data) => {
        this.publicKey = data.publicKey;
      });
    });
  }

  static async getAddress(mnemonic: string): Promise<string> {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");

    return Identities.Address.fromPassphrase(mnemonic.normalize("NFD"));
  }

  static getPublicKey(mnemonic: string): string {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");

    return Identities.PublicKey.fromPassphrase(mnemonic.normalize("NFD"));
  }

  async getCurrentBalance(): Promise<number> {
    try {
      return (await (await fetch(`${solar_api_url}/wallets/${this.address}`)).json()).data.balance as number;
    } catch {
      return 0;
    }
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      return ((await (await fetch(`${solar_api_url}/wallets/${addr}`)).json()).data.balance as number) / 1e8;
    } catch {
      return 0;
    }
  }

  static validateAddress(address: string): boolean {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
    return Identities.Address.validate(address);
  }

  static isValidPassphrase(passphrase: string): boolean {
    if (passphrase.split(" ").length >= 8) {
      if (Identities.Address.fromPassphrase(passphrase).length === 34) {
        return true;
      }
    }
    return false;
  }
  static async generateMnemonic(): Promise<string> {
    const passphrase = generateMnemonic();
    return passphrase;
  }
  static async isSecondSignatureFromAddress(address: string) {
    let walletAttributes = (await (await fetch(`${solar_api_url}/wallets/${address}`)).json()).data.attributes;
    if (walletAttributes) {
      if (walletAttributes.secondPublicKey) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async isSecondSignature() {
    let walletAttributes = (await (await fetch(`${solar_api_url}/wallets/${this.address}`)).json()).data.attributes;
    if (walletAttributes) {
      if (walletAttributes.secondPublicKey) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  static async isSecondSignatureFromPassphrase(passphrase: string): Promise<boolean> {
    return await this.isSecondSignatureFromAddress(this.addressFromPassphrase(passphrase));
  }
  static async isValidSecondSignature(passphrase: string, secondpassphrase: string): Promise<boolean> {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
    let testTx = Transactions.BuilderFactory.vote().nonce("1").votesAsset({}).fee("42").sign(passphrase).secondSign(secondpassphrase).getStruct();
    let walletPublicKey = (await (await fetch(`${solar_api_url}/wallets/${this.addressFromPassphrase(passphrase)}`)).json()).data.attributes.secondPublicKey;
    if (walletPublicKey) {
      return Transactions.Verifier.verifySecondSignature(testTx, walletPublicKey);
    } else {
      return false;
    }
  }
  static addressFromPassphrase(passphrase: string): string {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
    return Identities.Address.fromPassphrase(passphrase);
  }

  validateAddress(address: string): boolean {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
    return Identities.Address.validate(address);
  }

  async getVote(): Promise<any> {
    try {
      return (await (await fetch(`${solar_api_url}/wallets/${this.address}`)).json()).data.votingFor;
    } catch {
      return "";
    }
  }

  static async getTransactions(addr: string, page: number): Promise<any> {
    try {
      return (await (await fetch(`${solar_api_url}/wallets/${addr}/transactions?page=${page}&limit=15`)).json()).data;
    } catch {
      return [];
    }
  }

  async getTransaction(txId: string): Promise<any> {
    try {
      return (await (await fetch(`${solar_api_url}/transactions/${txId}`)).json()).data;
    } catch {
      return undefined;
    }
  }
  static async getDelegates(query: any, url: string) {
    try {
      return await SolarAPI.getData(query, url);
    } catch {
      return undefined;
    }
  }
  static async sendTransaction(
    passphrase: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }, // fee in USD
    secondPassphrase?: string
  ) {
    const addr = await Solar.getAddress(passphrase);
    let nonce: number = await Solar.getCurrentNonce(addr);
    if (tx.recipients.length > 0) {
      if (tx.recipients.length > 1) {
        Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
        let transaction = Transactions.BuilderFactory.transfer();
        tx.recipients.map((recipient) => {
          transaction.addTransfer(
            recipient.address,
            Big(recipient.amount)
              .times(10 ** 8)
              .toFixed(0)
          );
        });

        const multiWalletStore: multiWalletType = JSON.parse(await tymtStorage.get(`multiWallet`));
        const sxpPriceUSD = multiWalletStore.Solar.chain.price;
        let itransaction = transaction
          .fee(
            Big(tx.fee)
              .times((10 ** 8 / Number(sxpPriceUSD)) as number)
              .toFixed(0)
          )
          .nonce((nonce + 1).toString());

        if (tx.vendorField && tx.vendorField.length > 0) {
          itransaction = itransaction.memo(tx.vendorField);
        }
        let txJson = itransaction.sign(passphrase);

        if (secondPassphrase?.length) {
          txJson = itransaction.secondSign(secondPassphrase);
        }

        let iTxJson = txJson.build().toJson();
        console.log("sending start");
        let res = await SolarAPI.addTxToQueue(JSON.stringify({ transactions: [iTxJson] }), solar_api_url ?? "");
        console.log("sending res", res);
        if (res.status !== 200) {
          return {
            status: "failed",
            title: "Send SXP",
            message: "Request failed",
          };
        } else {
          if (res.data.errors === undefined) {
            return {
              status: "success",
              title: "Send SXP",
              message: `Transaction confirmed.`,
              transactionId: res.data.data.accept[0],
            };
          } else {
            return {
              status: "failed",
              title: "Send SXP",
              message: res.data.errors[res.data.data.invalid[0]].message as string,
            };
          }
        }
      } else {
        Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
        let transaction = Transactions.BuilderFactory.transfer()
          .recipientId(tx.recipients[0].address)
          .version(3)
          .amount(
            Big(tx.recipients[0].amount)
              .times(10 ** 8)
              .toFixed(0)
          );
        const multiWalletStore: multiWalletType = JSON.parse(await tymtStorage.get(`multiWallet`));
        const sxpPriceUSD = multiWalletStore.Solar.chain.price;
        let itransaction = transaction
          .fee(
            Big(tx.fee)
              .times((10 ** 8 / Number(sxpPriceUSD)) as number)
              .toFixed(0)
          )
          .nonce((nonce + 1).toString());
        if (tx.vendorField && tx.vendorField.length > 0) {
          itransaction = itransaction.memo(tx.vendorField);
        }

        let txJson = itransaction.sign(passphrase);

        if (secondPassphrase && secondPassphrase.length > 0) {
          txJson = itransaction.secondSign(secondPassphrase);
        }

        let res = await SolarAPI.addTxToQueue(JSON.stringify({ transactions: [txJson.build().toJson()] }), solar_api_url ?? "");

        if (res.status !== 200) {
          return {
            status: "failed",
            title: "Send SXP",
            message: "Request failed",
          };
        } else {
          if (res.data.errors === undefined) {
            return {
              status: "success",
              title: "Send SXP",
              message: `Transaction confirmed.`,
              transactionId: res.data.data.accept[0],
            };
          } else {
            return {
              status: "failed",
              title: "Send SXP",
              message: res.data.errors[res.data.data.invalid[0]].message as string,
            };
          }
        }
      }
    }
  }

  static async sendTransactionAPI(
    passphrase: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }, // fee in USD
    secondPassphrase?: string
  ) {
    const addr = await Solar.getAddress(passphrase);
    let nonce: number = await Solar.getCurrentNonce(addr);
    if (tx.recipients.length > 0) {
      if (tx.recipients.length > 1) {
        Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
        let transaction = Transactions.BuilderFactory.transfer();
        tx.recipients.map((recipient) => {
          transaction.addTransfer(
            recipient.address,
            Big(recipient.amount)
              .times(10 ** 8)
              .toFixed(0)
          );
        });

        const multiWalletStore: multiWalletType = JSON.parse(await tymtStorage.get(`multiWallet`));
        const sxpPriceUSD = multiWalletStore.Solar.chain.price;
        let itransaction = transaction
          .fee(
            Big(tx.fee)
              .times((10 ** 8 / Number(sxpPriceUSD)) as number)
              .toFixed(0)
          )
          .nonce((nonce + 1).toString());

        if (tx.vendorField && tx.vendorField.length > 0) {
          itransaction = itransaction.memo(tx.vendorField);
        }
        let txJson = itransaction.sign(passphrase);

        if (secondPassphrase?.length) {
          txJson = itransaction.secondSign(secondPassphrase);
        }

        let iTxJson = txJson.build().toJson();
        console.log("sending start");
        let res = await SolarAPI.addTxToQueue(JSON.stringify({ transactions: [iTxJson] }), solar_api_url ?? "");
        console.log("sending res", res);
        if (res.status !== 200) {
          return {
            status: "failed",
            title: "Send SXP",
            message: "Request failed",
          };
        } else {
          if (res.data.errors === undefined) {
            return {
              status: "success",
              title: "Send SXP",
              message: `Transaction confirmed.`,
              transactionId: res.data.data.accept[0],
            };
          } else {
            return {
              status: "failed",
              title: "Send SXP",
              message: res.data.errors[res.data.data.invalid[0]].message as string,
            };
          }
        }
      } else {
        Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
        let transaction = Transactions.BuilderFactory.transfer()
          .recipientId(tx.recipients[0].address)
          .version(3)
          .amount(
            Big(tx.recipients[0].amount)
              .times(10 ** 8)
              .toFixed(0)
          );
        const multiWalletStore: multiWalletType = JSON.parse(await tymtStorage.get(`multiWallet`));
        const sxpPriceUSD = multiWalletStore.Solar.chain.price;
        let itransaction = transaction
          .fee(
            Big(tx.fee)
              .times((10 ** 8 / Number(sxpPriceUSD)) as number)
              .toFixed(0)
          )
          .nonce((nonce + 1).toString());
        if (tx.vendorField && tx.vendorField.length > 0) {
          itransaction = itransaction.memo(tx.vendorField);
        }

        let txJson = itransaction.sign(passphrase);

        if (secondPassphrase && secondPassphrase.length > 0) {
          txJson = itransaction.secondSign(secondPassphrase);
        }

        let res = await SolarAPI.addTxToQueue(JSON.stringify({ transactions: [txJson.build().toJson()] }), solar_api_url ?? "");

        if (res.status !== 200) {
          return {
            status: "failed",
            title: "Send SXP",
            message: "Request failed",
          };
        } else {
          if (res.data.errors === undefined) {
            return {
              status: "success",
              title: "Send SXP",
              message: `Transaction confirmed.`,
              transactionId: res.data.data.accept[0],
            };
          } else {
            return {
              status: "failed",
              title: "Send SXP",
              message: res.data.errors[res.data.data.invalid[0]].message as string,
            };
          }
        }
      }
    }
  }

  static getCurrentNonce(address: string) {
    return new Promise<number>((resolve, reject) => {
      (async () => {
        try {
          let walletInfo: any = await (await fetch(`${solar_api_url}/wallets/${address}`)).json();
          resolve(parseInt(walletInfo.data.nonce));
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  static async vote(passphrase: string, addr: string, votesAsset: any, fee: string) {
    Managers.configManager.setFromPreset(net_name === "mainnet" ? "mainnet" : "testnet");
    const multiWalletStore: multiWalletType = JSON.parse(await tymtStorage.get(`multiWallet`));
    const sxpPriceUSD = multiWalletStore.Solar.chain.price;
    let nonce = await Solar.getCurrentNonce(addr);
    let tx = Transactions.BuilderFactory.vote()
      .nonce((nonce + 1).toString())
      .votesAsset(votesAsset)
      .fee(
        Big(fee)
          .times((10 ** 8 / Number(sxpPriceUSD)) as number)
          .toFixed(0)
      )
      .sign(passphrase);

    let txJson = tx.build().toJson();
    let res = SolarAPI.addTxToQueue(JSON.stringify({ transactions: [txJson] }), solar_api_url ?? "");
    return res;
  }

  static signToken = (message: string, mnemonic: string) => {
    if (testAccountTokens.find((element) => element.mnemonic === mnemonic)) return testAccountTokens.find((element) => element.mnemonic === mnemonic).token;
    return Crypto.Message.sign(message, mnemonic.normalize("NFD")).signature;
  };

  static verifyToken = (message: string, publicKey: string, signature: string) => {
    if (testAccountTokens.find((element) => element.token === signature))
      return this.getPublicKey(testAccountTokens.find((element) => element.token === signature).mnemonic) === publicKey;
    return Crypto.Message.verify({ message, publicKey, signature });
  };

  static signMessage = (message: string, mnemonic: string) => {
    return Crypto.Message.sign(message, mnemonic.normalize("NFD")).signature;
  };

  static verifyMessage = (message: string, publicKey: string, signature: string) => {
    return Crypto.Message.verify({ message, publicKey, signature });
  };
}
export default Solar;
