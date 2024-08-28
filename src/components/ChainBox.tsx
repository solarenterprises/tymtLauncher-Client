import { useMemo } from "react";
import { useSelector } from "react-redux";

import { currencySymbols } from "../consts/SupportCurrency";

import { Box, Button, Stack } from "@mui/material";

import { getWallet } from "../features/wallet/WalletSlice";
import { getCurrentChain } from "../features/wallet/CurrentChainSlice";
import { getCurrencyList } from "../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../features/wallet/CurrentCurrencySlice";

import { formatBalance } from "../lib/helper";
import { getCurrentChainWalletAddress } from "../lib/helper/WalletHelper";

import { ICurrencyList, ICurrentChain, ICurrentCurrency, IWallet } from "../types/walletTypes";

export interface IPropsChainBox {
  data: { icon: string; name: string };
  onClick: () => void;
}

const ChainBox = ({ data, onClick }: IPropsChainBox) => {
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const walletStore: IWallet = useSelector(getWallet);

  const isActive: boolean = useMemo(() => currentChainStore?.chain === data?.name, [currentChainStore]);
  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

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
          <Box component={"img"} src={data?.icon} width={"32px"} height={"32px"} />
          <Stack direction={"column"} alignItems={"flex-start"} textAlign={"center"} justifyContent={"space-between"} gap={"5px"}>
            <Box className="fs-h5 white">{data?.name}</Box>
            <Box className="fs-12-light blue">{getCurrentChainWalletAddress(walletStore, data?.name)}</Box>
          </Stack>
        </Stack>
        <Stack direction={"column"} alignItems={"flex-end"} gap={"5px"} justifyContent={"space-between"}>
          <Box className="fs-18-light white">{formatBalance(0, 4)}</Box>
          {/* <Box className="fs-12-light gray">{`${symbol} ${formatBalance(Number(data?.chain.price ?? 0) * Number(data?.chain.balance ?? 0) * reserve)}`}</Box> */}
          <Box className="fs-12-light gray">{`${symbol} ${formatBalance(Number(0) * Number(0) * reserve)}`}</Box>
        </Stack>
      </Stack>
    </Button>
  );
};

export default ChainBox;
