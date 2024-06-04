import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { getTempNonCustodial, setTempNonCustodial } from "../../../features/account/TempNonCustodialSlice";
import { getAccount } from "../../../features/account/AccountSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";
import SecurityLevel from "../../../components/account/SecurityLevel";
import IAgreeTerms from "../../../components/account/IAgreeTerms";

import tymt3 from "../../../assets/account/tymt3.png";

import "../../../global.css";
import { accountType, nonCustodialType } from "../../../types/accountTypes";

const NonCustodialImport1 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);
  const accountStore: accountType = useSelector(getAccount);

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
            const checks = [/[a-z]/.test(value), /[A-Z]/.test(value), /\d/.test(value), /[\W_]/.test(value), value.length >= 8];
            const passedConditions = checks.filter(Boolean).length;
            return passedConditions >= 4;
          }
        )
        .required(t("cca-63_required")),
      passwordMatch: Yup.string()
        .required(t("cca-63_required"))
        .oneOf([Yup.ref("password")], t("cca-64_password-must-match")),
    }),
    onSubmit: () => {
      dispatch(
        setTempNonCustodial({
          ...tempNonCustodialStore,
          password: formik.values.password,
        })
      );
      navigate("/non-custodial/import/2");
    },
  });

  const handleBackClick = () => {
    navigate("/start");
  };

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
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
                    <AccountHeader title={t("ncca-1_create-account")} text={t("ncca-2_remember-strong-password")} />
                  </Grid>
                  <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="non-custodial-new-password"
                        name="password"
                        label={t("ncca-3_password")}
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? true : false}
                      />
                    </Grid>
                    <Grid item xs={12} mt={"16px"}>
                      <SecurityLevel password={formik.values.password} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
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
                      {formik.touched.passwordMatch && formik.errors.passwordMatch && <Box className={"fs-16-regular red"}>{formik.errors.passwordMatch}</Box>}
                    </Grid>
                    <Grid item xs={12} mt={"20px"}>
                      <IAgreeTerms />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        isSubmit={true}
                        text={t("ncl-6_next")}
                        disabled={formik.errors.password || formik.errors.passwordMatch || !accountStore.agreedTerms ? true : false}
                      />
                    </Grid>
                  </form>
                  <Grid item xs={12} mt={"50px"}>
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
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialImport1;
