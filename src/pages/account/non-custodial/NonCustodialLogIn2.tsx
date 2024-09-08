import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { readText } from "@tauri-apps/api/clipboard";
import { emit } from "@tauri-apps/api/event";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import "../../../global.css";

import { TauriEventNames } from "../../../consts/TauriEventNames";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicRevealPad from "../../../components/account/MnemonicRevealPad";

import { getTempAccount, setTempAccount } from "../../../features/account/TempAccountSlice";
import { setTempWallet } from "../../../features/wallet/TempWalletSlice";
import { getAccountList } from "../../../features/account/AccountListSlice";

import tymt2 from "../../../assets/account/tymt2.png";

import { checkMnemonic, getWalletAddressFromPassphrase } from "../../../lib/helper/WalletHelper";
import { getRsaKeyPair } from "../../../features/chat/RsaApi";

import { IAccount, IAccountList } from "../../../types/accountTypes";
import { INotificationParams } from "../../../types/NotificationTypes";

const NonCustodialLogIn2 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tempAccountStore: IAccount = useSelector(getTempAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      mnemonic: "",
    },
    validationSchema: Yup.object({
      mnemonic: Yup.string()
        .required(t("cca-63_required"))
        .test(
          "wordCount", // Name of the test
          "Mnemonic must contain either 12 or 24 words", // Error message
          (value) => {
            const words = value ? value.trim().split(/\s+/) : [];
            const wordCount = words.length;
            return wordCount === 12 || wordCount === 24;
          }
        )
        .test("validation", "Invalid Mnemonic", (value) => {
          return checkMnemonic(value);
        }),
    }),
    onSubmit: async () => {
      try {
        setLoading(true);

        const newPassphrase = formik.values.mnemonic.trim();
        const newWalletAddress = await getWalletAddressFromPassphrase(newPassphrase);
        const newRsaPubKey = (await getRsaKeyPair(newPassphrase))?.publicKey;

        if (accountListStore?.list?.some((one) => one?.sxpAddress === newWalletAddress?.solar)) {
          navigate("/start");
          const noti: INotificationParams = {
            status: "warning",
            title: "Warning",
            message: "That wallet was already imported in tymt!",
            link: null,
            translate: true,
          };
          emit(TauriEventNames.NOTIFICATION, noti);
          return;
        }

        dispatch(setTempWallet(newWalletAddress));
        dispatch(
          setTempAccount({
            ...tempAccountStore,
            mnemonic: newPassphrase,
            sxpAddress: newWalletAddress?.solar,
            rsaPubKey: newRsaPubKey,
          })
        );

        navigate("/non-custodial/import/1");
        setLoading(false);
      } catch (err) {
        console.log("Failed at NonCustodialLogin2: ", err);
        setLoading(false);
      }
    },
  });

  const handleBackClick = () => {
    navigate("/start");
  };

  const handlePasteClick = async () => {
    try {
      const mnemonic = await readText();
      formik.setFieldValue("mnemonic", mnemonic);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
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
                      <Stepper all={2} now={1} text={t("ncl-11_secure-passphrase")} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-63_hello")} text={t("ncl-12_type-your-mnemonic")} />
                    </Grid>
                    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                      <Grid item xs={12} mt={"48px"}>
                        <InputText
                          id="non-custodial-login"
                          label={t("ncl-13_paste-mnemonic")}
                          type="mnemonic"
                          name="mnemonic"
                          value={formik.values.mnemonic}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.mnemonic && formik.errors.mnemonic ? true : false}
                          onIconButtonClick={handlePasteClick}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          height: "20px",
                          padding: "0px 6px",
                        }}
                      >
                        {formik.touched.mnemonic && formik.errors.mnemonic && <Box className={"fs-16-regular red"}>{formik.errors.mnemonic}</Box>}
                      </Grid>
                      <Grid item xs={12}>
                        <MnemonicRevealPad passphrase={formik?.values?.mnemonic} />
                      </Grid>
                      <Grid item xs={12} mt={"40px"}>
                        <AccountNextButton
                          text={t("ncl-6_next")}
                          isSubmit={true}
                          disabled={loading || formik.errors.mnemonic ? true : false}
                          loading={loading}
                        />
                      </Grid>
                    </form>
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

export default NonCustodialLogIn2;
