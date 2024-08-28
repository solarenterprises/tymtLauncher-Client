import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import _ from "lodash";

import tymtStorage from "../../lib/Storage";

import { currencySymbols } from "../../consts/SupportCurrency";

import { Stack, Box, Button, CircularProgress } from "@mui/material";

import { AppDispatch } from "../../store";
import { getTransactionsAsync, selectTrasaction, setTransasctions } from "../../features/wallet/CryptoSlice";
import { getChain } from "../../features/wallet/ChainSlice";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

import timerIcon from "../../assets/wallet/timer-icon.svg";

import { IChain, ICurrencyList, ICurrentCurrency, transactionIconMap } from "../../types/walletTypes";

import { formatBalance, formatTransaction } from "../../lib/helper";
import { openLink } from "../../lib/api/Downloads";

const TransCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const chain: IChain = useSelector(getChain);
  const transactions: any[] = useSelector(selectTrasaction);
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const currencySymbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

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
      {transactions &&
        transactions?.map((data, index) => {
          const { direction, address, time, url, amount, logo, symbol } = formatTransaction(chain, data);
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
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} padding={"7px 25px"} width={"100%"}>
                  <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
                    <Box component={"img"} src={transactionIconMap.get(direction)} width={"32px"} height={"32px"} />
                    <Stack>
                      <Box className={"fs-16-regular white"}>
                        {address?.substring(0, 6)}...
                        {address?.substring(address.length - 10)}
                      </Box>
                      <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                        <Box component={"img"} src={timerIcon} width={"12px"} height={"12px"} />
                        <Box className={"fs-12-regular light"}>{time}</Box>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack>
                    <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
                      <Box component={"img"} src={logo} width={"16px"} height={"16px"}></Box>
                      <Box className={"fs-16-regular white center-align"}>{`${amount} ${symbol}`}</Box>
                    </Stack>
                    <Box className={"fs-12-light light t-right"}>{`${currencySymbol} ${formatBalance(
                      Number(chain.chain.price ?? 0) * Number(amount) * reserve
                    )}`}</Box>
                  </Stack>
                </Stack>
              </Button>
            );
        })}
      {tymtStorage.get(`loadMoreAvailable`) === true && (
        <Button
          key={`load-more`}
          sx={{
            textTransform: "none",
            width: "100%",
            height: "52px",
          }}
          onClick={loadMore}
        >
          {!loading && <Box className="fs-16-regular light">{t("wal-60_load-more")}</Box>}
          {loading && (
            <CircularProgress
              sx={{
                color: "#F5EBFF",
              }}
            />
          )}
        </Button>
      )}
    </Box>
  );
};

export default TransCard;
