import * as bip39 from "bip39";
import { IBalance, IBalanceList, IPrice, IPriceList, IWallet } from "../../types/walletTypes";
import tymtCore from "../core/tymtCore";
import { ChainNames } from "../../consts/Chains";
import { supportChains } from "../../consts/SupportTokens";

export const getWalletAddressFromPassphrase = async (passphrase: string) => {
  try {
    const solarAddr = await tymtCore.Blockchains.solar.wallet.getAddress(passphrase);
    const bscAddr = await tymtCore.Blockchains.bsc.wallet.getAddress(passphrase);
    const ethereumAddr = await tymtCore.Blockchains.eth.wallet.getAddress(passphrase);
    const bitcoinAddr = await tymtCore.Blockchains.btc.wallet.getAddress(passphrase);
    const solanaAddr = await tymtCore.Blockchains.solana.wallet.getAddress(passphrase);
    const polygonAddr = await tymtCore.Blockchains.polygon.wallet.getAddress(passphrase);
    const avalancheAddr = await tymtCore.Blockchains.avalanche.wallet.getAddress(passphrase);
    const arbitrumAddr = await tymtCore.Blockchains.arbitrum.wallet.getAddress(passphrase);
    const optimismAddr = await tymtCore.Blockchains.op.wallet.getAddress(passphrase);

    const res: IWallet = {
      arbitrum: arbitrumAddr,
      avalanche: avalancheAddr,
      bitcoin: bitcoinAddr,
      binance: bscAddr,
      ethereum: ethereumAddr,
      optimism: optimismAddr,
      polygon: polygonAddr,
      solana: solanaAddr,
      solar: solarAddr,
    };

    console.log("getWalletAddressFromPassphrase", res);
    return res;
  } catch (err) {
    console.log("Failed to getWalletAddressFromPassphrase: ", err);
  }
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Clone the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

export const getMnemonic = (_length: number) => {
  if (_length === 12) {
    return `${bip39.generateMnemonic()}`;
  } else if (_length === 24) {
    return `${bip39.generateMnemonic()} ${bip39.generateMnemonic()}`;
  }
  return "";
};

export const checkMnemonic = (_mnemonic: string) => {
  if (_mnemonic.split(" ").length == 24) {
    return (
      (bip39.validateMnemonic(_mnemonic.split(" ").slice(0, 12).join(" ")) && bip39.validateMnemonic(_mnemonic.split(" ").slice(12, 24).join(" "))) ||
      bip39.validateMnemonic(_mnemonic)
    );
  } else if (_mnemonic.split(" ").length == 12) {
    return bip39.validateMnemonic(_mnemonic);
  }
  return false;
};

export const getTokenPriceByCmc = (priceListStore: IPriceList, cmc: string) => {
  try {
    const res = priceListStore?.list?.find((one) => one?.cmc === cmc)?.price;
    return res;
  } catch (err) {
    console.log("Failed to getCurrentChainNativeTokenPrice: ", err);
  }
};

export const getTokenBalanceBySymbol = (balanceListStore: IBalanceList, symbol: string) => {
  try {
    const res = balanceListStore?.list?.find((one) => one?.symbol === symbol)?.balance;
    return res;
  } catch (err) {
    console.log("Failed to getTokenBalanceBySymbol: ", err);
  }
};

export const getSupportChainByName = (name: string) => {
  try {
    const res = supportChains?.find((one) => one?.chain?.name === name);
    return res;
  } catch (err) {
    console.log("Failed to getSupportChainByName: ", err);
  }
};

export const getNativeCmcByChainName = (name: string) => {
  try {
    const supportChain = supportChains?.find((one) => one?.chain?.name === name);
    const res = supportChain?.chain?.cmc;
    return res;
  } catch (err) {
    console.log("Failed to getNativeCmcByChainName: ", err);
  }
};

export const getNativeSymbolByChainName = (name: string) => {
  try {
    const supportChain = supportChains?.find((one) => one?.chain?.name === name);
    const res = supportChain?.chain?.symbol;
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getNativeTokenPriceByChainName = (priceListStore: IPriceList, chainName: string) => {
  try {
    const supportChain = supportChains?.find((one) => one?.chain?.name === chainName);
    const cmc = supportChain?.chain?.cmc;
    const res = getTokenPriceByCmc(priceListStore, cmc);
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getNativeTokenBalanceByChainName = (balanceListStore: IBalanceList, chainName: string) => {
  try {
    const supportChain = supportChains?.find((one) => one?.chain?.name === chainName);
    const symbol = supportChain?.chain?.symbol;
    const res = getTokenBalanceBySymbol(balanceListStore, symbol);
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getCurrentChainWalletAddress = (walletStore: IWallet, chainName: string) => {
  try {
    let res: string = "";
    switch (chainName) {
      case ChainNames.ARBITRUM:
        res = walletStore?.arbitrum;
        break;
      case ChainNames.AVALANCHE:
        res = walletStore?.avalanche;
        break;
      case ChainNames.BINANCE:
        res = walletStore?.binance;
        break;
      case ChainNames.BITCOIN:
        res = walletStore?.bitcoin;
        break;
      case ChainNames.ETHEREUM:
        res = walletStore?.ethereum;
        break;
      case ChainNames.OPTIMISM:
        res = walletStore?.optimism;
        break;
      case ChainNames.POLYGON:
        res = walletStore?.polygon;
        break;
      case ChainNames.SOLANA:
        res = walletStore?.solana;
        break;
      case ChainNames.SOLAR:
        res = walletStore?.solar;
        break;
    }
    return res;
  } catch (err) {
    console.log("Failed to getCurrentChainWalletAddress: ", err);
  }
};

export const resetBalanceList = () => {
  try {
    const nativeTokens: IBalance[] = supportChains?.map((one) => {
      const item: IBalance = {
        symbol: one?.chain?.symbol,
        balance: 0.0,
      };
      return item;
    });

    const altTokens: IBalance[] = supportChains?.flatMap((chain) =>
      chain?.tokens?.map((token) => {
        const item: IBalance = {
          symbol: token?.symbol,
          balance: 0.0,
        };
        return item;
      })
    );

    const res: IBalance[] = [...nativeTokens, ...altTokens];
    return res;
  } catch (err) {
    console.log("Failed to resetBalanceList: ", err);
  }
};

export const resetPriceList = () => {
  try {
    const uniqueCmcSet = new Set();

    const nativeTokens: IPrice[] = supportChains?.map((one) => {
      const item: IPrice = {
        cmc: one?.chain?.cmc,
        price: 0.0,
      };
      return item;
    });

    const altTokens: IPrice[] = supportChains?.flatMap((chain) =>
      chain?.tokens?.map((token) => {
        const item: IPrice = {
          cmc: token?.cmc,
          price: 0.0,
        };
        return item;
      })
    );

    const res: IPrice[] = [...nativeTokens, ...altTokens].filter((item) => uniqueCmcSet.has(item.cmc) && uniqueCmcSet.delete(item.cmc));
    return res;
  } catch (err) {
    console.log("Failed to resetPriceList: ", err);
  }
};
