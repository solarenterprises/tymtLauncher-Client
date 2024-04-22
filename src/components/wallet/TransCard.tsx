import { Stack, Box, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import timerIcon from "../../assets/wallet/timer-icon.svg";
import {
  getTransactionsAsync,
  selectTrasaction,
} from "../../features/wallet/CryptoSlice";
import { IChain, transactionIconMap } from "../../types/walletTypes";
import { formatBalance, formatTransaction } from "../../lib/helper";
import { getChain } from "../../features/wallet/ChainSlice";
import { useEffect } from "react";
import { AppDispatch } from "../../store";
import { openLink } from "../../lib/api/Downloads";

import { ICurrency } from "../../types/walletTypes";
import { getCurrency } from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";

const TransCard = () => {
  const chain: IChain = useSelector(getChain);
  const transactions = useSelector(selectTrasaction);
  const dispatch = useDispatch<AppDispatch>();
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const currencySymbol: string = currencySymbols[currencyStore.current];

  useEffect(() => {
    dispatch(getTransactionsAsync(chain));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTransactionsAsync(chain));
  }, [dispatch, chain]);

  const handleButtonClick = (path: string) => {
    const externalLink = path;
    openLink(externalLink);
  };
  return (
    <Box>
      {transactions &&
        transactions?.map((data, index) => {
          const { direction, address, time, url, amount, logo, symbol } =
            formatTransaction(chain, data);
          return (
            <Button
              key={index}
              sx={{
                textTransform: "none",
                width: "100%",
              }}
              onDoubleClick={() => handleButtonClick(url)}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                padding={"7px 25px"}
                width={"100%"}
              >
                <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
                  <Box
                    component={"img"}
                    src={transactionIconMap.get(direction)}
                    width={"32px"}
                    height={"32px"}
                  />
                  <Stack>
                    <Box className={"fs-16-regular white"}>
                      {address?.substring(0, 6)}...
                      {address?.substring(address.length - 10)}
                    </Box>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={"8px"}
                    >
                      <Box
                        component={"img"}
                        src={timerIcon}
                        width={"12px"}
                        height={"12px"}
                      />
                      <Box className={"fs-12-regular light"}>{time}</Box>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack>
                  <Stack
                    direction={"row"}
                    spacing={"8px"}
                    alignItems={"center"}
                  >
                    <Box
                      component={"img"}
                      src={logo}
                      width={"16px"}
                      height={"16px"}
                    ></Box>
                    <Box className={"fs-16-regular white center-align"}>
                      {`${amount} ${symbol}`}
                    </Box>
                  </Stack>
                  <Box className={"fs-12-light light t-right"}>
                    {`${currencySymbol} ${formatBalance(
                      Number(chain.chain.price ?? 0) * Number(amount) * reserve
                    )}`}
                  </Box>
                </Stack>
              </Stack>
            </Button>
          );
        })}
    </Box>
  );
};

export default TransCard;
