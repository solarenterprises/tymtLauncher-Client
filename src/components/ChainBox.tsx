import { useMemo } from "react";
import { useSelector } from "react-redux";

import { currencySymbols } from "../consts/SupportCurrency";

import { Box, Button, Stack } from "@mui/material";

import { getWallet } from "../features/wallet/WalletSlice";
import { getCurrentChain } from "../features/wallet/CurrentChainSlice";
import { getCurrencyList } from "../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../features/wallet/CurrentCurrencySlice";
import { getBalanceList } from "../features/wallet/BalanceListSlice";
import { getPriceList } from "../features/wallet/PriceListSlice";

import { formatBalance } from "../lib/helper";
import { getCurrentChainWalletAddress, getTokenBalanceBySymbol, getTokenPriceByCmc } from "../lib/helper/WalletHelper";

import { IBalanceList, ICurrencyList, ICurrentChain, ICurrentCurrency, IPriceList, ISupportChain, IWallet } from "../types/walletTypes";

export interface IPropsChainBox {
  supportChain: ISupportChain;
  onClick: () => void;
}

const ChainBox = ({ supportChain, onClick }: IPropsChainBox) => {
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const walletStore: IWallet = useSelector(getWallet);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const isActive: boolean = useMemo(() => currentChainStore?.chain === supportChain?.chain?.name, [currentChainStore]);
  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve ?? 0,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const balance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, supportChain?.chain?.symbol) ?? 0, [balanceListStore]);
  const price = useMemo(() => getTokenPriceByCmc(priceListStore, supportChain?.chain?.cmc) ?? 0, [priceListStore]);

  return (
    <Button
      onClick={onClick}
      className={`common-btn ${isActive ? `active` : null}`}
      sx={{
        display: "block",
        textTransform: "none",
      }}
    >
      <Stack direction={"row"} justifyContent={"space-between"} sx={{ padding: "20px" }}>
        <Stack gap={2} direction={"row"} justifyContent={"flex-start"}>
          <Box component={"img"} src={supportChain?.chain?.logo} width={"32px"} height={"32px"} />
          <Stack direction={"column"} alignItems={"flex-start"} textAlign={"center"} justifyContent={"space-between"} gap={"5px"}>
            <Box className="fs-h5 white">{supportChain?.chain?.name}</Box>
            <Box className="fs-12-light blue">{getCurrentChainWalletAddress(walletStore, supportChain?.chain?.name)}</Box>
          </Stack>
        </Stack>
        <Stack direction={"column"} alignItems={"flex-end"} gap={"5px"} justifyContent={"space-between"}>
          <Box className="fs-18-light white">{formatBalance(balance, 4)}</Box>
          {/* <Box className="fs-12-light gray">{`${symbol} ${formatBalance(Number(data?.chain.price ?? 0) * Number(data?.chain.balance ?? 0) * reserve)}`}</Box> */}
          <Box className="fs-12-light gray">{`${symbol} ${formatBalance(Number(price) * Number(balance) * reserve)}`}</Box>
        </Stack>
      </Stack>
    </Button>
  );
};

export default ChainBox;
