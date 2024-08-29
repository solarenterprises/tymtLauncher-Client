import tymtStorage from "../../lib/Storage";
import Solar from "../../lib/wallet/Solar";
import { IChain, IWallet } from "../../types/walletTypes";
import { decrypt } from "../../lib/api/Encrypt";
import { getAPIAndKey, getRPCUrl, getTransactionUrl } from "../../lib/helper";
import ERC20 from "../../lib/wallet/ERC20";
import Avalanche from "../../lib/wallet/Avalanche";
import tymtCore from "../../lib/core/tymtCore";
import { getCurrentChainWalletAddress, getSupportChainByName, getSupportNativeOrTokenBySymbol } from "../../lib/helper/WalletHelper";
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

export async function walletTransaction(data: { walletStore: IWallet; chainName: string; tokenSymbol: string; page: number }) {
  console.log("fetchTransactions");
  tymtStorage.set(`loadMoreAvailable`, true);
  const currentSupportChain = getSupportChainByName(data?.chainName);
  const currentWalletAddress = getCurrentChainWalletAddress(data?.walletStore, data?.chainName);
  if (currentSupportChain?.chain?.symbol === "SXP") {
    return await Solar.getTransactions(currentWalletAddress, data.page);
  } else if (currentSupportChain?.chain?.symbol === "BTC") {
    return await tymtCore.Blockchains.btc.wallet.getTransactions(currentWalletAddress, data.page);
  } else if (currentSupportChain?.chain?.symbol === "AVAX") {
    return await Avalanche.getTransactions(currentWalletAddress, data.page);
  } else if (currentSupportChain?.chain?.symbol === "SOL") {
    return await tymtCore.Blockchains.solana.wallet.getTransactions(currentWalletAddress, data.page);
  } else {
    if (data?.tokenSymbol == "chain" || data?.tokenSymbol == "") {
      const url = getTransactionUrl(currentWalletAddress, data.chainName, data.page);
      return await ERC20.getTransactions(url);
    } else {
      const selectedToken = getSupportNativeOrTokenBySymbol(data?.tokenSymbol);

      const { api_url, api_key } = getAPIAndKey(data?.chainName);
      const url = `${api_url}?module=account&action=tokentx&contractaddress=${selectedToken.address}&address=${currentWalletAddress}&page=${data.page}&offset=15&apikey=${api_key}`;
      return await ERC20.getERCTransactions(url);
    }
  }
}
