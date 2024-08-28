import { useCallback } from "react";
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
import { setAccount } from "../../../features/account/AccountSlice";
import { addAccountList } from "../../../features/account/AccountListSlice";
import { getWallet, setWallet } from "../../../features/wallet/WalletSlice";
import { addWalletList } from "../../../features/wallet/WalletListSlice";
import { getSaltToken, setSaltToken } from "../../../features/account/SaltTokenSlice";
import { getMachineId } from "../../../features/account/MachineIdSlice";
import { fetchMyInfoAsync } from "../../../features/account/MyInfoSlice";
import { setLogin } from "../../../features/account/LoginSlice";

import AuthAPI from "../../../lib/api/AuthAPI";

import { getNonCustodySignInToken, getReqBodyNonCustodyBeforeSignIn, getReqBodyNonCustodySignIn } from "../../../lib/helper/AuthAPIHelper";
import { encrypt, getKeccak256Hash } from "../../../lib/api/Encrypt";

import tymt3 from "../../../assets/account/tymt3.png";

import { IAccount, IMachineId, ISaltToken } from "../../../types/accountTypes";
import { IWallet } from "../../../types/walletTypes";

const NonCustodialImport1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const tempAccountStore: IAccount = useSelector(getTempAccount);
  const tempWalletStore: IWallet = useSelector(getWallet);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);

  const handleImport = useCallback(
    async (newNickName: string, newPassword: string) => {
      try {
        const newAccount: IAccount = {
          ...tempAccountStore,
          password: getKeccak256Hash(newPassword),
          mnemonic: await encrypt(tempAccountStore?.mnemonic, newPassword),
          nickName: newNickName,
        };

        dispatch(setAccount(newAccount));
        dispatch(addAccountList(newAccount));
        dispatch(setWallet(tempWalletStore));
        dispatch(addWalletList(tempWalletStore));
      } catch (err) {
        console.log("Failed to handleSignUp: ", err);
      }
    },
    [tempAccountStore, tempWalletStore]
  );

  const handleLogin = useCallback(async () => {
    try {
      const body1 = getReqBodyNonCustodyBeforeSignIn(tempAccountStore, tempAccountStore?.mnemonic);
      const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);

      const salt: string = res1?.data?.salt;
      const token: string = getNonCustodySignInToken(salt, saltTokenStore, tempAccountStore?.mnemonic);
      dispatch(
        setSaltToken({
          salt: salt,
          token: token,
        })
      );

      const body2 = getReqBodyNonCustodySignIn(tempAccountStore, machineIdStore, token);
      const res2 = await AuthAPI.nonCustodySignin(body2);
      const uid = res2?.data?._id;

      await dispatch(fetchMyInfoAsync(uid));

      dispatch(setLogin(true));
      navigate("/home");
    } catch (err) {
      console.log("Failed to handleLogin: ", err);
    }
  }, [tempAccountStore, saltTokenStore]);

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
        dispatch(
          setTempAccount({
            ...tempAccountStore,
            password: newPassword,
          })
        );

        const newSXPAddress = tempAccountStore?.sxpAddress;
        const res = await AuthAPI.getUserBySolarAddress(newSXPAddress);

        if (res?.data?.users?.length === 0) {
          navigate("/non-custodial/signup/4");
        } else {
          const newNickName: string = res?.data?.users[0]?.nickName;
          await handleImport(newNickName, newPassword);
          await handleLogin();
        }
      } catch (err) {
        console.log("Failed at NonCustodialImport1: ", err);
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
                      <AccountHeader title={"Hello again!"} text={"Please type your mnemonic phrase exactly as it was shown to ensure it's correct."} />
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

export default NonCustodialImport1;
