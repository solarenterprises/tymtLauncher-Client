import tymtStorage from "../../lib/Storage";
import { decrypt } from "../../lib/api/Encrypt";
import { getRPCUrl } from "../../lib/helper";
import ERC20 from "../../lib/wallet/ERC20";
import tymtCore from "../../lib/core/tymtCore";
import { checkNativeToken, getSupportNativeOrTokenBySymbol } from "../../lib/helper/WalletHelper";
import { IAccount } from "../../types/accountTypes";

export interface IRecipient {
  address: string;
  amount: string;
  chainSymbol?: string;
  tokenSymbol?: string;
  tokenAddr?: string;
  tokenDecimals?: Number;
  icon?: string;
}

export interface ISendCoinData {
  passphrase: string;
  fee: string;
  recipients: IRecipient[];
  vendorField?: string;
}

export interface ISendCoin {
  currentTokenSymbol: string;
  data: ISendCoinData;
}

export const sendCoin = async ({ currentTokenSymbol, data }: ISendCoin): Promise<any> => {
  try {
    console.log("sendCoin");
    const tx = { recipients: data.recipients, fee: data.fee };
    const accountStore: IAccount = JSON.parse(await tymtStorage.get(`account`));
    const rpc_url = getRPCUrl(currentTokenSymbol);
    const passphrase = await decrypt(accountStore?.mnemonic, data.passphrase);
    if (currentTokenSymbol === "SXP") {
      const res = await tymtCore.Blockchains.solar.wallet.sendTransaction(passphrase, tx);
      return res;
    } else if (currentTokenSymbol === "BTC") {
      const res = await tymtCore.Blockchains.btc.wallet.sendTransaction(passphrase, tx);
      return res;
    } else if (currentTokenSymbol === "SOL") {
      const res = await tymtCore.Blockchains.solana.wallet.sendTransaction(passphrase, tx);
      return res;
    } else if (checkNativeToken(currentTokenSymbol)) {
      const chaintx = { recipients: data.recipients, fee: data.fee };
      const res = await ERC20.sendTransaction(passphrase, rpc_url, chaintx);
      return res;
    } else {
      const selectedToken = getSupportNativeOrTokenBySymbol(currentTokenSymbol);
      const cointx = {
        recipients: data.recipients,
        fee: data.fee,
        tokenAddress: selectedToken.address,
      };
      const res = await ERC20.sendERCTransaction(passphrase, rpc_url, cointx);
      return res;
    }
  } catch (err) {
    console.log("Failed to sendCoin: ", err);
  }
};

export const sendCoinAPI = async ({ currentTokenSymbol, data }: ISendCoin): Promise<any> => {
  const accountStore: IAccount = JSON.parse(await tymtStorage.get(`accout`));
  const rpc_url = getRPCUrl(currentTokenSymbol);
  const passphrase = await decrypt(accountStore?.mnemonic, data.passphrase);
  // SXP, BTC, SOL is treated in WalletD53Transaction.tsx/handleApproveClick
  if (checkNativeToken(currentTokenSymbol)) {
    const chaintx = { recipients: data.recipients, fee: data.fee };
    const res = await ERC20.sendTransactionAPI(passphrase, rpc_url, chaintx);
    return res;
  } else {
    const selectedToken = getSupportNativeOrTokenBySymbol(currentTokenSymbol);
    const cointx = {
      recipients: data.recipients,
      fee: data.fee,
      tokenAddress: selectedToken.address,
    };
    const res = await ERC20.sendERCTransactionAPI(passphrase, rpc_url, cointx);
    return res;
  }
};
