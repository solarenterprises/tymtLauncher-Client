import { Box, Button, Stack } from "@mui/material";
import { propsChainBox } from "../types/commonTypes";
import { formatBalance } from "../lib/helper";
import { useSelector } from "react-redux";
import { getChain } from "../features/wallet/ChainSlice";
import { ICurrency } from "../types/walletTypes";
import { getCurrency } from "../features/wallet/CurrencySlice";
import { currencySymbols } from "../consts/currency";

const ChainBox = ({ data, onClick }: propsChainBox) => {
  const chain = useSelector(getChain);
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const symbol: string = currencySymbols[currencyStore.current];

  return (
    <Button
      onClick={() => onClick(data)}
      className={`common-btn ${chain.chain.name === data?.chain.name ? "active" : ""}`}
      sx={{
        display: "block",
        textTransform: "none",
      }}
    >
      <Stack direction={"row"} justifyContent={"space-between"} sx={{ padding: "20px" }}>
        <Stack gap={2} direction={"row"} justifyContent={"flex-start"}>
          <Box component={"img"} src={data?.chain.logo} width={"32px"} height={"32px"} />
          <Stack direction={"column"} alignItems={"flex-start"} textAlign={"center"} justifyContent={"space-between"} gap={"5px"}>
            <Box className="fs-h5 white">{data?.chain.name}</Box>
            <Box className="fs-12-light blue">{data?.chain.wallet}</Box>
          </Stack>
        </Stack>
        <Stack direction={"column"} alignItems={"flex-end"} gap={"5px"} justifyContent={"space-between"}>
          <Box className="fs-18-light white">{formatBalance(data?.chain.balance ?? 0, 4)}</Box>
          <Box className="fs-12-light gray">{`${symbol} ${formatBalance(Number(data?.chain.price ?? 0) * Number(data?.chain.balance ?? 0) * reserve)}`}</Box>
        </Stack>
      </Stack>
    </Button>
  );
};

export default ChainBox;
