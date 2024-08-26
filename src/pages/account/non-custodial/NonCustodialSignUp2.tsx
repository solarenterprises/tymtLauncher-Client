import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicComboBox from "../../../components/account/MnemonicComboBox";
import MnemonicPad from "../../../components/account/MnemonicPad";
import PassphraseModal from "../../../components/account/PassphraseModal";

import tymt3 from "../../../assets/account/tymt3.png";

import { getMnemonic } from "../../../consts/mnemonics";
import { getTempAccount, setTempAccount } from "../../../features/account/TempAccountSlice";
import { IAccount } from "../../../types/accountTypes";

const NonCustodialSignUp2 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const [open, setOpen] = useState(false);
  const [length, setLength] = useState<number>(12);
  const [passphrase, setPassphrase] = useState<string>(getMnemonic(12));

  useEffect(() => {
    setPassphrase(getMnemonic(length));
  }, [length]);

  const handleBackClick = () => {
    navigate("/welcome");
  };

  const handleNextClick = useCallback(() => {
    if (!passphrase) return;
    dispatch(
      setTempAccount({
        ...tempAccountStore,
        mnemonic: passphrase,
      })
    );
    setOpen(true);
  }, [passphrase, tempAccountStore]);

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
                      <MnemonicComboBox text="want" length={length} setLength={setLength} />
                    </Grid>
                    <Grid item xs={12} mt={"24px"}>
                      <MnemonicPad editable={true} length={length} passphrase={passphrase} setPassphrase={setPassphrase} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton text={t("ncl-6_next")} onClick={handleNextClick} />
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
      <PassphraseModal open={open} setOpen={setOpen} />
    </>
  );
};

export default NonCustodialSignUp2;
