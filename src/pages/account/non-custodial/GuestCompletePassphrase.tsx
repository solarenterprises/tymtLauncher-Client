import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import { motion } from "framer-motion";

import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicRevealPad from "../../../components/account/MnemonicRevealPad";

import { getTempAccount } from "../../../features/account/TempAccountSlice";

import tymt2 from "../../../assets/account/tymt2.png";

import { IAccount } from "../../../types/accountTypes";

const GuestCompletePassphrase = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const [blur, setBlur] = useState<boolean>(true);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleNextClick = () => {
    navigate("/guest/complete/nickname");
  };

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={3} now={2} text={t("ncca-12_secure-wallet")} />
                    </Grid>

                    <Grid item xs={12} mt={"40px"}>
                      <AccountHeader title={t("ncl-11_secure-passphrase")} text={t("ncca-67_write-down")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <MnemonicRevealPad passphrase={tempAccountStore?.mnemonic} blur={blur} setBlur={setBlur} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton text={t("ncl-6_next")} onClick={handleNextClick} />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt2}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default GuestCompletePassphrase;
