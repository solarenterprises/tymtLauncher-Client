import * as bip39 from "bip39";
import { IBalance, IBalanceList, IPrice, IPriceList, IWallet } from "../../types/walletTypes";
import tymtCore from "../core/tymtCore";
import { ChainNames } from "../../consts/Chains";
import { supportChains } from "../../consts/SupportTokens";
import { Identities, Managers } from "@solar-network/crypto";
import { Hash, HashAlgorithms } from "@solar-network/crypto/dist/crypto/index.js";

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

export const getSupportNativeOrTokenBySymbol = (tokenSymbol: string) => {
  try {
    const res_1 = supportChains?.find((chain) => chain?.chain?.symbol === tokenSymbol)?.chain;
    if (res_1) return res_1;
    for (const chain of supportChains) {
      const token = chain?.tokens?.find((token) => token?.symbol === tokenSymbol);
      if (token) {
        return token;
      }
    }
  } catch (err) {
    console.log("Failed to getSupportNativeOrTokenBySymbol: ", err);
  }
};

export const getSupportTokenByAddress = (address: string) => {
  try {
    for (const chain of supportChains) {
      const token = chain?.tokens?.find((token) => token?.address === address);
      if (token) {
        return token;
      }
    }
  } catch (err) {
    console.log("Failed to getSupportTokenByAddress: ", err);
  }
};

export const getSupportChainByName = (chainName: string) => {
  try {
    const res = supportChains?.find((one) => one?.chain?.name === chainName);
    return res;
  } catch (err) {
    console.log("Failed to getSupportChainByName: ", err);
  }
};

export const getSupportTokensByChainName = (chainName: string) => {
  try {
    const res = getSupportChainByName(chainName)?.tokens;
    return res;
  } catch (err) {
    console.log("Failed to getSupportTokensByChainName: ", err);
  }
};

export const getNativeCmcByChainName = (chainName: string) => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const res = supportChain?.chain?.cmc;
    return res;
  } catch (err) {
    console.log("Failed to getNativeCmcByChainName: ", err);
  }
};

export const getNativeSymbolByChainName = (chainName: string) => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const res = supportChain?.chain?.symbol;
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getNativeTokenPriceByChainName = (priceListStore: IPriceList, chainName: string) => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const cmc = supportChain?.chain?.cmc;
    const res = getTokenPriceByCmc(priceListStore, cmc);
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const getNativeTokenBalanceByChainName = (balanceListStore: IBalanceList, chainName: string) => {
  try {
    const supportChain = getSupportChainByName(chainName);
    const symbol = supportChain?.chain?.symbol;
    const res = getTokenBalanceBySymbol(balanceListStore, symbol);
    return res;
  } catch (err) {
    console.log("Failed to getNativeSymbolByChainName: ", err);
  }
};

export const checkNativeToken = (tokenSymbol: string) => {
  try {
    const res = supportChains?.some((one) => one?.chain?.symbol === tokenSymbol);
    return res;
  } catch (err) {
    console.log("Failed to checkNativeToken: ", err);
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
      uniqueCmcSet.add(item.cmc); // Add to the set
      return item;
    });

    const altTokens: IPrice[] = supportChains?.flatMap((chain) =>
      chain?.tokens?.reduce((acc, token) => {
        if (!uniqueCmcSet.has(token.cmc)) {
          const item: IPrice = {
            cmc: token?.cmc,
            price: 0.0,
          };
          uniqueCmcSet.add(item.cmc);
          acc.push(item);
        }
        return acc;
      }, [])
    );

    const res = [...nativeTokens, ...altTokens];
    return res;
  } catch (err) {
    console.log("Failed to resetPriceList: ", err);
  }
};

export const getCredentials = async (mnemonic: string) => {
  Managers.configManager.setFromPreset("mainnet");
  const keys = Identities.Keys.fromPassphrase(mnemonic);
  const message = mnemonic;
  const hash = HashAlgorithms.sha256(message);
  const signature = Hash.signSchnorr(hash, keys);
  return signature;
};
