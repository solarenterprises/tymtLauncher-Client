import solarIcon from "../assets/chains/solar.svg";
import arbitrumIcon from "../assets/chains/arbitrum.svg";
import avalancheIcon from "../assets/chains/avalanche.svg";
import binanceIcon from "../assets/chains/binance.svg";
import bitcoinIcon from "../assets/chains/bitcoin.svg";
import ethereumIcon from "../assets/chains/ethereum.svg";
import optimismIcon from "../assets/chains/optimism.svg";
import polygonIcon from "../assets/chains/polygon.svg";
import solanaIcon from "../assets/chains/solana.svg";

export class ChainIDs {
  static ETHEREUM = 1;
  static BINANCE = 56;
  static POLYGON = 137;
  static AVALANCHE = 43114;
  static ARBITRUM = 42161;
  static OPTIMISM = 10;
  static BITCOIN = 0;
  static SOLANA = 0;
  static SOLAR = 0;
}

export class ChainIcons {
  static ETHEREUM = ethereumIcon;
  static BINANCE = binanceIcon;
  static POLYGON = polygonIcon;
  static AVALANCHE = avalancheIcon;
  static ARBITRUM = arbitrumIcon;
  static OPTIMISM = optimismIcon;
  static BITCOIN = bitcoinIcon;
  static SOLANA = solanaIcon;
  static SOLAR = solarIcon;
}

export class ChainNames {
  static ETHEREUM = "Ethereum";
  static BINANCE = "Binance Smart Chain";
  static POLYGON = "Polygon";
  static AVALANCHE = "Avalanche C-Chain";
  static ARBITRUM = "Arbitrum One";
  static OPTIMISM = "Optimism";
  static BITCOIN = "Bitcoin";
  static SOLANA = "Solana";
  static SOLAR = "Solar Blockchain";
}

export const Chains = [
  {
    icon: ChainIcons.SOLAR,
    name: ChainNames.SOLAR,
  },
  {
    icon: ChainIcons.BITCOIN,
    name: ChainNames.BITCOIN,
  },
  {
    icon: ChainIcons.SOLANA,
    name: ChainNames.SOLANA,
  },
  {
    icon: ChainIcons.ETHEREUM,
    name: ChainNames.ETHEREUM,
  },
  {
    icon: ChainIcons.BINANCE,
    name: ChainNames.BINANCE,
  },
  {
    icon: ChainIcons.POLYGON,
    name: ChainNames.POLYGON,
  },
  {
    icon: ChainIcons.ARBITRUM,
    name: ChainNames.ARBITRUM,
  },
  {
    icon: ChainIcons.AVALANCHE,
    name: ChainNames.AVALANCHE,
  },
  {
    icon: ChainIcons.OPTIMISM,
    name: ChainNames.OPTIMISM,
  },
];
