import Ethereum from "../wallet/Ethereum";
import Solar from "../wallet/Solar";
import BSC from "../wallet/BSC";
import Solana from "../wallet/Solana";
import Polygon from "../wallet/Polygon";
import Avalanche from "../wallet/Avalanche";
import Arbitrum from "../wallet/Arbitrum";
import Bitcoin from "../wallet/Bitcoin";
import Optimism from "../wallet/Optimism";

export type BlockchainKey = "solar" | "bsc" | "eth" | "solana" | "polygon" | "avalanche" | "arbitrum" | "btc" | "op";

const tymtCore = {
  Launcher: {
    download: async () => {},
  },
  Blockchains: {
    solar: {
      name: "Solar Blockchain",
      ticker: "SXP",
      wallet: Solar,
      explorer: "https://solarscan.com/wallet/",
      txexplorer: "https://solarscan.com/transaction/",
    },
    bsc: {
      name: "Binance",
      ticker: "BNB",
      wallet: BSC,
      explorer: "https://bscscan.com/address/",
      txexplorer: "https://bscscan.com/tx/",
    },
    eth: {
      name: "Ethereum",
      ticker: "ETH",
      wallet: Ethereum,
      explorer: "https://etherscan.io/address/",
      txexplorer: "https://etherscan.io/tx/",
    },
    btc: {
      name: "Bitcoin",
      ticker: "BTC",
      wallet: Bitcoin,
      explorer: "https://www.blockchain.com/explorer/addresses/btc/",
      txexplorer: "https://www.blockchain.com/explorer/transactions/btc/",
    },
    solana: {
      name: "Solana",
      ticker: "SOL",
      wallet: Solana,
      explorer: "https://solscan.io/account/",
      txexplorer: "https://solscan.io/tx/",
    },
    polygon: {
      name: "Polygon",
      ticker: "MATIC",
      wallet: Polygon,
      explorer: "https://polygonscan.com/address/",
      txexplorer: "https://polygonscan.com/tx/",
    },
    avalanche: {
      name: "Avalanche C-Chain",
      ticker: "AVAX",
      wallet: Avalanche,
      explorer: "https://avascan.info/blockchain/c/address/",
      txexplorer: "https://avascan.info/blockchain/c/tx/",
    },
    arbitrum: {
      name: "Arbitrum One",
      ticker: "ETH",
      wallet: Arbitrum,
      explorer: "https://arbiscan.io/address/",
      txexplorer: "https://arbiscan.io/tx/",
    },
    op: {
      name: "Optimism",
      ticker: "ETH",
      wallet: Optimism,
      explorer: "https://optimistic.etherscan.io/address/",
      txexplorer: "https://optimistic.etherscan.io/tx/",
    },
  },
};

export default tymtCore;
