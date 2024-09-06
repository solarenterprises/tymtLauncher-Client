import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { emit } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import { Client } from "@alessiodf/wsapi-client";
import { isArray } from "lodash";
import numeral from "numeral";

import { solar_wss_url } from "../../configs";
import { ChainNames } from "../../consts/Chains";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Snackbar, Stack, Box } from "@mui/material";
import Slide from "@mui/material/Slide";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { getWallet } from "../../features/wallet/WalletSlice";
import { fetchChainBalanceAsync } from "../../features/wallet/BalanceListSlice";

import { getKeccak256Hash } from "../../lib/api/Encrypt";
import { getCurrentChainWalletAddress } from "../../lib/helper/WalletHelper";

import CloseIcon from "../../assets/settings/x-icon.svg";
import BellIcon from "../../assets/bell.svg";
import NotiIcon from "../../assets/main/32x32.png";

import { IAccount } from "../../types/accountTypes";
import { IWallet } from "../../types/walletTypes";
import { IMoneyReceivedEventPayload } from "../../types/TauriEventPayloadTypes";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export interface IPropsGuestCompleteSnackbar {
  open: boolean;
}

const MoneyReceivedSnackbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const accountStore: IAccount = useSelector(getAccount);
  const walletStore: IWallet = useSelector(getWallet);

  const accountStoreRef = useRef(accountStore);
  const walletStoreRef = useRef(walletStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);

  const [open, setOpen] = useState<boolean>(false);
  const [sender, setSender] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const client = new Client(solar_wss_url);

  const handleClose = () => {
    setOpen(false);
    setSender("");
    setAmount(0);
  };

  const handleTransactionApplied = async (data) => {
    try {
      const sxpAddress = getCurrentChainWalletAddress(walletStoreRef?.current, ChainNames.SOLAR);
      const response = JSON.parse(JSON.stringify(data));
      const transferArray: Array<{ amount: string; recipientId: string }> = response?.data?.asset?.transfers;
      const isGuest: boolean = accountStoreRef?.current?.nickName === "Guest" && accountStoreRef?.current?.password === getKeccak256Hash("");
      console.log("isisGuest", isGuest, accountStoreRef.current?.nickName);

      if (!transferArray || !isArray(transferArray)) return;

      const target = transferArray?.find((one) => one?.recipientId === sxpAddress);
      if (!target) return;

      await dispatch(
        fetchChainBalanceAsync({
          walletStore: walletStoreRef?.current,
          chainName: ChainNames.SOLAR,
        })
      );

      if (isGuest) {
        const noti: IMoneyReceivedEventPayload = {
          view: true,
          amount: parseFloat(target?.amount) / 1e8,
        };
        emit(TauriEventNames.MONEY_RECEIVED_MODAL_VIEW, noti);
      } else {
        setSender(target?.recipientId);
        setAmount(parseFloat(target?.amount));
        setOpen(true);

        let permissionGranted = await isPermissionGranted();
        const windowIsVisible = await invoke<boolean>("is_window_visible");
        console.log("permissionGranted", permissionGranted);
        console.log("windowIsVisible", windowIsVisible);
        if (!permissionGranted) {
          const permission = await requestPermission();
          permissionGranted = permission === "granted";
        }
        if (permissionGranted && !windowIsVisible) {
          sendNotification({
            title: t("wal-71_SXP-received"),
            body: `${target?.recipientId}${t("wal-72_sent-you-sxp-1")}${numeral(parseFloat(target?.amount) / 1e8).format("0,0.[0000]")}SXP${t(
              "wal-73_sent-you-sxp-2"
            )}`,
            icon: NotiIcon,
          });
        }
      }
    } catch (err) {
      console.log("Failed at client.subscribe: ", err);
      handleClose();
    }
  };

  const subscribeForTransactions = async () => {
    try {
      await client.connect();
      client.subscribe(`transaction.applied`, handleTransactionApplied);
      console.log("client subscribeForTransactions");
    } catch (err) {
      console.log("Failed to client subscribeForTransactions: ", err);
    }
  };

  useEffect(() => {
    subscribeForTransactions();
    return () => {
      try {
        client.unsubscribe(`transaction.applied`);
        console.log("client disconnected");
      } catch (err) {
        console.log("Failed to client disconnect: ", err);
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        handleClose();
      }, 5 * 1e3);
    }
  }, [open]);

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{
          maxWidth: "800px",
          zIndex: 5000,
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:active": {
            transform: "scale(0.9)",
          },
        }}
        onClick={() => {
          handleClose();
          navigate("/wallet");
        }}
      >
        <Box
          sx={{
            maxWidth: "420px",
            padding: "12px 16px",
            border: `2px solid #485B61`,
            borderRadius: "32px",
            backdropFilter: "blur(8px)",
            background: "#8080804D",
          }}
        >
          <Stack gap={"10px"}>
            <Stack direction={"row"} alignItems={"center"} gap={"12px"}>
              <Box component="img" src={BellIcon} width={"32px"} height={"32px"} />
              <Stack gap={"8px"}>
                <Box className="fs-h4 white">{t("wal-71_SXP-received")}</Box>
                <Box className="fs-16-regular white">{`${sender}${t("wal-72_sent-you-sxp-1")}${numeral(amount / 1e8).format("0,0.00")}SXP${t(
                  "wal-73_sent-you-sxp-2"
                )}`}</Box>
              </Stack>
              <Box component="img" src={CloseIcon} width={"32px"} height={"32px"} onClick={handleClose} />
            </Stack>
          </Stack>
        </Box>
      </Snackbar>
    </>
  );
};
export default MoneyReceivedSnackbar;
