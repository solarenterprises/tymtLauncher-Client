import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { notificationType, propsType } from "../../types/settingTypes";
import { accountType, walletEnum } from "../../types/accountTypes";
import { IChain, ICurrency, multiWalletType } from "../../types/walletTypes";
import { getAccount } from "../../features/account/AccountSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getCustodial } from "../../features/account/CustodialSlice";
import { getChain } from "../../features/wallet/ChainSlice";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { getExplorerUrl } from "../../lib/helper";
import { openLink } from "../../lib/api/Downloads";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import SettingStyle from "../../styles/SettingStyle";
import settingImg from "../../assets/settings/setting-icon1.svg";
import walletImg from "../../assets/settings/wallet-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";
import copyIcon from "../../assets/settings/copy-icon.svg";
import searchIcon from "../../assets/settings/search-icon.svg";
import exitIcon from "../../assets/settings/exit-icon.svg";
import Avatar from "../../components/home/Avatar";
import numeral from "numeral";
import { getCurrency } from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";

const Main = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const account: accountType = useSelector(getAccount);
  const chainStore: IChain = useSelector(getChain);
  const notificationStore: notificationType = useSelector(selectNotification);
  const userStore = account.wallet === walletEnum.noncustodial ? useSelector(getNonCustodial) : useSelector(getCustodial);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const currencyStore: ICurrency = useSelector(getCurrency);

  const symbol: string = currencySymbols[currencyStore.current];
  const reserve = currencyStore.data[currencyStore.current];
  const currentChain: IChain =
    multiWalletStore[Object.keys(multiWalletStore).find((rowKey) => multiWalletStore[rowKey].chain.name === chainStore.chain.name) ?? "Solar"];
  const currentChainNativeBalance: number = (currentChain?.chain?.balance as number) * (currentChain?.chain?.price as number) * (reserve as number);
  const totalBalance: number =
    Object.keys(multiWalletStore).reduce((acc, rowKey) => {
      acc = acc + (multiWalletStore[rowKey]?.chain?.balance ?? 0) * (multiWalletStore[rowKey]?.chain?.price ?? 0);
      acc =
        acc +
        multiWalletStore[rowKey].tokens.reduce((sub, token) => {
          sub = sub + (token?.balance ?? 0) * (token?.price ?? 0);
          return sub;
        }, 0);
      return acc;
    }, 0) * (reserve as number);

  const handleExplorer = useCallback(() => {
    const url = getExplorerUrl(chainStore);
    openLink(url);
  }, [chainStore]);

  return (
    <>
      {view === "main" && (
        <Box className={classname.main_container}>
          <Box className={classname.user_pad} sx={{}}>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Box className="center-align">
                <Avatar onlineStatus={true} userid={account.uid} size={60} status={!notificationStore.alert ? "donotdisturb" : "online"} />
              </Box>
              <Box className="center-align" sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Box className="fs-14-light white">{t("set-1_welcome")}</Box>
                <Box className="fs-h4 white">{userStore.nickname}</Box>
              </Box>
            </Box>
            <Box>
              <Button
                className="button_navbar_common"
                onClick={() => {
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
                    src={currentChain?.chain?.logo ?? ""}
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
                  {account.wallet === walletEnum.noncustodial && <Box className="fs-14-light white">{t("wc-12_non-custodial-wallet")}</Box>}
                  {account.wallet !== walletEnum.noncustodial && <Box className="fs-14-light white">{t("wc-13_custodial-wallet")}</Box>}
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
                <Box className="fs-14-light blue">{currentChain?.chain?.wallet ?? ""}</Box>
                <Box className="fs-14-light gray">
                  {`${t("set-4_balance")} ${numeral(currentChain?.chain?.balance ?? 0).format("0,0.0000")} ${currentChain?.chain?.symbol} (${numeral(
                    currentChainNativeBalance
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
              <Button className="tooltip-btn" onClick={() => navigator.clipboard.writeText(currentChain?.chain?.wallet ?? "")}>
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
