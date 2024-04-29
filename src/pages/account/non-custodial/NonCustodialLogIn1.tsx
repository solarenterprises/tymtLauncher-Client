import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import createKeccakHash from "keccak";

import { getAccount, setAccount } from "../../../features/account/AccountSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import OrLine from "../../../components/account/OrLine";
import AccountButton from "../../../components/account/AccountButton";
import ForgotYourPassword from "../../../components/account/ForgotYourPassword";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";

import tymt2 from "../../../assets/account/tymt2.png";
import wallet from "../../../assets/account/wallet.png";

import "../../../global.css";
import {
  accountType,
  loginEnum,
  nonCustodialType,
} from "../../../types/accountTypes";
import { getNonCustodial } from "../../../features/account/NonCustodialSlice";

const NonCustodialLogIn1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountStore: accountType = useSelector(getAccount);
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("cca-63_required"))
        .test(
          "equals",
          "Wrong Password",
          (value) =>
            createKeccakHash("keccak256").update(value).digest("hex") ===
            nonCustodialStore.password
        ),
    }),
    onSubmit: () => {
      navigate("/confirm-information");
    },
  });

  const handleBackClick = () => {
    navigate("/start");
  };

  useEffect(() => {
    dispatch(setAccount({ ...accountStore, mode: loginEnum.login }));
  }, []);

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"64px"}
          >
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
                    <Stepper
                      all={2}
                      now={1}
                      texts={[t("ncl-1_password"), "Try"]}
                    />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader
                      title={t("ncl-2_welcome-back")}
                      text={t("ncl-3_decentralised-non-custodial")}
                    />
                  </Grid>
                  <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: "100%" }}
                  >
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="non-custodial-login"
                        label={t("ncl-4_your-password")}
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.password && formik.errors.password
                            ? true
                            : false
                        }
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
                      {formik.touched.password && formik.errors.password && (
                        <Box className={"fs-16-regular red"}>
                          {formik.errors.password}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} mt={"12px"}>
                      <ForgotYourPassword />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton
                        text={t("ncl-6_next")}
                        isSubmit={true}
                        disabled={formik.errors.password ? true : false}
                      />
                    </Grid>
                  </form>
                  <Grid item xs={12} mt={"48px"}>
                    <OrLine />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountButton
                      src={wallet}
                      text={t("ncl-8_import-wallet")}
                      onClick={() => navigate("/non-custodial/login/2")}
                    />
                  </Grid>
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
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialLogIn1;
