import { IWallet } from "./IWallet";
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import { Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as multichainWallet from "multichain-crypto-wallet";
import { validate } from "multicoin-address-validator";
import { INotification } from "../../features/wallet/CryptoSlice";
import { IRecipient } from "../../features/wallet/CryptoApi";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import * as bs58 from "bs58";
import { translateString } from "../api/Translate";
import { net_name } from "../../configs";

class Solana implements IWallet {
  address: string;
  ticker: "SOL" = "SOL";

  constructor() {
    this.address = "";
  }

  static async getAddress(mnemonic: string): Promise<string> {
    try {
      const wallet = multichainWallet.generateWalletFromMnemonic({
        mnemonic: mnemonic,
        derivationPath: "m/44'/501'/0'/0'",
        network: "solana",
      });
      if (!wallet) return "";
      return wallet.address;
    } catch (err) {
      console.error("Failed to SOLANA getAddress: ", err);
      return "";
    }
  }

  static validateAddress(addr: string) {
    if (!addr) return false;
    return validate(addr, "sol");
  }

  static async getKeyPair(mnemonic: string): Promise<Keypair> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivationPath = "m/44'/501'/0'/0'";
    const derivedSeed = ed25519.derivePath(derivationPath, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    return keypair;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (net_name === "testnet") return 0;
      const apiURL = "https://api.mainnet-beta.solana.com";
      const pbKey = new PublicKey(addr).toBase58();
      const bodyContent = {
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [pbKey],
      };
      const body = JSON.stringify(bodyContent);
      const response: any = await tauriFetch(apiURL, {
        method: "POST",
        connectTimeout: 30,
        body: JSON.parse(body),
      });
      const sols = (await response.json()?.result?.value) / 1e9;
      return sols;
    } catch (err) {
      console.log("Failed to SOLANA getBalance: ", err);
      return 0;
    }
  }

  static async getTransactions(addr: string, page: number): Promise<any> {
    try {
      const apiURL = "https://api.mainnet-beta.solana.com";
      const pbKey = new PublicKey(addr).toBase58();
      //get signatures
      const bodyContent1 = {
        jsonrpc: "2.0",
        id: 1,
        method: "getSignaturesForAddress",
        params: [pbKey, { limit: 15 * page }],
      };
      const body1 = JSON.stringify(bodyContent1);
      const response1: any = await tauriFetch(apiURL, {
        method: "POST",
        connectTimeout: 30,
        body: JSON.parse(body1),
      });
      const signatures: string[] = await response1
        .json()
        ?.result.slice(-15)
        .map((signature: any) => signature?.signature);
      // get transactions
      let bodyContent2 = [];
      for (let i = 0; i < signatures?.length; i++) {
        bodyContent2.push({
          jsonrpc: "2.0",
          id: i,
          method: "getTransaction",
          params: [signatures[i], { encoding: "jsonParsed", commitment: "finalized" }],
        });
      }
      const body2 = JSON.stringify(bodyContent2);
      const response2: any = await tauriFetch(apiURL, {
        method: "POST",
        connectTimeout: 30,
        body: JSON.parse(body2),
      });
      return Array.isArray(await response2.json()) ? await response2.json() : [];
    } catch (err) {
      console.error("Failed to SOLANA getTransactions: ", err);
      return [];
    }
  }

  static async sendTransaction(passphrase: string, tx: { recipients: IRecipient[]; fee: string; vendorField?: string }) {
    if (tx.recipients.length > 0) {
      try {
        const keypair = await Solana.getKeyPair(passphrase);
        let trx = new Transaction();
        tx.recipients.map((recipient) => {
          const toPbKey = new PublicKey(recipient.address);
          trx.add(
            SystemProgram.transfer({
              fromPubkey: keypair.publicKey,
              toPubkey: toPbKey,
              lamports: (Number(recipient.amount) * LAMPORTS_PER_SOL) as number,
            })
          );
        });

        const apiURL = "https://api.mainnet-beta.solana.com";
        const bodyContent1 = {
          jsonrpc: "2.0",
          id: 1,
          method: "getLatestBlockhash",
          params: [
            {
              commitment: "finalized",
            },
          ],
        };
        const body1 = JSON.stringify(bodyContent1);
        const response1: any = await tauriFetch(apiURL, {
          method: "POST",
          connectTimeout: 30,
          body: JSON.parse(body1),
        });
        console.log(await response1.json());
        const recentBlockhash = await response1.json()?.result?.value?.blockhash;

        console.log("recentBlockhash: ", recentBlockhash);
        trx.recentBlockhash = recentBlockhash;
        trx.sign(keypair);
        const rawTx = trx.serialize();
        const rawTxString = bs58.encode(rawTx);
        console.log("rawTx: ", rawTxString);

        const bodyContent2 = {
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [rawTxString],
        };
        const body2 = JSON.stringify(bodyContent2);
        const response2: any = await tauriFetch(apiURL, {
          method: "POST",
          connectTimeout: 30,
          body: JSON.parse(body2),
        });
        console.log(await response2.json());

        const noti: INotification = {
          status: "success",
          title: await translateString("Success"),
          message: await translateString("Successfully Transferred!"),
        };
        return noti;
      } catch (err) {
        console.error("Failed to send SOL transaction: ", err);
        const translated = await translateString(err.toString());
        const noti: INotification = {
          status: "failed",
          title: await translateString("Failed"),
          message: translated,
        };
        return noti;
      }
    }
  }

  static async sendTransactionAPI(passphrase: string, tx: { recipients: IRecipient[]; fee: string; vendorField?: string }) {
    if (tx.recipients.length > 0) {
      try {
        const keypair = await Solana.getKeyPair(passphrase);
        let trx = new Transaction();
        tx.recipients.map((recipient) => {
          const toPbKey = new PublicKey(recipient.address);
          trx.add(
            SystemProgram.transfer({
              fromPubkey: keypair.publicKey,
              toPubkey: toPbKey,
              lamports: (Number(recipient.amount) * LAMPORTS_PER_SOL) as number,
            })
          );
        });

        const apiURL = "https://api.mainnet-beta.solana.com";
        const bodyContent1 = {
          jsonrpc: "2.0",
          id: 1,
          method: "getLatestBlockhash",
          params: [
            {
              commitment: "finalized",
            },
          ],
        };
        const body1 = JSON.stringify(bodyContent1);
        const response1: any = await tauriFetch(apiURL, {
          method: "POST",
          connectTimeout: 30,
          body: JSON.parse(body1),
        });
        console.log(await response1.json());
        const recentBlockhash = await response1.json()?.result?.value?.blockhash;

        console.log("recentBlockhash: ", recentBlockhash);
        trx.recentBlockhash = recentBlockhash;
        trx.sign(keypair);
        const rawTx = trx.serialize();
        const rawTxString = bs58.encode(rawTx);
        console.log("rawTx: ", rawTxString);

        const bodyContent2 = {
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [rawTxString],
        };
        const body2 = JSON.stringify(bodyContent2);
        const response2: any = await tauriFetch(apiURL, {
          method: "POST",
          connectTimeout: 30,
          body: JSON.parse(body2),
        });
        console.log(await response2.json());

        const noti: INotification = {
          status: "success",
          title: "Send SOL",
          message: "Transaction confirmed.",
          transactionId: await response2.json()?.result,
        };
        return noti;
      } catch (err) {
        console.error("Failed to send SOL transaction: ", err);
        const noti: INotification = {
          status: "failed",
          title: "Send SOL",
          message: err.toString(),
        };
        return noti;
      }
    }
  }
}

export default Solana;
