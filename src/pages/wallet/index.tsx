import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Stack, Box, Tooltip, IconButton, Button } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import WalletStyle from "../../styles/WalletStyles";
import sendIcon from "../../assets/wallet/send-icon.svg";
import receiveIcon from "../../assets/wallet/receive-icon.svg";
import percentIcon from "../../assets/wallet/percent-icon.svg";
import refreshIcon from "../../assets/wallet/refresh-icon.svg";
import SwitchComp from "../../components/SwitchComp";
import WalletCard from "../../components/wallet/WalletCard";
import TransCard from "../../components/wallet/TransCard";
import { getMultiWallet, refreshBalancesAsync } from "../../features/wallet/MultiWalletSlice";
import { IChain, ICurrency, multiWalletType } from "../../types/walletTypes";
import SettingStyle from "../../styles/SettingStyle";
import { getChain, setChainAsync } from "../../features/wallet/ChainSlice";
import { AppDispatch } from "../../store";
import { formatBalance } from "../../lib/helper";
import Loading from "../../components/Loading";
import ComingModal from "../../components/ComingModal";
import { getCurrency, refreshCurrencyAsync } from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";
import { useNotification } from "../../providers/NotificationProvider";
import { walletType } from "../../types/settingTypes";
import { selectWallet, setWallet } from "../../features/settings/WalletSlice";
import { getTransactionsAsync, setTransasctions } from "../../features/wallet/CryptoSlice";

const order = ["Solar", "Binance", "Ethereum", "Bitcoin", "Solana", "Polygon", "Avalanche", "Arbitrum", "Optimism"];

