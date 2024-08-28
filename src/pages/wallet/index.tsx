import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";
import { supportChains } from "../../consts/SupportTokens";

import { Grid, Stack, Box, Tooltip, IconButton, Button } from "@mui/material";

import SwitchComp from "../../components/SwitchComp";
import WalletCard from "../../components/wallet/WalletCard";
import TransCard from "../../components/wallet/TransCard";
import Loading from "../../components/Loading";
import ComingModal from "../../components/ComingModal";
import AnimatedComponent from "../../components/AnimatedComponent";

import { AppDispatch } from "../../store";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getBalanceList } from "../../features/wallet/BalanceListSlice";
import { getPriceList } from "../../features/wallet/PriceListSlice";
import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";

import sendIcon from "../../assets/wallet/send-icon.svg";
import receiveIcon from "../../assets/wallet/receive-icon.svg";
import percentIcon from "../../assets/wallet/percent-icon.svg";
import refreshIcon from "../../assets/wallet/refresh-icon.svg";

import { IBalanceList, ICurrencyList, ICurrentChain, ICurrentCurrency, ICurrentToken, IPriceList } from "../../types/walletTypes";
import { IWalletSetting } from "../../types/settingTypes";

import WalletStyle from "../../styles/WalletStyles";
import SettingStyle from "../../styles/SettingStyle";
import { getSupportChainByName, getTokenBalanceBySymbol } from "../../lib/helper/WalletHelper";
import { getCurrentToken } from "../../features/wallet/CurrentTokenSlice";
import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";

// const order = ["Solar", "Binance", "Ethereum", "Bitcoin", "Solana", "Polygon", "Avalanche", "Arbitrum", "Optimism"];

const Wallet = () => {
  const classname = WalletStyle();
  const tooltip = SettingStyle();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentTokenStore: ICurrentToken = useSelector(getCurrentToken);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);

  const [loading, setLoading] = useState<boolean>(false);
  const [comingSoon, setComingSoon] = useState<boolean>(false);

  const currentSupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);
  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const totalBalance = useMemo(() => {
    supportChains?.reduce((acc, supportChain) => {
      const nativeBalance = balanceListStore?.list?.find((one) => one?.symbol === supportChain?.chain?.symbol)?.balance;
      const nativePrice = priceListStore?.list?.find((one) => one?.cmc === supportChain?.chain?.cmc)?.price;
      acc = acc + (nativeBalance ?? 0) * (nativePrice ?? 0);
      acc =
        acc +
        supportChain?.tokens?.reduce((sub, token) => {
          const tokenBalance = balanceListStore?.list?.find((one) => one?.symbol === token?.symbol)?.balance;
          const tokenPrice = priceListStore?.list?.find((one) => one?.cmc === token?.cmc)?.price;
          sub = sub + (tokenBalance ?? 0) * (tokenPrice ?? 0);
          return sub;
        }, 0);
      return acc;
    }, 0) * (reserve as number);
  }, [balanceListStore, priceListStore, reserve]);

  return (
    <>
      <AnimatedComponent threshold={0}>
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
                          {supportChains?.map((supportChain, index) => (
                            <Tooltip title={supportChain?.chain?.name} placement="top" key={index} classes={{ tooltip: tooltip.tooltip }}>
                              <img
                                src={supportChain?.chain?.logo}
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
                        <Box className="fs-h2 white">{numeral(totalBalance).format("0,0.00")}</Box>
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
                        <IconButton className={"wallet-icon-button"} onClick={() => {}}>
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
                        checked={walletSettingStore?.hidde}
                        onClick={() => {
                          dispatch(
                            setWalletSetting({
                              ...walletSettingStore,
                              hidde: !walletSettingStore?.hidde,
                            })
                          );
                        }}
                      />
                    </Box>
                  </Stack>
                  <Grid container spacing={"32px"}>
                    {supportChains?.map((supportChain, index) => {
                      if (walletSettingStore?.hidde) {
                        if (Number(getTokenBalanceBySymbol(balanceListStore, supportChain?.chain?.symbol)) !== 0) {
                          return (
                            <Grid item xs={6} key={index}>
                              <WalletCard supportChain={supportChain} index={index} setLoading={setLoading} />
                            </Grid>
                          );
                        }
                      } else {
                        return (
                          <Grid item xs={6} key={index}>
                            <WalletCard supportChain={supportChain} index={index} setLoading={setLoading} />
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
                  {currentSupportChain?.tokens?.length != 0 && (
                    <Stack direction={"row"} gap={2} className="m-tb-10">
                      <Button className={`common-btn ${currentTokenStore?.token === "chain" ? "active" : ""}`} onClick={() => {}}>
                        <Stack direction={"row"} justifyContent={"center"} textAlign={"center"} alignItems={"center"} gap={1}>
                          <Box className="center-align">
                            <img src={currentSupportChain?.chain?.logo} width={20} />
                          </Box>
                          <Box className="fs-14-regular white">{currentSupportChain?.chain?.symbol}</Box>
                        </Stack>
                      </Button>
                      {currentSupportChain?.tokens.map((token, index) => (
                        <Button className={`common-btn ${currentTokenStore?.token === token.symbol ? "active" : ""}`} key={index} onClick={() => {}}>
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
      </AnimatedComponent>
      <ComingModal open={comingSoon} setOpen={setComingSoon} />
    </>
  );
};

export default Wallet;
