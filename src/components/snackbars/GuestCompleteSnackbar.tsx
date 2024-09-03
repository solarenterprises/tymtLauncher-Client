import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Snackbar, Stack, Box } from "@mui/material";
import Slide from "@mui/material/Slide";

import RedStrokeSmallButton from "../account/RedStrokeSmallButton";
import RedFullSmallButton from "../account/RedFullSmallButton";

import { setTempAccount } from "../../features/account/TempAccountSlice";
import { setTempWallet } from "../../features/wallet/TempWalletSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

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

const GuestCompleteSnackbar = ({ open }: IPropsGuestCompleteSnackbar) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);
  const walletStore: IWallet = useSelector(getWallet);

  const handleDoNowClick = useCallback(async () => {
    dispatch(setTempAccount(accountStore));
    dispatch(setTempWallet(walletStore));

    navigate("/guest/complete/password");
  }, [accountStore, walletStore]);

  const handleLaterClick = async () => {};

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
                <Box className="fs-h4 white">{`Secure Passphrase and create password.`}</Box>
                <Box className="fs-16-regular white">{`You receive funds, you should secure your account in few steps: Secure Passphrase and create password.`}</Box>
              </Stack>
              <Box component="img" src={CloseIcon} width={"32px"} height={"32px"} />
            </Stack>
            <Stack direction={"row"} gap={"16px"} justifyContent={"flex-end"}>
              <RedFullSmallButton text="Do it now" onClick={handleDoNowClick} />
              <RedStrokeSmallButton text="Later" onClick={handleLaterClick} />
            </Stack>
          </Stack>
        </Box>
      </Snackbar>
    </>
  );
};
export default GuestCompleteSnackbar;
