import tymtCore from "../../lib/core/tymtCore";

import solarIcon from "../../assets/chains/solar.svg";
import PriceAPI from "../../lib/api/PriceAPI";

import { Identities, Managers } from "@solar-network/crypto";
import {
  Hash,
  HashAlgorithms,
} from "@solar-network/crypto/dist/crypto/index.js";

import tymtStorage from "../../lib/Storage";

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

export const getAddressesFromMnemonic = async (payload: MnemonicPayload) => {
  const { mnemonic } = payload;

  const signature = await getCredentials(mnemonic.normalize("NFD"));
  tymtStorage.set(`d53Password`, JSON.stringify({ password: signature }));

  const solarAddr = await tymtCore.Blockchains.solar.wallet.getAddress(
    mnemonic
  );
  const bscAddr = await tymtCore.Blockchains.bsc.wallet.getAddress(mnemonic);
  const ethereumAddr = await tymtCore.Blockchains.eth.wallet.getAddress(
    mnemonic
  );
  const bitcoinAddr = await tymtCore.Blockchains.btc.wallet.getAddress(
    mnemonic
  );
  const solanaAddr = await tymtCore.Blockchains.solana.wallet.getAddress(
    mnemonic
  );
  const polygonAddr = await tymtCore.Blockchains.polygon.wallet.getAddress(
    mnemonic
  );
  const avalancheAddr = await tymtCore.Blockchains.avalanche.wallet.getAddress(
    mnemonic
  );
  const arbitrumAddr = await tymtCore.Blockchains.arbitrum.wallet.getAddress(
    mnemonic
  );
  const optimismAddr = await tymtCore.Blockchains.op.wallet.getAddress(
    mnemonic
  );

  return {
    Ethereum: {
      chain: {
        address: "",
        symbol: "ETH",
        name: "Ethereum",
        key: "ethereum",
        decimals: 18,
        logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png",
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
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
        name: "Arbitrum",
        key: "arbitrum",
        decimals: 18,
        logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029",
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
        logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029",
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
        logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029",
        website: "https://solar.org/",
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
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=029",
        website: "https://solar.org/",
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

export const refreshBalances = async ({ _multiWalletStore, _accountStore }) => {
  const solarAddr = _multiWalletStore.Solar.chain.wallet;
  const binanceAddr = _multiWalletStore.Binance.chain.wallet;
  const ethereumAddr = _multiWalletStore.Ethereum.chain.wallet;
  const polygonAddr = _multiWalletStore.Polygon.chain.wallet;
  const avalancheAddr = _multiWalletStore.Avalanche.chain.wallet;
  const arbitrumAddr = _multiWalletStore.Arbitrum.chain.wallet;
  const optimismAddr = _multiWalletStore.Optimism.chain.wallet;
  const bitcoinAddr = _multiWalletStore.Bitcoin.chain.wallet;
  const solanaAddr = _multiWalletStore.Solana.chain.wallet;

  const ethereum_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "ethereum"
  );
  const weth_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "wrapped-ether-mantle-bridge"
  );
  const tether_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "tether"
  );
  const usdcoin_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "usd-coin"
  );
  const binancecoin_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "binancecoin"
  );
  const wbnb_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "wbnb"
  );
  const binanceusd_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "binance-usd"
  );
  const maticnetwork_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "matic-network"
  );
  const wmatic_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "wmatic"
  );
  const maticaaveusdc_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "matic-aave-usdc"
  );
  const avalanche2_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "avalanche-2"
  );
  const arbitrum_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "arbitrum"
  );
  const usdd_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "usdd"
  );
  const optimism_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "optimism"
  );
  const solar_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "swipe"
  );
  const bitcoin_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "bitcoin"
  );
  const solana_value_p = PriceAPI.getTokenPrice(
    _accountStore.accessToken,
    "solana"
  );

  const ethereum_bal_p = tymtCore.Blockchains.eth.wallet.getTokenBalance(
    ethereumAddr,
    _multiWalletStore.Ethereum.tokens
  );

  const binance_bal_p = tymtCore.Blockchains.bsc.wallet.getTokenBalance(
    binanceAddr,
    _multiWalletStore.Binance.tokens
  );

  const polygon_bal_p = tymtCore.Blockchains.polygon.wallet.getTokenBalance(
    polygonAddr,
    _multiWalletStore.Polygon.tokens
  );

  const arbitrum_bal_p = tymtCore.Blockchains.arbitrum.wallet.getTokenBalance(
    arbitrumAddr,
    _multiWalletStore.Arbitrum.tokens
  );

  const avalanche_bal_p = tymtCore.Blockchains.avalanche.wallet.getTokenBalance(
    avalancheAddr,
    _multiWalletStore.Avalanche.tokens
  );

  const optimism_bal_p = tymtCore.Blockchains.op.wallet.getTokenBalance(
    optimismAddr,
    _multiWalletStore.Optimism.tokens
  );

  const ethereum_native_p =
    tymtCore.Blockchains.eth.wallet.getBalance(ethereumAddr);
  const binance_native_p =
    tymtCore.Blockchains.bsc.wallet.getBalance(binanceAddr);
  const polygon_native_p =
    tymtCore.Blockchains.polygon.wallet.getBalance(polygonAddr);
  const avalanche_native_p =
    tymtCore.Blockchains.avalanche.wallet.getBalance(avalancheAddr);
  const arbitrum_native_p =
    tymtCore.Blockchains.arbitrum.wallet.getBalance(arbitrumAddr);
  const optimism_native_p =
    tymtCore.Blockchains.op.wallet.getBalance(optimismAddr);
  const solar_native_p =
    tymtCore.Blockchains.solar.wallet.getBalance(solarAddr);
  const bitcoin_native_p =
    tymtCore.Blockchains.btc.wallet.getBalance(bitcoinAddr);
  const solana_native_p =
    tymtCore.Blockchains.solana.wallet.getBalance(solanaAddr);

  const res = await Promise.all([
    ethereum_value_p,
    weth_value_p,
    tether_value_p,
    usdcoin_value_p,
    binancecoin_value_p,
    wbnb_value_p,
    binanceusd_value_p,
    maticnetwork_value_p,
    wmatic_value_p,
    maticaaveusdc_value_p,
    avalanche2_value_p,
    arbitrum_value_p,
    usdd_value_p,
    optimism_value_p,
    solar_value_p,
    bitcoin_value_p,
    solana_value_p,
    ethereum_bal_p,
    binance_bal_p,
    polygon_bal_p,
    arbitrum_bal_p,
    avalanche_bal_p,
    optimism_bal_p,
    ethereum_native_p,
    binance_native_p,
    polygon_native_p,
    avalanche_native_p,
    arbitrum_native_p,
    optimism_native_p,
    solar_native_p,
    bitcoin_native_p,
    solana_native_p,
  ]);
  const ethereum_value = res[0];
  const weth_value = res[1];
  const tether_value = res[2];
  const usdcoin_value = res[3];
  const binancecoin_value = res[4];
  const wbnb_value = res[5];
  const binanceusd_value = res[6];
  const maticnetwork_value = res[7];
  const wmatic_value = res[8];
  const maticaaveusdc_value = res[9];
  const avalanche2_value = res[10];
  const arbitrum_value = res[11];
  const usdd_value = res[12];
  const optimism_value = res[13];
  const solar_value = res[14];
  const bitcoin_value = res[15];
  const solana_value = res[16];
  const ethereum_bal = res[17];
  const binance_bal = res[18];
  const polygon_bal = res[19];
  const arbitrum_bal = res[20];
  const avalanche_bal = res[21];
  const optimism_bal = res[22];
  const ethereum_native = Number(res[23]);
  const binance_native = Number(res[24]);
  const polygon_native = Number(res[25]);
  const avalanche_native = Number(res[26]);
  const arbitrum_native = Number(res[27]);
  const optimism_native = Number(res[28]);
  const solar_native = Number(res[29]);
  const bitcoin_native = Number(res[30]);
  const solana_native = Number(res[31]);
  const result = {
    Ethereum: {
      chain: {
        address: "",
        symbol: "ETH",
        name: "Ethereum",
        key: "ethereum",
        decimals: 18,
        logo: "https://raw.githubusercontent.com/blockchain/coin-definitions/master/extensions/blockchains/ethereum/info/logo.png",
        website: "https://ethereum.org/",
        chainId: 1,
        wallet: ethereumAddr,
        balance: ethereum_native,
        price: Number(ethereum_value),
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
          balance: Number(
            ethereum_bal.find(
              (element) => element.cmc === "wrapped-ether-mantle-bridge"
            ).balance
          ),
          price: Number(weth_value),
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
          balance: Number(
            ethereum_bal.find((element) => element.cmc === "tether").balance
          ),
          price: Number(tether_value),
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
          balance: Number(
            ethereum_bal.find((element) => element.cmc === "usd-coin").balance
          ),
          price: Number(usdcoin_value),
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
        website: null,
        chainId: 56,
        wallet: binanceAddr,
        balance: binance_native,
        price: Number(binancecoin_value),
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
          balance: Number(
            binance_bal.find((element) => element.cmc === "wbnb").balance
          ),
          price: Number(wbnb_value),
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
          balance: Number(
            binance_bal.find((element) => element.cmc === "binance-usd").balance
          ),
          price: Number(binanceusd_value),
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
        website: "https://polygon.technology/solutions/polygon-pos/",
        chainId: 137,
        wallet: polygonAddr,
        balance: polygon_native,
        price: Number(maticnetwork_value),
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
          balance: Number(
            polygon_bal.find((element) => element.cmc === "wmatic").balance
          ),
          price: Number(wmatic_value),
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
          balance: Number(
            polygon_bal.find((element) => element.cmc === "matic-aave-usdc")
              .balance
          ),
          price: Number(maticaaveusdc_value),
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
          balance: Number(
            polygon_bal.find((element) => element.cmc === "tether").balance
          ),
          price: Number(tether_value),
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
        logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
        website: "http://avax.network",
        chainId: 43114,
        wallet: avalancheAddr,
        balance: avalanche_native,
        price: Number(avalanche2_value),
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
          balance: Number(
            avalanche_bal.find((element) => element.cmc === "usd-coin").balance
          ),
          price: Number(usdcoin_value),
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
        logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029",
        website: "https://offchainlabs.com",
        chainId: 42161,
        wallet: arbitrumAddr,
        balance: arbitrum_native,
        price: Number(arbitrum_value),
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
          balance: Number(
            arbitrum_bal.find((element) => element.cmc === "tether").balance
          ),
          price: Number(tether_value),
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
          balance: Number(
            arbitrum_bal.find((element) => element.cmc === "usd-coin").balance
          ),
          price: Number(usdcoin_value),
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
          balance: Number(
            arbitrum_bal.find((element) => element.cmc === "usdd").balance
          ),
          price: Number(usdd_value),
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
        logo: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029",
        website: "https://www.optimism.io/",
        chainId: 10,
        wallet: optimismAddr,
        balance: optimism_native,
        price: Number(optimism_value),
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
          balance: Number(
            optimism_bal.find((element) => element.cmc === "usd-coin").balance
          ),
          price: Number(usdcoin_value),
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
          balance: Number(
            optimism_bal.find((element) => element.cmc === "tether").balance
          ),
          price: Number(tether_value),
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
        balance: solar_native,
        price: Number(solar_value),
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
        logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029",
        website: "https://bitcoin.org/",
        chainId: 0,
        wallet: bitcoinAddr,
        balance: bitcoin_native,
        price: Number(bitcoin_value),
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
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png?v=029",
        website: "https://solana.com/",
        chainId: 0,
        wallet: solanaAddr,
        balance: solana_native,
        price: Number(solana_value),
        cmc: "solana",
      },
      tokens: [],
      currentToken: "chain",
    },
  };

  return result;
};
