import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import createKeccakHash from "keccak";

import { getCustodial, setCustodial } from "../../../features/account/CustodialSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import SecurityLevel from "../../../components/account/SecurityLevel";
import DontHaveAccount from "../../../components/account/DontHaveAccount";

import tymt4 from "../../../assets/account/tymt4.png";

import "../../../global.css";

import { custodialType } from "../../../types/accountTypes";

const CustodialReset3 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const custodialStore: custodialType = useSelector(getCustodial);

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
        setCustodial({
          ...custodialStore,
          password: createKeccakHash("keccak256").update(formik.values.password).digest("hex"),
        })
      );
      navigate("/custodial/login/1");
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
                    <Stepper all={2} now={1} texts={[t("cca-35_email-password"), ""]} />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader title={t("cca-53_create-new-password")} text={t("cca-54_enter-password-below")} />
                  </Grid>
                  <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="custodial-reset-new-password"
                        label={t("set-75_your-new-password")}
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? true : false}
                      />
                    </Grid>
                    <Grid item xs={12} mt={"8px"}>
                      <SecurityLevel password={formik.values.password} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <InputText
                        id="custodial-reset-repeat-password"
                        label={t("set-77_confirm-your-password")}
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
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        text={t("cca-41_next")}
                        isSubmit={true}
                        disabled={formik.errors.password || formik.errors.passwordMatch ? true : false}
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
              src={tymt4}
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

export default CustodialReset3;
