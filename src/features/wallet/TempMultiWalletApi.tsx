import tymtCore from "../../lib/core/tymtCore";

import solarIcon from "../../assets/chains/solar.svg";

import { Identities, Managers } from "@solar-network/crypto";
import { Hash, HashAlgorithms } from "@solar-network/crypto/dist/crypto/index.js";

import tymtStorage from "../../lib/Storage";
import { chainEnum, chainIconMap } from "../../types/walletTypes";

interface MnemonicPayload {
  mnemonic: string;
}

export const getCredentials = async (mnemonic: string) => {
  Managers.configManager.setFromPreset("mainnet");
  const keys = Identities.Keys.fromPassphrase(mnemonic);
  const message = mnemonic;
  const hash = HashAlgorithms.sha256(message);
  const signature = Hash.signSchnorr(hash, keys);
  return signature;
};

export const getTempAddressesFromMnemonic = async (payload: MnemonicPayload) => {
  const { mnemonic } = payload;

  const signature = await getCredentials(mnemonic.normalize("NFD"));
  tymtStorage.set(`tempD53Password`, JSON.stringify({ password: signature }));

  const solarAddr = await tymtCore.Blockchains.solar.wallet.getAddress(mnemonic);
  const bscAddr = await tymtCore.Blockchains.bsc.wallet.getAddress(mnemonic);
  const ethereumAddr = await tymtCore.Blockchains.eth.wallet.getAddress(mnemonic);
  const bitcoinAddr = await tymtCore.Blockchains.btc.wallet.getAddress(mnemonic);
  const solanaAddr = await tymtCore.Blockchains.solana.wallet.getAddress(mnemonic);
  const polygonAddr = await tymtCore.Blockchains.polygon.wallet.getAddress(mnemonic);
  const avalancheAddr = await tymtCore.Blockchains.avalanche.wallet.getAddress(mnemonic);
  const arbitrumAddr = await tymtCore.Blockchains.arbitrum.wallet.getAddress(mnemonic);
  const optimismAddr = await tymtCore.Blockchains.op.wallet.getAddress(mnemonic);

  return {
    Ethereum: {
      chain: {
        address: "",
        symbol: "ETH",
        name: "Ethereum",
        key: "ethereum",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.ethereum),
        website: "https://ethereum.org/",
        chainId: 1,
        wallet: ethereumAddr,
        balance: 0,
        price: 0,
        cmc: "ethereum",
      },
      tokens: [
        {
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          decimals: 18,
          displaySymbol: "WETH",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
          name: "WETH",
          symbol: "WETH",
          website: "https://weth.io/",
          balance: 0,
          price: 0,
          cmc: "wrapped-ether-mantle-bridge",
        },
        {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          decimals: 6,
          displaySymbol: "USDT",
          logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
          name: "Tether",
          symbol: "USDT",
          website: "https://tether.to",
          balance: 0,
          price: 0,
          cmc: "tether",
        },
        {
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          decimals: 6,
          displaySymbol: "USDC",
          logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
          name: "USD Coin",
          symbol: "USDC",
          website: "https://centre.io/usdc",
          balance: 0,
          price: 0,
          cmc: "usd-coin",
        },
      ],
      currentToken: "chain",
    },
    Binance: {
      chain: {
        address: "",
        symbol: "BNB",
        name: "Binance",
        key: "smartchain",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.binance),
        website: null,
        chainId: 56,
        wallet: bscAddr,
        balance: 0,
        price: 0,
        cmc: "binancecoin",
      },
      tokens: [
        {
          address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          decimals: 18,
          displaySymbol: "WBNB",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png",
          name: "Wrapped BNB",
          symbol: "WBNB.BNB",
          website: "https://binance.org",
          balance: 0,
          price: 0,
          cmc: "wbnb",
        },
        {
          address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
          decimals: 18,
          displaySymbol: "BUSD",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/logo.png",
          name: "BNB pegged BUSD",
          symbol: "BUSD.BNB",
          website: "https://paxos.com/busd",
          balance: 0,
          price: 0,
          cmc: "binance-usd",
        },
      ],
      currentToken: "chain",
    },
    Polygon: {
      chain: {
        address: "",
        symbol: "MATIC",
        name: "Polygon",
        key: "polygon",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.polygon),
        website: "https://polygon.technology/solutions/polygon-pos/",
        chainId: 137,
        wallet: polygonAddr,
        balance: 0,
        price: 0,
        cmc: "matic-network",
      },
      tokens: [
        {
          address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          displaySymbol: "WMATIC",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
          name: "Wrapped MATIC",
          symbol: "WMATIC.MATIC",
          website: "https://polygon.technology",
          balance: 0,
          price: 0,
          cmc: "wmatic",
        },
        {
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          decimals: 6,
          displaySymbol: "USDC",
          logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/polygon/assets/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/logo.png",
          name: "USD Coin",
          symbol: "USDC.MATIC",
          website: "https://centre.io/usdc",
          balance: 0,
          price: 0,
          cmc: "matic-aave-usdc",
        },
        {
          address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          decimals: 6,
          displaySymbol: "USDT",
          logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/polygon/assets/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/logo.png",
          name: "Tether USD",
          symbol: "USDT.MATIC",
          website: "https://tether.to",
          balance: 0,
          price: 0,
          cmc: "tether",
        },
      ],
      currentToken: "chain",
    },
    Avalanche: {
      chain: {
        address: "",
        symbol: "AVAX",
        name: "Avalanche C-Chain",
        key: "avalanchec",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.avalanche),
        website: "http://avax.network",
        chainId: 43114,
        wallet: avalancheAddr,
        balance: 0,
        price: 0,
        cmc: "avalanche-2",
      },
      tokens: [
        {
          address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
          decimals: 6,
          displaySymbol: "USDC",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/assets/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E/logo.png",
          name: "USD Coin",
          symbol: "USDC.AVAX",
          website: "https://www.centre.io/",
          balance: 0,
          price: 0,
          cmc: "usd-coin",
        },
      ],
      currentToken: "chain",
    },
    Arbitrum: {
      chain: {
        address: "",
        symbol: "ARBETH",
        name: "Arbitrum One",
        key: "arbitrum",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.arbitrumone),
        website: "https://offchainlabs.com",
        chainId: 42161,
        wallet: arbitrumAddr,
        balance: 0,
        price: 0,
        cmc: "arbitrum",
      },
      tokens: [
        {
          address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
          decimals: 6,
          displaySymbol: "USDT",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png",
          name: "Tether USD",
          symbol: "USDT.ARBETH",
          website: "https://tether.to/",
          balance: 0,
          price: 0,
          cmc: "tether",
        },
        {
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          decimals: 6,
          displaySymbol: "USDC",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xaf88d065e77c8cC2239327C5EDb3A432268e5831/logo.png",
          name: "USD Coin",
          symbol: "USDC.ARBETH",
          website: "https://www.centre.io/usdc",
          balance: 0,
          price: 0,
          cmc: "usd-coin",
        },
        {
          address: "0x680447595e8b7b3aa1b43beb9f6098c79ac2ab3f",
          decimals: 18,
          displaySymbol: "USDD",
          logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/arbitrum/assets/0x680447595e8b7b3aa1b43beb9f6098c79ac2ab3f/logo.png",
          name: "Decentralized USD",
          symbol: "USDD.ARBETH",
          website: "https://usdd.io/",
          balance: 0,
          price: 0,
          cmc: "usdd",
        },
      ],
      currentToken: "chain",
    },
    Optimism: {
      chain: {
        address: "",
        symbol: "OETH",
        name: "Optimism",
        key: "optimism",
        decimals: 18,
        logo: chainIconMap.get(chainEnum.optimism),
        website: "https://www.optimism.io/",
        chainId: 10,
        wallet: optimismAddr,
        balance: 0,
        price: 0,
        cmc: "optimism",
      },
      tokens: [
        {
          address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
          decimals: 6,
          displaySymbol: "USDC",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85/logo.png",
          name: "USD Coin",
          symbol: "USDC.OETH",
          website: "https://www.centre.io/",
          balance: 0,
          price: 0,
          cmc: "usd-coin",
        },
        {
          address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
          decimals: 6,
          displaySymbol: "USDT",
          logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/assets/0x94b008aA00579c1307B0EF2c499aD98a8ce58e58/logo.png",
          name: "Tether USD",
          symbol: "USDT.OETH",
          website: "https://tether.to/",
          balance: 0,
          price: 0,
          cmc: "tether",
        },
      ],
      currentToken: "chain",
    },
    Solar: {
      chain: {
        address: "",
        symbol: "SXP",
        name: "Solar Blockchain",
        key: "sxp",
        decimals: 8,
        logo: solarIcon,
        website: "https://solar.org/",
        chainId: 0,
        wallet: solarAddr,
        balance: 0,
        price: 0,
        cmc: "swipe",
      },
      tokens: [],
      currentToken: "chain",
    },
    Bitcoin: {
      chain: {
        address: "",
        symbol: "BTC",
        name: "Bitcoin",
        key: "bitcoin",
        decimals: 8,
        logo: chainIconMap.get(chainEnum.bitcoin),
        website: "https://bitcoin.org/",
        chainId: 0,
        wallet: bitcoinAddr,
        balance: 0,
        price: 0,
        cmc: "bitcoin",
      },
      tokens: [],
      currentToken: "chain",
    },
    Solana: {
      chain: {
        address: "",
        symbol: "SOL",
        name: "Solana",
        key: "solana",
        decimals: 9,
        logo: chainIconMap.get(chainEnum.solana),
        website: "https://solana.com/",
        chainId: 0,
        wallet: solanaAddr,
        balance: 0,
        price: 0,
        cmc: "solana",
      },
      tokens: [],
      currentToken: "chain",
    },
  };
};
