import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";
import { supportChains } from "../../consts/SupportTokens";

import Avatar from "../../components/home/Avatar";

import { selectNotification } from "../../features/settings/NotificationSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";
import { getBalanceList } from "../../features/wallet/BalanceListSlice";
import { getPriceList } from "../../features/wallet/PriceListSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import { getExplorerUrl } from "../../lib/helper";
import { openLink } from "../../lib/helper/DownloadHelper";
import { getCurrentChainWalletAddress } from "../../lib/helper/WalletHelper";

import SettingStyle from "../../styles/SettingStyle";

import settingImg from "../../assets/settings/setting-icon1.svg";
import walletImg from "../../assets/settings/wallet-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";
import copyIcon from "../../assets/settings/copy-icon.svg";
import searchIcon from "../../assets/settings/search-icon.svg";
import exitIcon from "../../assets/settings/exit-icon.svg";

import { IMyInfo } from "../../types/chatTypes";
import { notificationType, propsType } from "../../types/settingTypes";
import { IBalanceList, ICurrencyList, ICurrentChain, ICurrentCurrency, IPriceList, ISupportChain, IWallet } from "../../types/walletTypes";

const Main = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const notificationStore: notificationType = useSelector(selectNotification);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);
  const walletStore: IWallet = useSelector(getWallet);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const currentChainInfo: ISupportChain = useMemo(() => supportChains?.find((one) => one?.chain?.name === currentChainStore?.chain), [currentChainStore]);
  const currentChainWalletAddress: string = useMemo(
    () => getCurrentChainWalletAddress(walletStore, currentChainStore?.chain),
    [walletStore, currentChainStore]
  );
  const currentChainNativeBalance = useMemo(
    () => balanceListStore?.list?.find((one) => one?.symbol === currentChainInfo?.chain?.symbol)?.balance,
    [balanceListStore, currentChainInfo]
  );
  const currentChainNativePrice = useMemo(
    () => priceListStore?.list?.find((one) => one?.cmc === currentChainInfo?.chain?.cmc)?.price,
    [priceListStore, currentChainInfo]
  );
  const totalBalance = useMemo(() => {
    let total = 0;

    for (const supportChain of supportChains ?? []) {
      const nativeBalance = balanceListStore?.list?.find((one) => one?.symbol === supportChain?.chain?.symbol)?.balance;
      const nativePrice = priceListStore?.list?.find((one) => one?.cmc === supportChain?.chain?.cmc)?.price;
      total += (nativeBalance ?? 0) * (nativePrice ?? 0);

      for (const token of supportChain?.tokens ?? []) {
        const tokenBalance = balanceListStore?.list?.find((one) => one?.symbol === token?.symbol)?.balance;
        const tokenPrice = priceListStore?.list?.find((one) => one?.cmc === token?.cmc)?.price;
        total += (tokenBalance ?? 0) * (tokenPrice ?? 0);
      }
    }

    const res = total * reserve;
    return res;
  }, [balanceListStore, priceListStore, reserve]);

  const handleExplorer = useCallback(() => {
    const url = getExplorerUrl(currentChainInfo, walletStore);
    openLink(url);
  }, [currentChainInfo]);

  return (
    <>
      {view === "main" && (
        <Box className={classname.main_container}>
          <Box
            onClick={() => setView("chooseProfile")}
            className={classname.user_pad}
            sx={{
              transition: "all 0.3s ease",
              cursor: "pointer",
              borderRadius: "22px 22px 0px 0px",
              "&:hover": {
                backgroundColor: "#ffffff1a",
              },
            }}
          >
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Box className="center-align">
                <Avatar onlineStatus={true} url={myInfoStore?.avatar} size={60} status={!notificationStore.alert ? "donotdisturb" : "online"} />
              </Box>
              <Box className="center-align" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Box className="fs-14-light white">{t("set-1_welcome")}</Box>
                <Box className="fs-h4 white">{myInfoStore?.nickName}</Box>
              </Box>
              <Box component={"img"} src={arrowImg} />
            </Box>
            <Box>
              <Button
                className="button_navbar_common"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setView("general");
                }}
                sx={{ padding: 0 }}
              >
                <img src={settingImg} />
              </Button>
            </Box>
          </Box>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Button onClick={() => setView("chain")} className="center-align common-btn">
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} alignItems={"center"}>
              <Box className="center-align" sx={{ gap: "10px" }}>
                <Box className="center-align" sx={{ position: "relative" }}>
                  <img src={walletImg} />
                  <img
                    src={currentChainInfo?.chain?.logo}
                    style={{
                      position: "absolute",
                      right: "-5px",
                      bottom: "-5px",
                      width: "25px",
                    }}
                  />
                </Box>
                <Box
                  className="center-align"
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginLeft: "10px",
                  }}
                >
                  <Box className="fs-14-light gray">{t("set-3_connected-method")}:</Box>
                  <Box className="fs-14-light white">{t("wc-12_non-custodial-wallet")}</Box>
                </Box>
              </Box>
              <Box>
                <img src={arrowImg} />
              </Box>
            </Stack>
          </Button>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Box className={classname.addresss_pad}>
            <Box className={classname.wallet_add_panel} sx={{ justifyContent: "space-between" }}>
              <Box
                sx={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <Box className="fs-14-light gray">{t("set-2_connected-wallet-address")}:</Box>
                <Box className="fs-14-light blue">{currentChainWalletAddress ?? ""}</Box>
                <Box className="fs-14-light gray">
                  {`${t("set-4_balance")} ${numeral(currentChainNativeBalance ?? 0).format("0,0.0000")} ${currentChainInfo?.chain?.symbol} (${numeral(
                    (currentChainNativeBalance ?? 0) * (currentChainNativePrice ?? 0)
                  ).format("0,0.00")} ${symbol})`}
                </Box>
                <Box className="fs-14-light gray">{`${t("set-88_total_balance")} ${numeral(totalBalance).format("0,0.00")} ${symbol}`}</Box>
              </Box>
              <Box className="center-align">
                <img src={arrowImg} />
              </Box>
            </Box>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Box className={classname.icon_pad}>
              <Button className="tooltip-btn" onClick={() => navigator.clipboard.writeText(currentChainWalletAddress ?? "")}>
                <Tooltip title={t("set-79_copy-address")} classes={{ tooltip: classname.tooltip }}>
                  <Box className="center-align">
                    <img src={copyIcon} data-tooltip-id="copy-tooltip" />
                  </Box>
                </Tooltip>
              </Button>
              <Button className="tooltip-btn" onClick={handleExplorer}>
                <Tooltip title={t("set-80_open-in-explorer")} classes={{ tooltip: classname.tooltip }}>
                  <Box className="center-align">
                    <img src={searchIcon} />
                  </Box>
                </Tooltip>
              </Button>
              <Button className="tooltip-btn" onClick={() => navigate("/start")}>
                <Tooltip title={t("set-81_disconnect")} classes={{ tooltip: classname.tooltip }}>
                  <Box className="center-align">
                    <img src={exitIcon} />
                  </Box>
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Main;
