import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { currencySymbols } from "../../consts/SupportCurrency";

import { Stack, Box, Button } from "@mui/material";

import QrModal from "./QrModal";

import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getBalanceList } from "../../features/wallet/BalanceListSlice";
import { getPriceList } from "../../features/wallet/PriceListSlice";

import { formatBalance } from "../../lib/helper";

import CommonStyles from "../../styles/commonStyles";

import walletImg1 from "../../assets/wallet/wallet-card-1.png";
import walletImg2 from "../../assets/wallet/wallet-card-2.png";
import walletImg3 from "../../assets/wallet/wallet-card-3.png";
import walletImg4 from "../../assets/wallet/wallet-card-4.png";
import walletImg5 from "../../assets/wallet/wallet-card-5.png";
import walletImg6 from "../../assets/wallet/wallet-card-6.png";
import walletImg7 from "../../assets/wallet/wallet-card-7.png";
import walletImg8 from "../../assets/wallet/wallet-card-8.png";
import walletImg9 from "../../assets/wallet/wallet-card-9.png";
import qrIcon from "../../assets/wallet/qr-icon.svg";

import { IBalanceList, ICurrencyList, ICurrentCurrency, IPriceList, ISupportChain } from "../../types/walletTypes";
import { getTokenBalanceBySymbol, getTokenPriceByCmc } from "../../lib/helper/WalletHelper";
import { setCurrentChain } from "../../features/wallet/CurrentChainSlice";

const backgrounds = [walletImg1, walletImg2, walletImg3, walletImg4, walletImg5, walletImg6, walletImg7, walletImg8, walletImg9];

export interface IPropsWalletCard {
  supportChain: ISupportChain;
  index: number;
  setLoading: (_: boolean) => void;
}

const WalletCard = ({ supportChain, index }: IPropsWalletCard) => {
  const dispatch = useDispatch();

  const background = backgrounds[index];
  const common = CommonStyles();

  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const balance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, supportChain?.chain?.symbol), [balanceListStore]);
  const price = useMemo(() => getTokenPriceByCmc(priceListStore, supportChain?.chain?.cmc), [priceListStore]);

  const [open, setOpen] = useState(false);

  const handleWalletCardClick = () => {
    dispatch(setCurrentChain(supportChain?.chain?.name));
  };

  return (
    <>
      <Button
        fullWidth
        sx={{
          textTransform: "none",
          borderRadius: "16px",
          padding: "20px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${background})`,
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
        onClick={handleWalletCardClick}
      >
        <Stack direction={"row"} gap={3} justifyContent={"space-between"} width={"100%"}>
          <Stack direction={"row"} justifyContent={"flex-start"} gap={"16px"}>
            <Box component={"img"} src={supportChain?.chain?.logo} width={"40px"} height={"40px"} />
            <Stack gap={1}>
              <Box className={"fs-h3 white t-left"}>{supportChain?.chain?.name}</Box>
              <Box className={"fs-18-regular white"}>
                {supportChain?.chain?.symbol}
                {` ${formatBalance(balance, 4)}`}
              </Box>
              <Box className={"fs-16-regular light t-left"}>{`${symbol} ${formatBalance(Number(price ?? 0) * Number(balance ?? 0) * reserve)}`}</Box>
            </Stack>
          </Stack>
          <Box
            className={`${common.center_align} qr-btn`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <img src={qrIcon} />
          </Box>
        </Stack>
      </Button>
      <QrModal supportChain={supportChain} open={open} setOpen={setOpen} />
    </>
  );
};

export default WalletCard;
