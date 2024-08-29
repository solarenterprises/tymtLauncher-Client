import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

import "../../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";
import SecurityLevel from "../../../components/account/SecurityLevel";
import BenefitModal from "../../../components/account/BenefitModal";

import tymt3 from "../../../assets/account/tymt3.png";

const CustodialSignUp1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordMatch: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email(t("cca-62_invalid-email-address")).required(t("cca-63_required")),
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
    onSubmit: () => {
      setPath("/custodial/signup/1/verify-email");
      setOpen(true);
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
                    <Stepper all={3} now={1} texts={[t("ncca-1_create-account"), "", ""]} />
                  </Grid>
                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader title={t("ncca-1_create-account")} text={t("cca-1_not-feel-ready")} />
                  </Grid>
                  <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="custodial-new-email"
                        label={t("cca-2_your-email")}
                        type="text"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email ? true : false}
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
                      {formik.touched.email && formik.errors.email && <Box className={"fs-16-regular red"}>{formik.errors.email}</Box>}
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <InputText
                        id="custodial-new-password"
                        label={t("cca-3_password")}
                        type="password"
                        name="password"
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
                        id="custodial-repeat-password"
                        label={t("ncca-5_repeat-password")}
                        type="password"
                        name="passwordMatch"
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
                    <Grid item xs={12} mt={"40px"}>
                      {/* <IAgreeTerms /> */}
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        isSubmit={true}
                        disabled={formik.errors.email || formik.errors.password || formik.errors.passwordMatch ? true : false}
                        text={t("ncca-1_create-account")}
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
      <BenefitModal open={open} setOpen={setOpen} path={path} />
    </>
  );
};

export default CustodialSignUp1;
