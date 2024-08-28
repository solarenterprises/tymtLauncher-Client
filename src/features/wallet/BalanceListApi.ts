import { ChainNames } from "../../consts/Chains";
import { supportChains } from "../../consts/SupportTokens";
import tymtCore from "../../lib/core/tymtCore";
import { getCurrentChainWalletAddress, getNativeSymbolByChainName, getSupportTokensByChainName } from "../../lib/helper/WalletHelper";
import { IBalance, IParamsFetchChainBalance, IWallet } from "../../types/walletTypes";

export const fetchBalanceList = async (walletStore: IWallet) => {
  try {
    console.log("fetchBalanceList");
    const asyncFunctions = supportChains?.map((one) =>
      fetchChainBalance({
        walletStore: walletStore,
        chainName: one?.chain?.name,
      })
    );
    const result = await Promise.all(asyncFunctions);
    const flattenedResult = result?.flat();
    return flattenedResult;
  } catch (err) {
    console.log("Failed to fetchBalanceList: ", err);
  }
};

export const fetchChainBalance = async ({ walletStore, chainName }: IParamsFetchChainBalance) => {
  try {
    console.log("fetchChainBalance");
    const walletAddress = getCurrentChainWalletAddress(walletStore, chainName);
    const supportTokens = getSupportTokensByChainName(chainName);
    let nativeBalance: IBalance;
    let tokenBalances: IBalance[] = [];
    switch (chainName) {
      case ChainNames.ARBITRUM:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.arbitrum.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.arbitrum.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.AVALANCHE:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.avalanche.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.avalanche.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.BINANCE:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.bsc.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.bsc.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.BITCOIN:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.btc.wallet.getBalance(walletAddress),
        };
        break;
      case ChainNames.ETHEREUM:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.eth.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.eth.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.OPTIMISM:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.op.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.op.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.POLYGON:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.polygon.wallet.getBalance(walletAddress),
        };
        tokenBalances = await tymtCore.Blockchains.polygon.wallet.getTokenBalance(walletAddress, supportTokens);
        break;
      case ChainNames.SOLANA:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.solana.wallet.getBalance(walletAddress),
        };
        break;
      case ChainNames.SOLAR:
        nativeBalance = {
          symbol: getNativeSymbolByChainName(chainName),
          balance: await tymtCore.Blockchains.solar.wallet.getBalance(walletAddress),
        };
        break;
    }
    const res = [...tokenBalances, nativeBalance];
    return res;
  } catch (err) {
    console.log("Failed to fetchChainBalance: ", err);
  }
};