const Wallet = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const classname = WalletStyle();
  const tooltip = SettingStyle();
  const wallets: multiWalletType = useSelector(getMultiWallet);
  const walletStore: walletType = useSelector(selectWallet);
  const chain: IChain = useSelector(getChain);
  const currencyStore: ICurrency = useSelector(getCurrency);
  const [currentChain, setCurrentChain] = useState(chain.currentToken);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [comingSoon, setComingSoon] = useState<boolean>(false);
  const reserve = currencyStore.data[currencyStore.current];
  const symbol: string = currencySymbols[currencyStore.current];

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  useEffect(() => {
    let sumValue = 0;
    Object.keys(wallets).map((rowKey) => {
      sumValue += wallets[rowKey].chain.balance * wallets[rowKey].chain.price;
    });
    setValue(sumValue * (reserve as number));
    console.log("sumValue", sumValue, reserve);
  }, [wallets, currentChain, currencyStore]);

  useEffect(() => {
    if (!walletStore.refreshed) {
      setLoading(true);
      dispatch(
        refreshBalancesAsync({
          _multiWalletStore: wallets,
        })
      ).then(() => {
        dispatch(refreshCurrencyAsync()).then(() => {
          dispatch(
            setWallet({
              ...walletStore,
              refreshed: true,
            })
          );
          setLoading(false);
          setNotificationOpen(true);
          setNotificationTitle(t("alt-20_balances-refresh"));
          setNotificationDetail(t("alt-21_balances-refresh-success"));
          setNotificationStatus("success");
          setNotificationLink(null);
        });
      });
    } else {
      handleRefreshClickInBackground();
    }
  }, []);

  const handleRefreshClick = () => {
    dispatch(setTransasctions());
    setLoading(true);
    dispatch(
      refreshBalancesAsync({
        _multiWalletStore: wallets,
      })
    ).then(() => {
      dispatch(refreshCurrencyAsync()).then(() => {
        dispatch(
          getTransactionsAsync({
            chain: chain,
            page: 1,
          })
        ).then(() => {
          dispatch(
            setWallet({
              ...walletStore,
              refreshed: true,
            })
          );
          setLoading(false);
          setNotificationOpen(true);
          setNotificationTitle(t("alt-20_balances-refresh"));
          setNotificationDetail(t("alt-21_balances-refresh-success"));
          setNotificationStatus("success");
          setNotificationLink(null);
        });
      });
    });
  };

  const handleRefreshClickInBackground = () => {
    dispatch(setTransasctions());
    dispatch(
      refreshBalancesAsync({
        _multiWalletStore: wallets,
      })
    ).then(() => {
      dispatch(refreshCurrencyAsync()).then(() => {});
    });
  };

  const selectToken = useCallback(
    (token: string) => {
      const updateData = { ...chain, currentToken: token };
      setCurrentChain(token);
      setLoading(true);
      dispatch(setChainAsync(updateData)).then(() => {
        setLoading(false);
      });
    },
    [dispatch, currentChain, setCurrentChain, chain]
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div>
          <Grid container>
            <Grid item xs={12} className="p-lr-50 p-tb-20">
              <Box className="fs-h1 white">{t("set-13_wallet")}</Box>
            </Grid>
            <Grid container>
              <Grid item xl={7} sm={12}>
                <Stack className="m-l-50 p-r-50 p-tb-20" sx={{ borderBottom: "solid 1px #FFFFFF1A" }}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack direction={"column"} justifyContent={"space-around"} gap={2}>
                      <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
                        <Box className="fs-18-regular gray">{t("set-4_balance")}</Box>

                        <Box>
                          {Object.keys(wallets).map((rowKey, index) => (
                            <Tooltip title={wallets[rowKey].name} placement="top" key={index} classes={{ tooltip: tooltip.tooltip }}>
                              <img
                                src={wallets[rowKey].icon}
                                key={index}
                                className={classname.wrap_imgs}
                                style={{
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Box>
                      </Stack>
                      <Stack direction={"row"} justifyContent={"flex-start"} gap={2}>
                        <Box className="fs-h4 white">{symbol}</Box>
                        <Box className="fs-h2 white">{formatBalance(value)}</Box>
                      </Stack>
                    </Stack>
                    <Stack direction={"row"} spacing={"32px"}>
                      <Stack spacing={"8px"}>
                        <IconButton className={"wallet-icon-button"} onClick={() => navigate("/wallet/send-sxp")}>
                          <img src={sendIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular blue t-center fw">{t("wal-1_send")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton
                          className={"wallet-icon-button "}
                          onClick={() => {
                            setComingSoon(true);
                          }}
                        >
                          <img src={receiveIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular blue t-center fw">{t("wal-2_buy")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton className={"wallet-icon-button"} onClick={() => navigate("/wallet/vote")}>
                          <img src={percentIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular t-center fw blue">{t("wal-3_vote")}</Box>
                      </Stack>
                      <Stack spacing={"8px"}>
                        <IconButton
                          className={"wallet-icon-button"}
                          onClick={() => {
                            handleRefreshClick();
                          }}
                        >
                          <img src={refreshIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                        <Box className="fs-14-regular center fw blue">{t("sto-35_refresh")}</Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack padding={"30px"} justifyContent={"center"}>
                  {loading && <Loading />}

                  <Stack direction={"row"} justifyContent={"flex-end"} gap={3} padding={"20px"}>
                    <Box className={"fs-18-regular white"}>{t("wal-5_hide-0-balance")}</Box>
                    <Box>
                      <SwitchComp
                        checked={walletStore.hidde}
                        onClick={() => {
                          dispatch(
                            setWallet({
                              ...walletStore,
                              hidde: !walletStore.hidde,
                            })
                          );
                        }}
                      />
                    </Box>
                  </Stack>
                  <Grid container spacing={"32px"}>
                    {order.map((chainName, index) => {
                      if (walletStore.hidde) {
                        if (Number(wallets[chainName]?.chain.balance) !== 0) {
                          return (
                            <Grid item xs={6} key={index}>
                              <WalletCard data={wallets[chainName]} index={index} setLoading={setLoading} />
                            </Grid>
                          );
                        }
                      } else {
                        return (
                          <Grid item xs={6} key={index}>
                            <WalletCard data={wallets[chainName]} index={index} setLoading={setLoading} />
                          </Grid>
                        );
                      }
                    })}
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xl={5} sm={12}>
                <Stack padding={"25px"}>
                  <Box className={"fs-20-regular white"}>{t("wal-4_last-trans")}</Box>
                  {chain.tokens.length != 0 && (
                    <Stack direction={"row"} gap={2} className="m-tb-10">
                      <Button className={`common-btn ${currentChain == "chain" ? "active" : ""}`} onClick={() => selectToken("chain")}>
                        <Stack direction={"row"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} gap={1}>
                          <Box className="center-align">
                            <img src={chain.chain.logo} width={20} />
                          </Box>
                          <Box className="fs-14-regular white">{chain.chain.symbol}</Box>
                        </Stack>
                      </Button>
                      {chain.tokens.map((token, index) => (
                        <Button className={`common-btn ${currentChain == token.symbol ? "active" : ""}`} key={index} onClick={() => selectToken(token.symbol)}>
                          <Stack direction={"row"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} gap={1}>
                            <Box className="center-align">
                              <img src={token.logo} width={20} />
                            </Box>
                            <Box className="fs-14-regular white">{token.displaySymbol}</Box>
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Stack>
                <Box
                  sx={{
                    maxHeight: "800px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  <TransCard />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <ComingModal open={comingSoon} setOpen={setComingSoon} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Wallet;
