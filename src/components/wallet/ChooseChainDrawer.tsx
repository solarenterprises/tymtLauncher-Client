import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  SwipeableDrawer,
  Box,
  Stack,
  Button,
  Divider,
  IconButton,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import closeImg from "../../assets/settings/collaps-close-btn.svg";

import SettingStyle from "../../styles/SettingStyle";

import { setChainAsync } from "../../features/wallet/ChainSlice";
import {
  getMultiWallet,
  refreshBalancesAsync,
} from "../../features/wallet/MultiWalletSlice";
import { AppDispatch } from "../../store";
import { formatBalance } from "../../lib/helper";
import { IChain, ICurrency, multiWalletType } from "../../types/walletTypes";
import { setTransasctions } from "../../features/wallet/CryptoSlice";
import Loading from "../../components/Loading";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
import {
  getCurrency,
  refreshCurrencyAsync,
} from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";

import { useNotification } from "../../providers/NotificationProvider";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
}

const ChooseChainDrawer = ({ view, setView }: props) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const [state, setState] = useState({ right: false });
  const dispatch = useDispatch<AppDispatch>();
  const wallets: multiWalletType = useSelector(getMultiWallet);
  const accountStore: accountType = useSelector(getAccount);
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const symbol: string = currencySymbols[currencyStore.current];
  const [loading, setLoading] = useState<boolean>(false);

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  useEffect(() => {
    dispatch(
      refreshBalancesAsync({
        _multiWalletStore: wallets,
        _accountStore: accountStore,
      })
    ).then(() => dispatch(refreshCurrencyAsync()));
  }, [dispatch]);

  const selectChain = useCallback((data: IChain) => {
    const udpateData = { ...data, currentToken: "chain" };
    setLoading(true);
    dispatch(setTransasctions());
    dispatch(setChainAsync(udpateData)).then(() => {
      setNotificationOpen(true);
      setNotificationTitle(
        `${t("alt-11_switched-network")} ${data?.chain?.name}`
      );
      setNotificationDetail(
        `${t("alt-12_switched-network-intro")} ${data?.chain?.name}`
      );
      setNotificationStatus("success");
      setNotificationLink(null);
      setLoading(false);
    });
  }, []);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  return (
    <SwipeableDrawer
      anchor="right"
      open={view}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classname.setting_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
    >
      {loading && <Loading />}
      <Box className={classname.collaps_pan}>
        <img
          src={closeImg}
          className={classname.close_icon}
          onClick={() => setView(false)}
        />
      </Box>
      <Box className={classname.setting_pan}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"16px"}
          padding={"18px 16px"}
        >
          <IconButton
            className="icon-button"
            sx={{
              width: "24px",
              height: "24px",
              padding: "4px",
            }}
            onClick={() => setView(false)}
          >
            <ArrowBackOutlinedIcon className="icon-button" />
          </IconButton>
          <Box className="fs-24-bold white">{t("set-5_choose-chain")}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />

        {Object.keys(wallets).map((rowKey, index) => (
          <>
            <Button
              className="common-btn"
              onClick={() => selectChain(wallets[rowKey])}
              fullWidth
              key={index}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={"12px 16px"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={"16px"}>
                  <Box
                    component={"img"}
                    src={wallets[rowKey].chain.logo}
                    width="32px"
                    height="32px"
                  />
                  <Stack>
                    <Box className="fs-18-regular white">
                      {wallets[rowKey].chain.name}
                    </Box>
                    <Box className="fs-12-regular blue">
                      {wallets[rowKey]?.chain.wallet}
                    </Box>
                  </Stack>
                </Stack>
                <Stack>
                  <Box className="fs-18-regular white t-right">
                    {formatBalance(wallets[rowKey].chain.balance ?? 0, 4)}
                  </Box>
                  <Box className="fs-12-regular light t-right">
                    {`${symbol} ${formatBalance(
                      Number(wallets[rowKey].chain.balance ?? 0) *
                        Number(wallets[rowKey].chain.price ?? 0) *
                        reserve
                    )}`}
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
              }}
            />
          </>
        ))}
      </Box>
    </SwipeableDrawer>
  );
};

export default ChooseChainDrawer;
