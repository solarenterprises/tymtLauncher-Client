import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { readText } from "@tauri-apps/api/clipboard";

import { AppDispatch } from "../../../store";
import { getNonCustodial } from "../../../features/account/NonCustodialSlice";
import { getTempNonCustodial, setTempNonCustodial } from "../../../features/account/TempNonCustodialSlice";
import { getTempAddressesFromMnemonicAsync } from "../../../features/wallet/TempMultiWalletSlice";
import { getAccount, setAccount } from "../../../features/account/AccountSlice";

import AuthAPI from "../../../lib/api/AuthAPI";

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";

import tymt2 from "../../../assets/account/tymt2.png";
import "../../../global.css";

import { accountType, loginEnum, nonCustodialType } from "../../../types/accountTypes";

import tymtCore from "../../../lib/core/tymtCore";
import { checkMnemonic } from "../../../consts/mnemonics";

const NonCustodialLogIn2 = () => {
  const navigate = useNavigate();
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const { t } = useTranslation();
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
    onSubmit: () => {
      dispatch(
        setAccount({
          ...accountStore,
          mode: loginEnum.import,
        })
      );
      dispatch(
        setTempNonCustodial({
          ...tempNonCustodialStore,
          mnemonic: formik.values.mnemonic,
        })
      );
      setLoading(true);
      dispatch(getTempAddressesFromMnemonicAsync({ mnemonic: formik.values.mnemonic })).then(async () => {
        const res = await AuthAPI.getUserBySolarAddress(await tymtCore.Blockchains.solar.wallet.getAddress(formik.values.mnemonic));
        if (res.data.users.length === 0) {
          navigate("/non-custodial/import/1");
        } else {
          dispatch(
            setTempNonCustodial({
              ...tempNonCustodialStore,
              mnemonic: formik.values.mnemonic,
              nickname: res.data.users[0].nickName,
            })
          );
          if (nonCustodialStore.password === "") {
            navigate("/non-custodial/import/3");
          } else {
            navigate("/non-custodial/import/4");
          }
        }
        setLoading(false);
      });
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
                      <Stepper all={4} now={2} texts={["", t("ncl-11_secure-passphrase"), t("ncl-1_password"), ""]} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncl-2_welcome-back")} text={t("ncl-12_type-your-mnemonic")} />
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
                      <Grid item xs={12} mt={"40px"}>
                        <AccountNextButton
                          text={t("ncl-6_next")}
                          isSubmit={true}
                          disabled={loading || formik.errors.mnemonic ? true : false}
                          loading={loading}
                        />
                      </Grid>
                    </form>
                    <Grid item xs={12} mt={"50px"}>
                      <DontHaveAccount />
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

export default NonCustodialLogIn2;
