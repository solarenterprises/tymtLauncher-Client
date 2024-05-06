import { Stack, Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import timerIcon from "../../assets/wallet/timer-icon.svg";
import {
  getTransactionsAsync,
  selectTrasaction,
  setTransasctions,
  // setTransasctions,
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
// import InfiniteScroll from "react-infinite-scroller";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const TransCard = () => {
  const { t } = useTranslation();
  const chain: IChain = useSelector(getChain);
  const transactions: any[] = useSelector(selectTrasaction);
  const dispatch = useDispatch<AppDispatch>();
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const currencySymbol: string = currencySymbols[currencyStore.current];
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  // const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setTransasctions());
    dispatch(
      getTransactionsAsync({
        chain: chain,
        page: 1,
      })
    );
    setPage(1);
  }, [dispatch, chain]);

  useEffect(() => {
    if (page !== 1) {
      setLoading(true);
      dispatch(
        getTransactionsAsync({
          chain: chain,
          page: page,
        })
      )
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load more: ", err);
          setLoading(false);
        });
    }
  }, [dispatch, page]);

  const handleButtonClick = (path: string) => {
    const externalLink = path;
    openLink(externalLink);
  };

  const loadMore = async () => {
    setPage(page + 1); // will trigger useEffect
  };

  return (
    <Box>
      {/* <InfiniteScroll
        pageStart={page}
        loadMore={loadMore}
        hasMore={true}
        isReverse={false}
        useWindow={false}
      > */}
      {transactions &&
        transactions?.map((data, index) => {
          const { direction, address, time, url, amount, logo, symbol } =
            formatTransaction(chain, data);
          if (!address || !url || !amount) return null;
          else
            return (
              <Button
                key={`${index}-${new Date().toISOString()}`}
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
                  <Stack
                    direction={"row"}
                    spacing={"16px"}
                    alignItems={"center"}
                  >
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
                        Number(chain.chain.price ?? 0) *
                          Number(amount) *
                          reserve
                      )}`}
                    </Box>
                  </Stack>
                </Stack>
              </Button>
            );
        })}
      <Button
        key={`load-more`}
        sx={{
          textTransform: "none",
          width: "100%",
          height: "52px",
        }}
        onClick={loadMore}
      >
        {!loading && (
          <Box className="fs-16-regular light">{t("wal-60_load-more")}</Box>
        )}
        {loading && (
          <CircularProgress
            sx={{
              color: "#F5EBFF",
            }}
          />
        )}
      </Button>
      {/* </InfiniteScroll> */}
    </Box>
  );
};

export default TransCard;
