import { IWallet } from "./IWallet";
import * as bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as multichainWallet from "multichain-crypto-wallet";
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
        derivationPath: "m/44'/501'/0'/0'", // Leave empty to use default derivation path
        network: "solana",
      });
      if (!wallet) return "";
      return wallet.address;
    } catch (err) {
      console.error("Failed to SOLANA getAddress: ", err);
      return "";
    }
  }

  static async getKeyPair(mnemonic: string): Promise<Keypair> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derivationPath = "m/44'/501'/0'/0'";
    const derivedSeed = ed25519.derivePath(
      derivationPath,
      seed.toString("hex")
    ).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    return keypair;
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      let network = undefined;
      if (net_name === "mainnet") {
        network = clusterApiUrl("mainnet-beta");
      } else {
        network = clusterApiUrl("devnet");
      }
      console.log("network", network);
      const connection = new Connection(network);
      const pbKey = new PublicKey(addr);
      console.log("pbKey", pbKey);
      console.log("address", addr);
      const balance = await connection.getBalance(pbKey);
      console.log("balance", balance);
      const sols = balance / 1e9;
      return sols;
    } catch (err) {
      console.error("Failed to SOLANA getBalance: ", err);
      return 0;
    }
  }

  static async getTransactions(addr: string): Promise<any> {
    try {
      let network = undefined;
      if (net_name === "mainnet") {
        network = clusterApiUrl("mainnet-beta");
      } else {
        network = clusterApiUrl("devnet");
      }
      const connection = new Connection(network);
      const pbKey = new PublicKey(addr);
      const signatures = await connection.getSignaturesForAddress(pbKey, {
        limit: 10,
      });
      return signatures;
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
        const keypair = await Solana.getKeyPair(passphrase);
        let network = undefined;
        if (net_name === "mainnet") {
          network = clusterApiUrl("mainnet-beta");
        } else {
          network = clusterApiUrl("devnet");
        }
        const connection = new Connection(network);
        let trx = new Transaction();
        tx.recipients.map((recipient) => {
          const toPbKey = new PublicKey(recipient.address);
          trx.add(
            SystemProgram.transfer({
              fromPubkey: keypair.publicKey,
              toPubkey: toPbKey,
              lamports: (recipient.amount as number) * LAMPORTS_PER_SOL,
            })
          );
        });
        const trxSign = await sendAndConfirmTransaction(connection, trx, [
          keypair,
        ]);
        console.log("trxSign", trxSign);
        return true;
      } catch {
        return false;
      }
    }
  }
}

export default Solana;
