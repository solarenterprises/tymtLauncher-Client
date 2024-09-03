import { Grid } from "@mui/material";
import WalletBar from "./WalletBar";
import solar from "../../assets/chains/solar.png";
import binance from "../../assets/chains/binance.png";
import ethereum from "../../assets/chains/ethereum.png";
import bitcoin from "../../assets/chains/bitcoin.png";
import solana from "../../assets/chains/solana.png";
import polygon from "../../assets/chains/polygon.png";
import avalanche from "../../assets/chains/avalanche.png";
import arbitrumOne from "../../assets/chains/arbitrumOne.png";
import optimism from "../../assets/chains/optimism.png";
import { IWallet } from "../../types/walletTypes";

export interface IPropsWalletList {
  wallet: IWallet;
}

const WalletList = ({ wallet }: IPropsWalletList) => {
  return (
    <Grid container spacing={"12px"}>
      <Grid item xs={12}>
        <WalletBar icon={solar} chain={"Solar"} address={wallet?.solar} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={binance} chain={"Binance"} address={wallet?.binance} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={ethereum} chain={"Ethereum"} address={wallet?.ethereum} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={bitcoin} chain={"Bitcoin"} address={wallet?.bitcoin} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={solana} chain={"Solana"} address={wallet?.solana} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={polygon} chain={"Polygon"} address={wallet?.polygon} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={avalanche} chain={"Avalanche"} address={wallet?.avalanche} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={arbitrumOne} chain={"Arbitrum One"} address={wallet?.arbitrum} />
      </Grid>
      <Grid item xs={12}>
        <WalletBar icon={optimism} chain={"Optimism"} address={wallet?.optimism} />
      </Grid>
    </Grid>
  );
};

export default WalletList;
