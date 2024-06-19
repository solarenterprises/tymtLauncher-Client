import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Grid, Box, Stack } from "@mui/material";
import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";
import MnemonicComboBox from "../../../components/account/MnemonicComboBox";
import MnemonicPad from "../../../components/account/MnemonicPad";
import tymt3 from "../../../assets/account/tymt3.png";
import "../../../global.css";
import PassphraseModal from "../../../components/account/PassphraseModal";
import { motion } from "framer-motion";

const NonCustodialSignUp2 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleNextClick = () => {
    setPath("/non-custodial/signup/3");
    setOpen(true);
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
                      <Stepper all={4} now={2} texts={["", t("ncca-12_secure-wallet"), "", ""]} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-13_secure-passphrase")} text={t("ncca-14_here-your-mnemonic")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <MnemonicComboBox text="want" />
                    </Grid>
                    <Grid item xs={12} mt={"24px"}>
                      <MnemonicPad editable={true} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton text={t("ncl-6_next")} onClick={handleNextClick} />
                    </Grid>
                    <Grid item xs={12} mt={length === 12 ? "91px" : "40px"}>
                      <HaveAccount />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt3}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
      <PassphraseModal open={open} setOpen={setOpen} path={path} />
    </>
  );
};

export default NonCustodialSignUp2;
