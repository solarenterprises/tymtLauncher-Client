import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listen } from "@tauri-apps/api/event";
import numeral from "numeral";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Modal, Fade, Box, Stack } from "@mui/material";

import RedStrokeButton from "../account/RedStrokeButton";
import RedFullButton from "../account/RedFullButton";

import { setTempAccount } from "../../features/account/TempAccountSlice";
import { setTempWallet } from "../../features/wallet/TempWalletSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import CloseIcon from "../../assets/settings/x-icon.svg";
import Logo from "../../assets/main/foxhead-comingsoon.png";

import { IMoneyReceivedEventPayload } from "../../types/TauriEventPayloadTypes";
import { IWallet } from "../../types/walletTypes";
import { IAccount } from "../../types/accountTypes";

const FirstFundModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accountStore: IAccount = useSelector(getAccount);
  const walletStore: IWallet = useSelector(getWallet);

  const [open, setOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleContinueClick = () => {
    setOpen(false);
  };

  const handleBackupClick = useCallback(async () => {
    dispatch(setTempAccount(accountStore));
    dispatch(setTempWallet(walletStore));

    navigate("/guest/complete/password");
    setOpen(false);
  }, [accountStore, walletStore]);

  useEffect(() => {
    const unlisten_money_received_modal_view = listen(TauriEventNames.MONEY_RECEIVED_MODAL_VIEW, async (event) => {
      const data = event.payload as IMoneyReceivedEventPayload;
      setOpen(data?.view);
      setAmount(data?.amount ?? 0);
    });

    return () => {
      unlisten_money_received_modal_view.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              maxWidth: "420px",
              padding: "30px",
              borderRadius: "16px",
              border: "3px solid #ffffff33",
              background: "#8080804d",
              backgroundBlendMode: "luminosity",
              backdropFilter: "blur(10px)",
              "&:focusVisible": {
                outline: "none",
              },
            }}
          >
            <img src={CloseIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
              <Box className="center-align">
                <img width={200} src={Logo} />
              </Box>
              <Stack gap={"32px"}>
                <Stack gap={"10px"}>
                  <Box className="fs-40-bold blue t-center">{`+ ${numeral(amount).format("0,0.[0000]")} SXP`}</Box>
                  <Box className="fs-40-bold white t-center">{t("wal-74_you-received-sxp")}</Box>
                  <Box className="fs-16-regular light t-center">{t("wal-75_you-havent-backup")}</Box>
                  <Box className="fs-16-bold red t-center">{t("wal-76_without-backup-risk")}</Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} width={"100%"} gap={"10px"} justifyContent={"center"}>
                  <RedStrokeButton text={t("wal-77_continue")} onClick={handleContinueClick} />
                  <RedFullButton text={t("wal-78_backup-now")} onClick={handleBackupClick} />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default FirstFundModal;
