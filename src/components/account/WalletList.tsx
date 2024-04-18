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
import { multiWalletType } from "../../types/walletTypes";
import { useSelector } from "react-redux";
import { getTempMultiWallet } from "../../features/wallet/TempMultiWalletSlice";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { accountType, walletEnum } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";

const addresses = {
  Solar: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Binance: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Ethereum: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Bitcoin: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Solana: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Polygon: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Avalanche: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Arbitrum: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
  Optimism: {
    chain: {
      wallet: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    },
  },
};

interface props {
  mode: "login" | "signup";
}

const WalletList = ({ mode }: props) => {
  const tempMultiWalletStore: multiWalletType = useSelector(getTempMultiWallet);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const accountStore: accountType = useSelector(getAccount);
  const displayData =
    accountStore.wallet === walletEnum.custodial
      ? addresses
      : mode === "login"
      ? multiWalletStore
      : tempMultiWalletStore;

  return (
    <Grid container spacing={"12px"}>
      <Grid item xs={12}>
        <WalletBar
          icon={solar}
          chain={"Solar"}
          address={displayData.Solar.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={binance}
          chain={"Binance"}
          address={displayData.Binance.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={ethereum}
          chain={"Ethereum"}
          address={displayData.Ethereum.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={bitcoin}
          chain={"Bitcoin"}
          address={displayData.Bitcoin.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={solana}
          chain={"Solana"}
          address={displayData.Solana.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={polygon}
          chain={"Polygon"}
          address={displayData.Polygon.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={avalanche}
          chain={"Avalanche"}
          address={displayData.Avalanche.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={arbitrumOne}
          chain={"Arbitrum One"}
          address={displayData.Arbitrum.chain.wallet}
        />
      </Grid>
      <Grid item xs={12}>
        <WalletBar
          icon={optimism}
          chain={"Optimism"}
          address={displayData.Optimism.chain.wallet}
        />
      </Grid>
    </Grid>
  );
};

export default WalletList;
