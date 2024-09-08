import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listen } from "@tauri-apps/api/event";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Snackbar, Stack, Box } from "@mui/material";
import Slide from "@mui/material/Slide";

import RedStrokeSmallButton from "../account/RedStrokeSmallButton";
import RedFullSmallButton from "../account/RedFullSmallButton";

import { setTempAccount } from "../../features/account/TempAccountSlice";
import { setTempWallet } from "../../features/wallet/TempWalletSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import { getKeccak256Hash } from "../../lib/api/Encrypt";

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

const GuestCompleteSnackbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);
  const walletStore: IWallet = useSelector(getWallet);

  const isGuest: boolean = useMemo(() => {
    if (accountStore?.nickName === "Guest" && accountStore?.password === getKeccak256Hash("")) return true;
    return false;
  }, [accountStore]);

  const [open, setOpen] = useState<boolean>(false);

  const handleDoNowClick = useCallback(async () => {
    dispatch(setTempAccount(accountStore));
    dispatch(setTempWallet(walletStore));

    navigate("/guest/complete/password");
  }, [accountStore, walletStore]);

  const handleLaterClick = useCallback(async () => {
    setOpen(false);
    setTimeout(() => {
      if (isGuest) {
        setOpen(true);
      }
    }, 60 * 60 * 1e3); // Show the snackbar after 1 hour
  }, [isGuest]);

  useEffect(() => {
    if (isGuest) {
      setTimeout(() => {
        setOpen(true);
      }, 60 * 1e3);
    }
  }, [isGuest]);

  useEffect(() => {
    const unlisten_guest_modal_view = listen(TauriEventNames.GUEST_MODAL_VIEW, async (event) => {
      const data: boolean = event.payload as boolean;
      setOpen(data);
    });

    return () => {
      unlisten_guest_modal_view.then((unlistenFn) => unlistenFn());
    };
  }, []);

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
                <Box className="fs-h4 white">{t("set-94_secure-passphrase-password")}</Box>
                <Box className="fs-16-regular white">{t("set-95_you-should-secure")}</Box>
              </Stack>
              <Box component="img" src={CloseIcon} width={"32px"} height={"32px"} onClick={handleLaterClick} />
            </Stack>
            <Stack direction={"row"} gap={"16px"} justifyContent={"flex-end"}>
              <RedFullSmallButton text={t("hom-29_do-it-now")} onClick={handleDoNowClick} />
              <RedStrokeSmallButton text={t("hom-30_later")} onClick={handleLaterClick} />
            </Stack>
          </Stack>
        </Box>
      </Snackbar>
    </>
  );
};
export default GuestCompleteSnackbar;
