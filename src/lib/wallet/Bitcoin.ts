import { IWallet } from "./IWallet";
import { mnemonicToSeed } from "bip39";
import { BIP32Factory } from "bip32";
import { payments, networks, Psbt } from "bitcoinjs-lib";
import axios from "axios";
import { btc_api_url, net_name } from "../../configs";
import { validate } from "bitcoin-address-validation";
import * as ecc from "tiny-secp256k1";
import { INotification } from "../../features/wallet/CryptoSlice";
import { IRecipient } from "../../features/wallet/CryptoApi";
import tymtStorage from "../Storage";
import { multiWalletType } from "../../types/walletTypes";
import { fetch as tauriFetch, ResponseType } from "@tauri-apps/api/http";
import { translateString } from "../api/Translate";

class Bitcoin implements IWallet {
  address: string;
  ticker: "BTC" = "BTC";

  constructor() {
    this.address = "";
  }

  static async getKeyPair(mnemonic: string): Promise<any> {
    const seed = await mnemonicToSeed(mnemonic);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);
    let child;
    if (net_name === "testnet") {
      child = root.derivePath("m/44'/1'/0'/0/0");
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error("Failed to obtain private key");
      }
      const keyPair = bip32.fromPrivateKey(
        privateKey,
        child.chainCode,
        networks.testnet
      );
      return keyPair;
    } else {
      child = root.derivePath("m/84'/0'/0'/0/0");
      const privateKey = child.privateKey;
      if (!privateKey) {
        throw new Error("Failed to obtain private key");
      }
      const keyPair = bip32.fromPrivateKey(
        privateKey,
        child.chainCode,
        networks.bitcoin
      );
      return keyPair;
    }
  }

  static async getAddress(mnemonic: string): Promise<string> {
    const keyPair = await Bitcoin.getKeyPair(mnemonic.normalize("NFD"));
    if (net_name === "testnet") {
      const { address } = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: networks.testnet,
      });
      return address ?? "";
    } else {
      const { address } = payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: networks.bitcoin,
      });
      return address ?? "";
    }
  }

  static async getBalance(addr: string): Promise<number> {
    try {
      if (net_name === "mainnet") {
        const result = await axios.get(
          `${btc_api_url}/q/addressbalance/${addr}`
        );
        if (result.status === 200) {
          const balance = parseFloat(result.data);
          const bitcoins = balance / 1e8;
          return bitcoins;
        } else {
          return 0;
        }
      } else {
        const result = await axios.get(`${btc_api_url}/address/${addr}`);
        if (result.status === 200) {
          const balance = result.data.chain_stats.funded_txo_sum;
          const bitcoins = balance / 1e8;
          return bitcoins;
        } else {
          return 0;
        }
      }
    } catch {
      return 0;
    }
  }

  static async getTransactions(addr: string, page: number): Promise<any> {
    try {
      if (net_name === "mainnet") {
        const apiURL = `${btc_api_url}/rawaddr/${addr}?offset=${
          (page - 1) * 15
        }limit=15`;
        const response: any = await tauriFetch(apiURL, {
          method: "GET",
          timeout: 30,
          responseType: ResponseType.JSON,
        });
        if (!response) return [];
        if (response.status === 429) {
          console.error("Failed to get BTC transactions: 429 error");
          return [];
        }
        if (response?.data?.txs) return response?.data?.txs;
        console.error("Failed to get BTC transactions: unknown error");
        return [];
      } else {
        const txs = await (
          await fetch(`${btc_api_url}/address/${addr}/txs?limit=10`)
        ).json();
        return txs;
      }
    } catch {
      return [];
    }
  }

  static validateAddress(address: string) {
    if (!address) return false;
    return validate(address);
  }

  static async sendTransaction(
    passphrase: string,
    tx: { recipients: IRecipient[]; fee: string; vendorField?: string }
  ) {
    if (tx.recipients.length) {
      try {
        const seed = await mnemonicToSeed(passphrase);
        const bip32 = BIP32Factory(ecc);
        const network =
          net_name === "mainnet" ? networks.bitcoin : networks.testnet;
        const root = bip32.fromSeed(seed, network);
        const account = root.derivePath(
          net_name === "mainnet" ? "m/84'/0'/0'/0/0" : "m/44'/1'/0'/0/0"
        );
        const psbt = new Psbt({ network });

        const myAddress = payments.p2wpkh({
          pubkey: account.publicKey,
          network,
        }).address;
        const utxos = await Bitcoin.getUTXOs(myAddress ?? "");

        utxos.forEach((utxo) => {
          psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            witnessUtxo: {
              script: Buffer.from(utxo.hex, "hex"),
              value: utxo.amount,
            },
          });
        });

        tx.recipients.forEach((recipient) => {
          psbt.addOutput({
            address: recipient.address,
            value: (Number(recipient.amount) *
              10 ** Number(recipient.tokenDecimals)) as number,
          });
        });

        // Transaction fee calculation
        const multiWalletStore: multiWalletType = JSON.parse(
          await tymtStorage.get(`multiWallet`)
        );
        const btcPriceUSD = multiWalletStore.Bitcoin.chain.price;
        const feeSat = ((Number(tx.fee) / Number(btcPriceUSD)) * 1e8) as number;
        const sumUTXOSat = utxos.reduce(
          (total, utxo) => total + utxo.amount,
          0
        );
        if (feeSat >= sumUTXOSat) {
          const noti: INotification = {
            status: "failed",
            title: await translateString("Fail"),
            message: await translateString("Insufficient BTC balance for fee!"),
          };
          return noti;
        }
        const changeSat = sumUTXOSat - feeSat;
        psbt.addOutput({
          address: multiWalletStore.Bitcoin.chain.wallet,
          value: changeSat as number,
        });
        // ~Transaction fee calculation

        for (let i = 0; i < utxos.length; i++) {
          psbt.signInput(i, account);
        }

        psbt.finalizeAllInputs();

        const rawHexTransaction = psbt.extractTransaction().toHex();

        const response = await Bitcoin.broadcastTransaction(rawHexTransaction);
        console.log("response", response);

        const noti: INotification = {
          status: "success",
          title: await translateString("Success"),
          message: await translateString("Successfully Transferred!"),
        };
        return noti;
      } catch (err) {
        console.error("Failed to send BTC transaction", err);
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

  static async broadcastTransaction(txHex: string): Promise<any> {
    try {
      const networkUrl =
        net_name === "mainnet"
          ? "https://blockstream.info/api/tx"
          : "https://blockstream.info/testnet/api/tx";
      const { data } = await axios.post(networkUrl, txHex, {
        headers: { "Content-Type": "text/plain" },
      });
      return data;
    } catch (error) {
      console.error("Failed to broadcast BTC transaction:", error);
      return null;
    }
  }

  static async getUTXOs(address: string): Promise<any[]> {
    try {
      const apiURL = `https://unisat.io/wallet-api-v4/address/btc-utxo?address=${address}`;
      const response: any = await tauriFetch(apiURL, {
        method: "GET",
        timeout: 30,
        responseType: ResponseType.JSON,
      });
      const data = response?.data?.result;
      console.log(data);
      return data?.map((utxo: any) => ({
        txid: utxo.txId,
        vout: utxo.outputIndex,
        amount: utxo.satoshis,
        hex: utxo.scriptPk,
      }));
    } catch (error) {
      console.error("Failed to fetch BTC UTXOs: ", error);
      return [];
    }
  }
}

export default Bitcoin;
