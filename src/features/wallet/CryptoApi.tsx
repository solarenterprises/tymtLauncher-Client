import tymtStorage from "../../lib/Storage";
import Solar from "../../lib/wallet/Solar";
import { IChain } from "../../types/walletTypes";
import { decrypt } from "../../lib/api/Encrypt";
import { getAPIAndKey, getRPCUrl, getTransactionUrl } from "../../lib/helper";
import ERC20 from "../../lib/wallet/ERC20";
import Avalanche from "../../lib/wallet/Avalanche";
import tymtCore from "../../lib/core/tymtCore";
// import { INotification } from "./CryptoSlice";

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
  chain: IChain;
  data: ISendCoinData;
}

export const sendCoin = async ({ chain, data }: ISendCoin): Promise<any> => {
  const tx = { recipients: data.recipients, fee: data.fee };
  const nonCustodialStore = JSON.parse(await tymtStorage.get(`nonCustodial`));
  const rpc_url = getRPCUrl(chain);
  const passphrase = await decrypt(nonCustodialStore.mnemonic, data.passphrase);
  if (chain.chain.symbol === "SXP") {
    const res = await tymtCore.Blockchains.solar.wallet.sendTransaction(passphrase, tx);
    return res;
  } else if (chain.chain.symbol === "BTC") {
    const res = await tymtCore.Blockchains.btc.wallet.sendTransaction(passphrase, tx);
    return res;
  } else if (chain.chain.symbol === "SOL") {
    const res = await tymtCore.Blockchains.solana.wallet.sendTransaction(passphrase, tx);
    return res;
  } else if (chain.currentToken === "chain" || chain.currentToken == "") {
    const chaintx = { recipients: data.recipients, fee: data.fee };
    const res = await ERC20.sendTransaction(passphrase, rpc_url, chaintx);
    return res;
  } else {
    let selectedToken;
    chain.tokens.map((token) => {
      if (token.symbol == chain.currentToken) {
        selectedToken = token;
      }
    });
    const cointx = {
      recipients: data.recipients,
      fee: data.fee,
      tokenAddress: selectedToken.address,
    };
    const res = await ERC20.sendERCTransaction(passphrase, rpc_url, cointx);
    return res;
  }
};

export const sendCoinAPI = async ({ chain, data }: ISendCoin): Promise<any> => {
  const nonCustodialStore = JSON.parse(await tymtStorage.get(`nonCustodial`));
  const rpc_url = getRPCUrl(chain);
  const passphrase = await decrypt(nonCustodialStore.mnemonic, data.passphrase);
  // SXP, BTC, SOL is treated in WalletD53Transaction.tsx/handleApproveClick
  if (chain.currentToken === "chain" || chain.currentToken == "") {
    const chaintx = { recipients: data.recipients, fee: data.fee };
    const res = await ERC20.sendTransactionAPI(passphrase, rpc_url, chaintx);
    return res;
  } else {
    let selectedToken;
    chain.tokens.map((token) => {
      if (token.symbol == chain.currentToken) {
        selectedToken = token;
      }
    });
    const cointx = {
      recipients: data.recipients,
      fee: data.fee,
      tokenAddress: selectedToken.address,
    };
    const res = await ERC20.sendERCTransactionAPI(passphrase, rpc_url, cointx);
    return res;
  }
};

export async function walletTransaction(data: { chain: IChain; page: number }) {
  tymtStorage.set(`loadMoreAvailable`, true);
  if (data.chain.chain.symbol === "SXP") {
    return await Solar.getTransactions(data.chain.chain.wallet, data.page);
  } else if (data.chain.chain.symbol === "BTC") {
    return await tymtCore.Blockchains.btc.wallet.getTransactions(data.chain.chain.wallet, data.page);
  } else if (data.chain.chain.symbol === "AVAX") {
    return await Avalanche.getTransactions(data.chain.chain.wallet, data.page);
  } else if (data.chain.chain.symbol === "SOL") {
    return await tymtCore.Blockchains.solana.wallet.getTransactions(data.chain.chain.wallet, data.page);
  } else {
    if (data.chain.currentToken == "chain" || data.chain.currentToken == "") {
      const url = getTransactionUrl(data.chain, data.page);
      return await ERC20.getTransactions(url);
    } else {
      let selectedToken;
      data.chain.tokens.map((token) => {
        if (token.symbol == data.chain.currentToken) {
          selectedToken = token;
        }
      });
      const { api_url, api_key } = getAPIAndKey(data.chain);
      const url = `${api_url}?module=account&action=tokentx&contractaddress=${selectedToken.address}&address=${data.chain.chain.wallet}&page=${data.page}&offset=15&apikey=${api_key}`;
      return await ERC20.getERCTransactions(url);
    }
  }
}
