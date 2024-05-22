import { emit } from "@tauri-apps/api/event";
import { IRecipient } from "../../features/wallet/CryptoApi";
import { nonCustodialType } from "../../types/accountTypes";
import {
  IGetAccountReq,
  IGetBalanceReq,
  ISendTransactionReq,
} from "../../types/eventParamTypes";
import { walletType } from "../../types/settingTypes";
import {
  chainEnum,
  chainIconMap,
  multiWalletType,
} from "../../types/walletTypes";
import tymtCore from "../core/tymtCore";
import tymtStorage from "../Storage";
import { decrypt } from "./Encrypt";

export default class TransactionProviderAPI {
  static getAccount = async (params: IGetAccountReq) => {
    let multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    let res: string = "";
    switch (params.chain) {
      case "solar":
        res = multiWalletStore.Solar.chain.wallet;
        break;
      case "ethereum":
      case "polygon":
      case "binance":
      case "avalanche":
      case "arbitrum":
      case "optimism":
        res = multiWalletStore.Ethereum.chain.wallet;
        break;
      case "bitcoin":
        res = multiWalletStore.Bitcoin.chain.wallet;
        break;
      case "solana":
        res = multiWalletStore.Solana.chain.wallet;
        break;
    }
    return res;
  };

  static getBalance = async (params: IGetBalanceReq) => {
    const { chain, address } = params;
    let bal: number = 0;
    switch (chain) {
      case "solar":
        bal = await tymtCore.Blockchains.solar.wallet.getBalance(address);
        bal *= 1e8; // SXP decimal
        break;
      case "bitcoin":
        bal = await tymtCore.Blockchains.btc.wallet.getBalance(address);
        bal *= 1e8; // BTC decimal
        break;
      case "solana":
        bal = await tymtCore.Blockchains.solana.wallet.getBalance(address);
        bal *= 1e9; // SOL decimal
        break;
      case "ethereum":
        bal = await tymtCore.Blockchains.eth.wallet.getBalance(address);
        bal *= 1e9 * 1e9; // ETH decimal
        break;
      case "binance":
        bal = await tymtCore.Blockchains.bsc.wallet.getBalance(address);
        bal *= 1e9 * 1e9; // BNB decimal
        break;
      case "polygon":
        bal = await tymtCore.Blockchains.polygon.wallet.getBalance(address);
        bal *= 1e9 * 1e9;
        break;
      case "arbitrum":
        bal = await tymtCore.Blockchains.arbitrum.wallet.getBalance(address);
        bal *= 1e9 * 1e9;
        break;
      case "avalanche":
        bal = await tymtCore.Blockchains.avalanche.wallet.getBalance(address);
        bal *= 1e9 * 1e9;
        break;
      case "optimism":
        bal = await tymtCore.Blockchains.op.wallet.getBalance(address);
        bal *= 1e9 * 1e9;
        break;
    }
    return bal;
  };

  static validateTransaction = async (json_data: ISendTransactionReq) => {
    let noti: any;
    try {
      const res0: boolean = await this.validateTymtAccount();
      if (!res0) {
        noti = {
          status: "failed",
          title: "Send SXP",
          message: "No tymtLauncher Account",
        };
        emit("res-POST-/send-transaction", noti);
        return false;
      }
      const res1: boolean = await this.validateTransactionTo(json_data);
      if (!res1) {
        noti = {
          status: "failed",
          title: "Send SXP",
          message: "Invalid recipient",
        };
        emit("res-POST-/send-transaction", noti);
        return false;
      }
      const res2: boolean = await this.validateTransactionAmount(json_data);
      if (!res2) {
        noti = {
          status: "failed",
          title: "Send SXP",
          message: "Insufficient balance",
        };
        emit("res-POST-/send-transaction", noti);
        return false;
      }
    } catch (err) {
      console.error("TransactionProviderAPI.validateTransaction failed: ", err);
      noti = {
        status: "failed",
        title: "Send SXP",
        message: err.toString(),
      };
      emit("res-POST-/send-transaction", noti);
      return false;
    }
    return true;
  };

  private static validateTymtAccount = async () => {
    const nonCustodialStore: nonCustodialType = JSON.parse(
      tymtStorage.get(`nonCustodial`)
    );
    if (
      nonCustodialStore.mnemonic === "" ||
      nonCustodialStore.password === ""
    ) {
      return false;
    }
    return true;
  };

  private static validateTransactionTo = async (
    json_data: ISendTransactionReq
  ) => {
    const { to, chain } = json_data;
    let res: boolean;
    switch (chain) {
      case "solar":
        res = tymtCore.Blockchains.solar.wallet.validateAddress(to);
        break;
      case "ethereum":
      case "polygon":
      case "binance":
      case "avalanche":
      case "arbitrum":
      case "optimism":
        res = tymtCore.Blockchains.eth.wallet.validateAddress(to);
        break;
      case "bitcoin":
        res = tymtCore.Blockchains.btc.wallet.validateAddress(to);
        break;
      case "solana":
        res = tymtCore.Blockchains.solana.wallet.validateAddress(to);
        break;
    }
    return res;
  };

