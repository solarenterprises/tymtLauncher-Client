import { emit } from "@tauri-apps/api/event";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

import { tymt_backend_url } from "../../configs";
import { ChainIcons, ChainNames } from "../../consts/Chains";

import tymtCore from "../core/tymtCore";
import tymtStorage from "../Storage";
import ERC20 from "../wallet/ERC20";

import { IRecipient } from "../../features/wallet/CryptoApi";

import { decrypt } from "./Encrypt";
import { getSupportChainByName, getSupportTokenByAddress, getTokenPriceByCmc } from "../helper/WalletHelper";

import { IAccount, ILogin, IMnemonic, ISaltToken } from "../../types/accountTypes";
import { IGetAccountReq, IGetBalanceReq, ISendContractReq, ISendTransactionReq, ISignMessageReq, IVerifyMessageReq } from "../../types/TauriEventPayloadTypes";
import { IPriceList, ISupportNative, ISupportToken, IWallet } from "../../types/walletTypes";
import { IMyInfo } from "../../types/chatTypes";
import { IWalletSetting } from "../../types/settingTypes";

export default class TransactionProviderAPI {
  static getAccount = async (params: IGetAccountReq) => {
    const walletStore: IWallet = JSON.parse(tymtStorage.get(`wallet`));
    let res: string = "";
    switch (params.chain) {
      case "solar":
        res = walletStore?.solar;
        break;
      case "ethereum":
      case "polygon":
      case "binance":
      case "avalanche":
      case "arbitrum":
      case "optimism":
        res = walletStore?.ethereum;
        break;
      case "bitcoin":
        res = walletStore?.bitcoin;
        break;
      case "solana":
        res = walletStore?.solana;
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
      const res0: boolean = await this.validateTymtAccount(json_data);
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

  private static validateTymtAccount = async (json_data: ISendTransactionReq) => {
    const accountStore: IAccount = JSON.parse(tymtStorage.get(`account`));
    const myInfoStore: IMyInfo = JSON.parse(sessionStorage.getItem(`myInfo`));
    const loginStore: ILogin = JSON.parse(sessionStorage.getItem(`login`));
    if (accountStore?.mnemonic === "" || accountStore?.password === "" || myInfoStore?._id !== json_data.requestUserId || !loginStore?.isLoggedIn) {
      return false;
    }
    return true;
  };

  private static validateTransactionTo = async (json_data: ISendTransactionReq) => {
    let res: boolean;
    for (let i = 0; i < json_data.transfers.length; i++) {
      switch (json_data.chain) {
        case "solar":
          res = tymtCore.Blockchains.solar.wallet.validateAddress(json_data.transfers[i].to);
          break;
        case "ethereum":
        case "polygon":
        case "binance":
        case "avalanche":
        case "arbitrum":
        case "optimism":
          res = tymtCore.Blockchains.eth.wallet.validateAddress(json_data.transfers[i].to);
          break;
        case "bitcoin":
          res = tymtCore.Blockchains.btc.wallet.validateAddress(json_data.transfers[i].to);
          break;
        case "solana":
          res = tymtCore.Blockchains.solana.wallet.validateAddress(json_data.transfers[i].to);
          break;
      }
      if (!res) return false;
    }
    return true;
  };

  // check if balance >= amount-to-be-sent + gas fee
  private static validateTransactionAmount = async (json_data: ISendTransactionReq) => {
    const walletSettingStore: IWalletSetting = JSON.parse(tymtStorage.get(`walletSetting`));
    const walletStore: IWallet = JSON.parse(tymtStorage.get(`wallet`));
    const priceListStore: IPriceList = JSON.parse(sessionStorage.getItem(`priceList`));

    const feeInUSD = Number(walletSettingStore?.fee) as number;
    const currentToken = await this.getToken(json_data);
    const isNativeToken = await this.isNativeToken(json_data);
    const totalAmount: number = json_data.transfers.reduce((sum, transfer) => {
      return (sum + Number(transfer.amount)) as number;
    }, 0);
    let address: string = "";
    let bal: number = 0;
    let price: number = getTokenPriceByCmc(priceListStore, currentToken?.cmc);
    switch (json_data.chain) {
      case "solar":
        address = walletStore?.solar;
        bal = await tymtCore.Blockchains.solar.wallet.getBalance(address);
        break;
      case "ethereum":
        address = walletStore?.ethereum;
        bal = isNativeToken
          ? await tymtCore.Blockchains.eth.wallet.getBalance(address)
          : (await tymtCore.Blockchains.eth.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "binance":
        address = walletStore?.binance;
        bal = isNativeToken
          ? await tymtCore.Blockchains.bsc.wallet.getBalance(address)
          : (await tymtCore.Blockchains.bsc.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "polygon":
        address = walletStore?.polygon;
        bal = isNativeToken
          ? await tymtCore.Blockchains.polygon.wallet.getBalance(address)
          : (await tymtCore.Blockchains.polygon.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "arbitrum":
        address = walletStore?.arbitrum;
        bal = isNativeToken
          ? await tymtCore.Blockchains.arbitrum.wallet.getBalance(address)
          : (await tymtCore.Blockchains.arbitrum.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "avalanche":
        address = walletStore?.avalanche;
        bal = isNativeToken
          ? await tymtCore.Blockchains.avalanche.wallet.getBalance(address)
          : (await tymtCore.Blockchains.avalanche.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "optimism":
        address = walletStore?.optimism;
        bal = isNativeToken
          ? await tymtCore.Blockchains.op.wallet.getBalance(address)
          : (await tymtCore.Blockchains.op.wallet.getTokenBalance(address, [currentToken as ISupportToken]))[0].balance; // Divided by decimal
        break;
      case "bitcoin":
        address = walletStore?.bitcoin;
        bal = await tymtCore.Blockchains.btc.wallet.getBalance(address);
        break;
      case "solana":
        address = walletStore?.solana;
        bal = await tymtCore.Blockchains.solana.wallet.getBalance(address);
        break;
    }
    let feeInToken: number = feeInUSD / price;
    let res = bal >= totalAmount + feeInToken;
    console.log(bal, totalAmount, feeInToken, feeInUSD, price);
    return res;
  };

  private static validateTransactionToken = async (json_data: ISendTransactionReq) => {
    if (!json_data.token) return true;
    if (!(await this.getTokenOnly(json_data))) return false;
    return true;
  };

  // If token not existed, return the native token
  static getToken = async (json_data: ISendTransactionReq) => {
    const resToken = await this.getTokenOnly(json_data);
    if (resToken) return resToken;

    const { chain } = json_data;
    let nativeToken: ISupportNative;
    switch (chain) {
      case "solar":
        nativeToken = getSupportChainByName(ChainNames.SOLAR)?.chain;
        break;
      case "ethereum":
        nativeToken = getSupportChainByName(ChainNames.ETHEREUM)?.chain;
        break;
      case "binance":
        nativeToken = getSupportChainByName(ChainNames.BINANCE)?.chain;
        break;
      case "polygon":
        nativeToken = getSupportChainByName(ChainNames.POLYGON)?.chain;
        break;
      case "arbitrum":
        nativeToken = getSupportChainByName(ChainNames.ARBITRUM)?.chain;
        break;
      case "avalanche":
        nativeToken = getSupportChainByName(ChainNames.AVALANCHE)?.chain;
        break;
      case "optimism":
        nativeToken = getSupportChainByName(ChainNames.OPTIMISM)?.chain;
        break;
      case "bitcoin":
        nativeToken = getSupportChainByName(ChainNames.BITCOIN)?.chain;
        break;
      case "solana":
        nativeToken = getSupportChainByName(ChainNames.SOLANA)?.chain;
        break;
    }
    return nativeToken;
  };

  // Without native token
  private static getTokenOnly = async (json_data: ISendTransactionReq) => {
    if (!json_data.token) return undefined;
    const { token } = json_data;
    const resToken: ISupportToken = getSupportTokenByAddress(token);
    return resToken;
  };

  static isNativeToken = async (json_data: ISendTransactionReq) => {
    if (!json_data.token) return true;
    if (!(await this.getTokenOnly(json_data))) return true;
    return false;
  };

  static sendTransaction = async (jsonData: ISendTransactionReq, password: string, fee: string) => {
    let res: any;
    const accountStore: IAccount = JSON.parse(tymtStorage.get(`account`));
    console.log(accountStore?.mnemonic, password, fee);
    const passphrase: string = await decrypt(accountStore?.mnemonic, password);
    const recipients: IRecipient[] = [];
    for (let i = 0; i < jsonData.transfers.length; i++) {
      recipients.push({
        address: jsonData.transfers[i].to,
        amount: jsonData.transfers[i].amount,
      });
    }
    const tx = {
      recipients: recipients,
      fee: fee,
      vendorField: jsonData.memo,
    };
    switch (jsonData.chain) {
      case "solar":
        res = await tymtCore.Blockchains.solar.wallet.sendTransactionAPI(passphrase, tx);
        break;
      case "bitcoin":
        res = await tymtCore.Blockchains.btc.wallet.sendTransactionAPI(passphrase, tx);
        break;
      case "solana":
        res = await tymtCore.Blockchains.solana.wallet.sendTransactionAPI(passphrase, tx);
        break;
      // EVM chains are treated in CryptoApi.tsx/sendCoinAPI
    }
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    if (res?.status === "success") {
      const apiURL = `${tymt_backend_url}/orders/update-order/${jsonData._id}`;
      const headers: Record<string, any> = {
        "Content-Type": "application/json",
        "x-token": saltTokenStore.token,
      };
      const bodyContent1 = {
        status: "done",
        transaction: res?.transactionId,
      };
      const body1 = JSON.stringify(bodyContent1);
      const res1: any = await tauriFetch(apiURL, {
        method: "PUT",
        connectTimeout: 30,
        headers: headers,
        body: JSON.parse(body1)
      });
      console.log("done", await res1.json());
    } else if (res?.status === "failed") {
      const apiURL = `${tymt_backend_url}/orders/update-order/${jsonData._id}`;
      const headers: Record<string, any> = {
        "Content-Type": "application/json",
        "x-token": saltTokenStore.token,
      };
      const bodyContent1 = {
        status: "error",
        transaction: res?.message,
      };
      const body1 = JSON.stringify(bodyContent1);
      const res1: any = await tauriFetch(apiURL, {
        method: "PUT",
        connectTimeout: 30,
        headers: headers,
        body: JSON.parse(body1)
      });
      console.log("error", await res1.json());
    }
    return res;
  };

  static updateTransactionStatus = async (jsonData: ISendTransactionReq, status: string, transaction?: string) => {
    try {
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      let bodyContent1;
      if (transaction) {
        bodyContent1 = {
          status: status,
          transaction: transaction,
        };
      } else {
        bodyContent1 = {
          status: status,
        };
      }
      const body1 = JSON.stringify(bodyContent1);
      const apiURL = `${tymt_backend_url}/orders/update-order/${jsonData._id}`;
      const headers: Record<string, any> = {
        "Content-Type": "application/json",
        "x-token": saltTokenStore.token,
      };
      await tauriFetch(apiURL, {
        method: "PUT",
        connectTimeout: 30,
        headers: headers,
        body: JSON.parse(body1)
      });
    } catch (err) {
      console.error("Failed to update tx status: ", err);
    }
  };

  static sendContract = async (jsonData: ISendContractReq) => {
    try {
      const res = await ERC20.sendContract(jsonData);
      return res;
    } catch (err) {
      console.error("Failed to sendContract: ", err);
    }
  };

  static signMessage = async (jsonData: ISignMessageReq) => {
    try {
      const mnemonicStore: IMnemonic = JSON.parse(sessionStorage.getItem("mnemonic"));
      if (!jsonData || !jsonData.message || !jsonData.chain || !mnemonicStore.mnemonic) {
        return "";
      }
      let res: string;
      switch (jsonData.chain) {
        case "solar":
          res = tymtCore.Blockchains.solar.wallet.signMessage(jsonData.message, mnemonicStore.mnemonic);
          break;
        case "ethereum":
        case "polygon":
        case "binance":
        case "avalanche":
        case "arbitrum":
        case "optimism":
          res = await tymtCore.Blockchains.eth.wallet.signMessage(jsonData.message, mnemonicStore.mnemonic);
          break;
        case "bitcoin":
          break;
        case "solana":
          break;
      }
      return res;
    } catch (err) {
      console.error("Failed to signMessage: ", err);
      return "";
    }
  };

  static verifyMessage = async (jsonData: IVerifyMessageReq) => {
    try {
      const mnemonicStore: IMnemonic = JSON.parse(sessionStorage.getItem("mnemonic"));

      if (!jsonData || !jsonData.message || !jsonData.signature || !jsonData.chain) {
        return false;
      }
      let res: boolean;
      let publicKey: string;
      switch (jsonData.chain) {
        case "solar":
          publicKey = tymtCore.Blockchains.solar.wallet.getPublicKey(mnemonicStore.mnemonic);
          res = tymtCore.Blockchains.solar.wallet.verifyMessage(jsonData.message, publicKey, jsonData.signature);
          break;
        case "ethereum":
        case "polygon":
        case "binance":
        case "avalanche":
        case "arbitrum":
        case "optimism":
          const walletStore: IWallet = JSON.parse(tymtStorage.get(`wallet`));
          res = await tymtCore.Blockchains.eth.wallet.verifyMessage(jsonData.message, jsonData.signature, walletStore?.ethereum);
          break;
        case "bitcoin":
          break;
        case "solana":
          break;
      }
      return res;
    } catch (err) {
      console.error("Failed to verifyMessage: ", err);
      return false;
    }
  };

  static getChainIcon = (chain: string) => {
    let res: string;
    switch (chain) {
      case "ethereum":
        res = ChainIcons.ETHEREUM;
        break;
      case "binance":
        res = ChainIcons.BINANCE;
        break;
      case "polygon":
        res = ChainIcons.POLYGON;
        break;
      case "arbitrum":
        res = ChainIcons.ARBITRUM;
        break;
      case "avalanche":
        res = ChainIcons.AVALANCHE;
        break;
      case "optimism":
        res = ChainIcons.OPTIMISM;
        break;
      case "solar":
        res = ChainIcons.SOLAR;
        break;
      case "bitcoin":
        res = ChainIcons.BITCOIN;
        break;
      case "solana":
        res = ChainIcons.SOLANA;
        break;
    }
    return res;
  };

  static getChainName = (chain: string) => {
    let res: string;
    switch (chain) {
      case "ethereum":
        res = ChainNames.ETHEREUM;
        break;
      case "binance":
        res = ChainNames.BINANCE;
        break;
      case "polygon":
        res = ChainNames.POLYGON;
        break;
      case "arbitrum":
        res = ChainNames.ARBITRUM;
        break;
      case "avalanche":
        res = ChainNames.AVALANCHE;
        break;
      case "optimism":
        res = ChainNames.OPTIMISM;
        break;
      case "solar":
        res = ChainNames.SOLAR;
        break;
      case "bitcoin":
        res = ChainNames.BITCOIN;
        break;
      case "solana":
        res = ChainNames.SOLANA;
        break;
    }
    return res;
  };
}
