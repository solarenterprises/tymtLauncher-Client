import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { emit, listen } from "@tauri-apps/api/event";
import { Client } from "@alessiodf/wsapi-client";
import { isArray } from "lodash";

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

import { IAccount } from "../../types/accountTypes";
import { IWallet } from "../../types/walletTypes";

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

  const isGuest: boolean = useMemo(() => {
    if (accountStore?.nickName === "Guest" && accountStore?.password === getKeccak256Hash("")) return true;
    return false;
  }, [accountStore]);

  const [open, setOpen] = useState<boolean>(false);
  const [sender, setSender] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const client = new Client(solar_wss_url);

  const handleClose = () => {
    setOpen(false);
    setSender("");
    setAmount(0);
  };

  const subscribeForTransactions = useCallback(async () => {
    await client.connect();

    const sxpAddress = getCurrentChainWalletAddress(walletStore, ChainNames.SOLAR);

    client.subscribe(`transaction.applied`, (data) => {
      const response = JSON.parse(JSON.stringify(data));
      const transferArray: Array<{ amount: string; recipientId: string }> = response?.data?.asset?.transfers;
      if (!transferArray || !isArray(transferArray)) return;
      const target = transferArray?.find((one) => one?.recipientId === sxpAddress);
      if (target) {
        if (isGuest) emit(TauriEventNames.GUEST_MODAL_VIEW, true);
        else {
          setSender(target?.recipientId);
          setAmount(parseFloat(target?.amount));
          setOpen(true);
          dispatch(
            fetchChainBalanceAsync({
              walletStore: walletStore,
              chainName: ChainNames.SOLAR,
            })
          );
        }
      }
    });
  }, [walletStore, isGuest]);

  useEffect(() => {
    subscribeForTransactions();
  }, []);

  useEffect(() => {
    const unlisten_guest_modal_view = listen(TauriEventNames.GUEST_MODAL_VIEW, async (event) => {
      const data: boolean = event.payload as boolean;
      setOpen(data);
    });

    return () => {
      unlisten_guest_modal_view.then((unlistenFn) => unlistenFn());
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
                <Box className="fs-16-regular white">{`${sender}${t("wal-72_sent-you-sxp-1")}${amount}SXP${t("wal-73_sent-you-sxp-2")}`}</Box>
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
