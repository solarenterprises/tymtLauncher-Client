import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Modal, Fade, Box, Stack } from "@mui/material";

import RedStrokeButton from "../account/RedStrokeButton";
import RedFullButton from "../account/RedFullButton";

import { getBalanceList } from "../../features/wallet/BalanceListSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import SolarAPI from "../../lib/api/SolarAPI";

import { IBalanceList, IWallet } from "../../types/walletTypes";

import CloseIcon from "../../assets/settings/x-icon.svg";
import Logo from "../../assets/main/foxhead-comingsoon.png";

const StakingModal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const walletStore: IWallet = useSelector(getWallet);

  const [open, setOpen] = useState<boolean>(false);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const checkOpen = useCallback(async () => {
    try {
      const query2 = {
        page: 1,
        limit: 1,
      };
      const res = await SolarAPI.getData(query2, `wallets/${walletStore?.solar}/votes`);
      const votingData = res?.data?.data[0].asset.votes ?? {};
      const votingDataLength = Object.keys(votingData).length ?? 0;

      const sxpBalance = balanceListStore?.list?.find((one) => one?.symbol === "SXP")?.balance;

      if (sxpBalance > 0 && votingDataLength === 0) setOpen(true);
      else setOpen(false);
    } catch (err) {
      console.log("Failed to SolarGetMyVotingData: ", err);
    }
  }, [walletStore, balanceListStore]);

  const handleCloseClick = () => {
    setOpen(false);
  };

  const handleStakeClick = () => {
    setOpen(false);
    navigate("/wallet/vote");
  };

  useEffect(() => {
    setTimeout(() => {
      checkOpen();
    }, 30 * 1000); // 30 sec

    const intervalId = setInterval(() => {
      checkOpen();
    }, 30 * 60 * 1000); // 30 min

    return () => {
      if (intervalId) clearInterval(intervalId);
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
                  <Box className="fs-40-bold blue t-center">{t("wal-81_unlock-earning-potential")}</Box>
                  <Box className="fs-16-regular light t-center">{t("wal-82_you-not-staked")}</Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} width={"100%"} gap={"10px"} justifyContent={"center"}>
                  <RedStrokeButton text={t("wal-79_later")} onClick={handleCloseClick} />
                  <RedFullButton text={t("wal-80_stake-now")} onClick={handleStakeClick} />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default StakingModal;
