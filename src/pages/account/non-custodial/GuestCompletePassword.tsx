import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";

import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";

import { AppDispatch } from "../../../store";
import { getTempAccount, setTempAccount } from "../../../features/account/TempAccountSlice";

import { decrypt } from "../../../lib/api/Encrypt";

import tymt3 from "../../../assets/account/tymt3.png";

import { IAccount } from "../../../types/accountTypes";

const GuestCompletePassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordMatch: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .test(
          "password-requirements",
          "Password must meet at least four out of the five requirements: Include a lowercase letter, an uppercase letter, a number, a special character, and be at least 8 characters long.",
          (value) => {
            if (!value) {
              return false;
            }
            const checks = [
              /[a-z]/.test(value), // Check for lowercase letter
              /[A-Z]/.test(value), // Check for uppercase letter
              /\d/.test(value), // Check for digit
              /^[^\s'";\\]+$/.test(value), // Exclude spaces, single quotes, double quotes, semicolons, and backslashes
              value.length >= 8, // Check for minimum length
            ];
            const passedConditions = checks.filter(Boolean).length;
            return passedConditions >= 4;
          }
        )
        .required(t("cca-63_required")),
      passwordMatch: Yup.string()
        .required(t("cca-63_required"))
        .oneOf([Yup.ref("password")], t("cca-64_password-must-match")),
    }),
    onSubmit: async () => {
      try {
        const newPassword = formik.values.password;
        const decryptedMnemonic = await decrypt(tempAccountStore?.mnemonic, "");
        dispatch(
          setTempAccount({
            ...tempAccountStore,
            password: newPassword,
            mnemonic: decryptedMnemonic,
          })
        );

        console.log("GuestCompletePassword", newPassword, decryptedMnemonic);

        navigate("/guest/complete/passphrase");
      } catch (err) {
        console.log("Failed at GuestCompletePassword: ", err);
      }
    },
  });

  const handleBackClick = () => {
    navigate("/start");
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
                      <Stepper all={4} now={1} texts={[t("ncca-1_create-account"), "", "", ""]} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={"Create account"} text={"Remember to create a strong yet memorable password for top security."} />
                    </Grid>
                    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                      <Grid item xs={12} mt={"48px"}>
                        <InputText
                          id="non-custodial-new-password"
                          name="password"
                          label={"Create password"}
                          type="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.password && formik.errors.password ? true : false}
                        />
                      </Grid>
                      {/* <Grid item xs={12} mt={"16px"}>
                        <SecurityLevel password={formik.values.password} />
                      </Grid> */}
                      <Grid
                        item
                        xs={12}
                        sx={{
                          height: "20px",
                          padding: "0px 6px",
                        }}
                      >
                        {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red"}>{formik.errors.password}</Box>}
                      </Grid>
                      <Grid item xs={12} mt={"48px"}>
                        <InputText
                          id="non-custodial-repeat-password"
                          name="passwordMatch"
                          label={t("ncca-5_repeat-password")}
                          type="password"
                          value={formik.values.passwordMatch}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.passwordMatch && formik.errors.passwordMatch ? true : false}
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
                        {formik.touched.passwordMatch && formik.errors.passwordMatch && (
                          <Box className={"fs-16-regular red"}>{formik.errors.passwordMatch}</Box>
                        )}
                      </Grid>
                      <Grid item xs={12} mt={"24px"}>
                        <AccountNextButton
                          isSubmit={true}
                          text={t("ncl-6_next")}
                          disabled={formik.errors.password || formik.errors.passwordMatch ? true : false}
                        />
                      </Grid>
                    </form>
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
    </>
  );
};

export default GuestCompletePassword;
