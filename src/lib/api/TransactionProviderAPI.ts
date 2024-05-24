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
  INative,
  IToken,
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
      const res2: boolean = await this.validateTransactionToken(json_data);
      if (!res2) {
        noti = {
          status: "failed",
          title: "Send SXP",
          message: "Invalid token",
        };
        emit("res-POST-/send-transaction", noti);
        return false;
      }
      const res3: boolean = await this.validateTransactionAmount(json_data);
      if (!res3) {
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
    let res: boolean;
    for (let i = 0; i < json_data.transfer.length; i++) {
      switch (json_data.chain) {
        case "solar":
          res = tymtCore.Blockchains.solar.wallet.validateAddress(
            json_data.transfer[i].to
          );
          break;
        case "ethereum":
        case "polygon":
        case "binance":
        case "avalanche":
        case "arbitrum":
        case "optimism":
          res = tymtCore.Blockchains.eth.wallet.validateAddress(
            json_data.transfer[i].to
          );
          break;
        case "bitcoin":
          res = tymtCore.Blockchains.btc.wallet.validateAddress(
            json_data.transfer[i].to
          );
          break;
        case "solana":
          res = tymtCore.Blockchains.solana.wallet.validateAddress(
            json_data.transfer[i].to
          );
          break;
      }
      if (!res) return false;
    }
    return true;
  };

  // check if balance >= amount-to-be-sent + gas fee
  private static validateTransactionAmount = async (
    json_data: ISendTransactionReq
  ) => {
    const multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    const walletStore: walletType = JSON.parse(tymtStorage.get(`wallet`));
    const feeInUSD = Number(walletStore.fee) as number;
    const currentToken = await this.getToken(json_data);
    const isNativeToken = await this.isNativeToken(json_data);
    const totalAmount: number = json_data.transfer.reduce((sum, transfer) => {
      return (sum + Number(transfer.amount)) as number;
    }, 0);
    let address: string = "";
    let bal: number = 0;
    let price: number = currentToken.price as number; // Token price in USD
    switch (json_data.chain) {
      case "solar":
        address = multiWalletStore.Solar.chain.wallet;
        bal = await tymtCore.Blockchains.solar.wallet.getBalance(address);
        break;
      case "ethereum":
        address = multiWalletStore.Ethereum.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.eth.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.eth.wallet.getTokenBalance(address, [
                currentToken as IToken,
              ])
            )[0].balance; // Divided by decimal
        break;
      case "binance":
        address = multiWalletStore.Binance.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.bsc.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.bsc.wallet.getTokenBalance(address, [
                currentToken as IToken,
              ])
            )[0].balance; // Divided by decimal
        break;
      case "polygon":
        address = multiWalletStore.Polygon.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.polygon.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.polygon.wallet.getTokenBalance(
                address,
                [currentToken as IToken]
              )
            )[0].balance; // Divided by decimal
        break;
      case "arbitrum":
        address = multiWalletStore.Arbitrum.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.arbitrum.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.arbitrum.wallet.getTokenBalance(
                address,
                [currentToken as IToken]
              )
            )[0].balance; // Divided by decimal
        break;
      case "avalanche":
        address = multiWalletStore.Avalanche.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.avalanche.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.avalanche.wallet.getTokenBalance(
                address,
                [currentToken as IToken]
              )
            )[0].balance; // Divided by decimal
        break;
      case "optimism":
        address = multiWalletStore.Optimism.chain.wallet;
        bal = isNativeToken
          ? await tymtCore.Blockchains.op.wallet.getBalance(address)
          : (
              await tymtCore.Blockchains.op.wallet.getTokenBalance(address, [
                currentToken as IToken,
              ])
            )[0].balance; // Divided by decimal
        break;
      case "bitcoin":
        address = multiWalletStore.Bitcoin.chain.wallet;
        bal = await tymtCore.Blockchains.btc.wallet.getBalance(address);
        break;
      case "solana":
        address = multiWalletStore.Solana.chain.wallet;
        bal = await tymtCore.Blockchains.solana.wallet.getBalance(address);
        break;
    }
    let feeInToken: number = feeInUSD / price;
    let res = bal >= totalAmount + feeInToken;
    console.log(bal, totalAmount, feeInToken, feeInUSD, price);
    return res;
  };

  private static validateTransactionToken = async (
    json_data: ISendTransactionReq
  ) => {
    if (!json_data.token) return true;
    if (!(await this.getTokenOnly(json_data))) return false;
    return true;
  };

  // If token not existed, return the native token
  static getToken = async (json_data: ISendTransactionReq) => {
    let resToken: IToken;
    resToken = await this.getTokenOnly(json_data);
    if (resToken) return resToken;

    const { chain } = json_data;
    const multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    let nativeToken: INative;
    switch (chain) {
      case "solar":
        nativeToken = multiWalletStore.Solar.chain;
        break;
      case "ethereum":
        nativeToken = multiWalletStore.Ethereum.chain;
        break;
      case "binance":
        nativeToken = multiWalletStore.Binance.chain;
        break;
      case "polygon":
        nativeToken = multiWalletStore.Polygon.chain;
        break;
      case "arbitrum":
        nativeToken = multiWalletStore.Arbitrum.chain;
        break;
      case "avalanche":
        nativeToken = multiWalletStore.Avalanche.chain;
        break;
      case "optimism":
        nativeToken = multiWalletStore.Optimism.chain;
        break;
      case "bitcoin":
        nativeToken = multiWalletStore.Bitcoin.chain;
        break;
      case "solana":
        nativeToken = multiWalletStore.Solana.chain;
        break;
    }
    return nativeToken;
  };

  // Without native token
  private static getTokenOnly = async (json_data: ISendTransactionReq) => {
    if (!json_data.token) return undefined;
    const { chain, token } = json_data;
    const multiWalletStore: multiWalletType = JSON.parse(
      tymtStorage.get(`multiWallet`)
    );
    let resToken: IToken;
    switch (chain) {
      case "solar":
        resToken = undefined;
        break;
      case "ethereum":
        resToken = multiWalletStore.Ethereum.tokens.find(
          (element) => element.address === token
        );
        break;
      case "binance":
        resToken = multiWalletStore.Binance.tokens.find(
          (element) => element.address === token
        );
        break;
      case "polygon":
        resToken = multiWalletStore.Polygon.tokens.find(
          (element) => element.address === token
        );
        break;
      case "arbitrum":
        resToken = multiWalletStore.Arbitrum.tokens.find(
          (element) => element.address === token
        );
        break;
      case "avalanche":
        resToken = multiWalletStore.Avalanche.tokens.find(
          (element) => element.address === token
        );
        break;
      case "optimism":
        resToken = multiWalletStore.Optimism.tokens.find(
          (element) => element.address === token
        );
        break;
      case "bitcoin":
        resToken = undefined;
        break;
      case "solana":
        resToken = undefined;
        break;
    }
    return resToken;
  };

  static isNativeToken = async (json_data: ISendTransactionReq) => {
    if (!json_data.token) return true;
    if (!(await this.getTokenOnly(json_data))) return true;
    return false;
  };
  // currently tested only for Solar Blockchain
  static sendTransaction = async (
    jsonData: ISendTransactionReq,
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
    const recipients: IRecipient[] = [];
    for (let i = 0; i < jsonData.transfer.length; i++) {
      recipients.push({
        address: jsonData.transfer[i].to,
        amount: jsonData.transfer[i].amount,
      });
    }
    const tx = {
      recipients: recipients,
      fee: fee,
      vendorField: jsonData.memo,
    };
    switch (jsonData.chain) {
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