  // check if balance >= amount-to-be-sent + gas fee
  private static validateTransactionAmount = async (
    json_data: ISendTransactionReq
  ) => {
    const { amount, chain } = json_data;
    const multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    const walletStore: walletType = JSON.parse(tymtStorage.get(`wallet`));
    const feeInUSD = Number(walletStore.fee) as number;
    let address: string = "";
    let bal: number = 0;
    let price: number = 0;
    switch (chain) {
      case "solar":
        address = multiWalletStore.Solar.chain.wallet;
        bal = await tymtCore.Blockchains.solar.wallet.getBalance(address);
        price = multiWalletStore.Solar.chain.price as number; // SXP price in USD
        break;
      case "ethereum":
        address = multiWalletStore.Ethereum.chain.wallet;
        bal = await tymtCore.Blockchains.eth.wallet.getBalance(address);
        price = multiWalletStore.Ethereum.chain.price as number;
        break;
      case "binance":
        address = multiWalletStore.Binance.chain.wallet;
        bal = await tymtCore.Blockchains.bsc.wallet.getBalance(address);
        price = multiWalletStore.Binance.chain.price as number;
        break;
      case "polygon":
        address = multiWalletStore.Polygon.chain.wallet;
        bal = await tymtCore.Blockchains.polygon.wallet.getBalance(address);
        price = multiWalletStore.Polygon.chain.price as number;
        break;
      case "arbitrum":
        address = multiWalletStore.Arbitrum.chain.wallet;
        bal = await tymtCore.Blockchains.arbitrum.wallet.getBalance(address);
        price = multiWalletStore.Arbitrum.chain.price as number;
        break;
      case "avalanche":
        address = multiWalletStore.Avalanche.chain.wallet;
        bal = await tymtCore.Blockchains.avalanche.wallet.getBalance(address);
        price = multiWalletStore.Avalanche.chain.price as number;
        break;
      case "optimism":
        address = multiWalletStore.Optimism.chain.wallet;
        bal = await tymtCore.Blockchains.op.wallet.getBalance(address);
        price = multiWalletStore.Optimism.chain.price as number;
        break;
      case "bitcoin":
        address = multiWalletStore.Bitcoin.chain.wallet;
        bal = await tymtCore.Blockchains.btc.wallet.getBalance(address);
        price = multiWalletStore.Bitcoin.chain.price as number;
        break;
      case "solana":
        address = multiWalletStore.Solana.chain.wallet;
        bal = await tymtCore.Blockchains.solana.wallet.getBalance(address);
        price = multiWalletStore.Solana.chain.price as number;
        break;
    }
    let feeInToken: number = feeInUSD / price;
    let res = bal >= (Number(amount) as number) + feeInToken;
    console.log(bal, amount, feeInToken, feeInUSD, price);
    return res;
  };

  // currently tested only for Solar Blockchain
  static sendTransaction = async (
    chain: string,
    to: string,
    amount: string,
    memo: string,
    password: string,
    fee: string
  ) => {
    let res: any;
    const nonCustodialStore: nonCustodialType = JSON.parse(
      tymtStorage.get(`nonCustodial`)
    );
    const passphrase: string = await decrypt(
      nonCustodialStore.mnemonic,
      password
    );
    const recipients: IRecipient[] = [
      {
        address: to,
        amount: amount,
      },
    ];
    const tx = {
      recipients: recipients,
      fee: fee,
      vendorField: memo,
    };
    switch (chain) {
      case "solar":
        res = await tymtCore.Blockchains.solar.wallet.sendTransactionAPI(
          passphrase,
          tx
        );
        break;
      case "bitcoin":
        res = await tymtCore.Blockchains.btc.wallet.sendTransactionAPI(
          passphrase,
          tx
        );
        break;
      case "solana":
        res = await tymtCore.Blockchains.solana.wallet.sendTransactionAPI(
          passphrase,
          tx
        );
        break;
      // EVM chains are treated in CryptoApi.tsx/sendCoinAPI
    }
    return res;
  };

  static getChainIcon = (chain: string) => {
    let res: string;
    switch (chain) {
      case "ethereum":
        res = chainIconMap.get(chainEnum.ethereum);
        break;
      case "binance":
        res = chainIconMap.get(chainEnum.binance);
        break;
      case "polygon":
        res = chainIconMap.get(chainEnum.polygon);
        break;
      case "arbitrum":
        res = chainIconMap.get(chainEnum.arbitrumone);
        break;
      case "avalanche":
        res = chainIconMap.get(chainEnum.avalanche);
        break;
      case "optimism":
        res = chainIconMap.get(chainEnum.optimism);
        break;
      case "solar":
        res = chainIconMap.get(chainEnum.solar);
        break;
      case "bitcoin":
        res = chainIconMap.get(chainEnum.bitcoin);
        break;
      case "solana":
        res = chainIconMap.get(chainEnum.solana);
        break;
    }
    return res;
  };

  static getChainName = (chain: string) => {
    let res: string;
    switch (chain) {
      case "ethereum":
        res = "Ethereum";
        break;
      case "binance":
        res = "Binance";
        break;
      case "polygon":
        res = "Polygon";
        break;
      case "arbitrum":
        res = "Arbitrum";
        break;
      case "avalanche":
        res = "Avalanche C-Chain";
        break;
      case "optimism":
        res = "Optimism";
        break;
      case "solar":
        res = "Solar Blockchain";
        break;
      case "bitcoin":
        res = "Bitcoin";
        break;
      case "solana":
        res = "Solana";
        break;
    }
    return res;
  };
}
