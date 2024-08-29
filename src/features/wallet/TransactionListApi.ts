import { IWallet } from "../../types/walletTypes";

import tymtStorage from "../../lib/Storage";
import Solar from "../../lib/wallet/Solar";
import tymtCore from "../../lib/core/tymtCore";
import Avalanche from "../../lib/wallet/Avalanche";
import ERC20 from "../../lib/wallet/ERC20";

import { getAPIAndKey, getTransactionUrl } from "../../lib/helper";
import { getCurrentChainWalletAddress, getSupportChainByName, getSupportNativeOrTokenBySymbol } from "../../lib/helper/WalletHelper";

export async function fetchTransactionList(data: { walletStore: IWallet; chainName: string; tokenSymbol: string; page: number }) {
  try {
    console.log("fetchTransactionList");
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
      if (currentSupportChain?.chain?.symbol === data?.tokenSymbol) {
        const url = getTransactionUrl(currentWalletAddress, data.chainName, data.page);
        return await ERC20.getTransactions(url);
      } else {
        const selectedToken = getSupportNativeOrTokenBySymbol(data?.tokenSymbol);

        const { api_url, api_key } = getAPIAndKey(data?.chainName);
        const url = `${api_url}?module=account&action=tokentx&contractaddress=${selectedToken.address}&address=${currentWalletAddress}&page=${data.page}&offset=15&apikey=${api_key}`;
        return await ERC20.getERCTransactions(url);
      }
    }
  } catch (err) {
    console.log("Failed to fetchTransactionList: ", err);
  }
}
