import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch } from "../../../store";

import { readText } from "@tauri-apps/api/clipboard";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";

import tymt2 from "../../../assets/account/tymt2.png";

import "../../../global.css";
import { nonCustodialType } from "../../../types/accountTypes";
import { checkMnemonic } from "../../../consts/mnemonics";
import {
  getTempNonCustodial,
  setTempNonCustodial,
} from "../../../features/account/TempNonCustodialSlice";
import { getTempAddressesFromMnemonicAsync } from "../../../features/wallet/TempMultiWalletSlice";

const NonCustodialReset1 = () => {
  const navigate = useNavigate();
  const tempNonCustodialStore: nonCustodialType =
    useSelector(getTempNonCustodial);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      mnemonic: "",
    },
    validationSchema: Yup.object({
      mnemonic: Yup.string()
        .required(t("cca-63_required"))
        .test(
          "wordCount",
          "Mnemonic must contain either 12 or 24 words",
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
        setTempNonCustodial({
          ...tempNonCustodialStore,
          mnemonic: formik.values.mnemonic,
        })
      );
      dispatch(
        getTempAddressesFromMnemonicAsync({ mnemonic: formik.values.mnemonic })
      );
      navigate("/non-custodial/reset/2");
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
        <Grid item xs={12}>
          <Stack direction={"row"}>
            <Stack
              sx={{
                width: "calc(100vw - 656px)",
                height: "1008px",
              }}
            >
              <Grid container justifyContent={"center"} pt={"56px"}>
                <Grid
                  item
                  container
                  sx={{
                    width: "520px",
                  }}
                >
                  <Grid item xs={12} container justifyContent={"space-between"}>
                    <Back onClick={handleBackClick} />
                    <Stepper
                      all={2}
                      now={2}
                      texts={[
                        t("ncl-1_password"),
                        t("ncl-11_secure-passphrase"),
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader
                      title={t("ncl-2_welcome-back")}
                      text={t("ncl-12_type-your-mnemonic")}
                    />
                  </Grid>
                  <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: "100%" }}
                  >
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="non-custodial-login"
                        label={t("ncl-13_paste-mnemonic")}
                        type="mnemonic"
                        name="mnemonic"
                        value={formik.values.mnemonic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.mnemonic && formik.errors.mnemonic
                            ? true
                            : false
                        }
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
                      {formik.touched.mnemonic && formik.errors.mnemonic && (
                        <Box className={"fs-16-regular red"}>
                          {formik.errors.mnemonic}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton
                        text={t("ncl-6_next")}
                        isSubmit={true}
                        disabled={formik.errors.mnemonic ? true : false}
                      />
                    </Grid>
                  </form>
                  <Grid item xs={12} mt={"275px"}>
                    <DontHaveAccount />
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            <Box
              component={"img"}
              src={tymt2}
              sx={{
                width: "656px",
                height: "1008px",
                padding: "32px",
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialReset1;
