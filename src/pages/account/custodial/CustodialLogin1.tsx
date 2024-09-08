import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import createKeccakHash from "keccak";
import { useFormik } from "formik";
import * as Yup from "yup";

import "../../../global.css";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import ForgotYourPassword from "../../../components/account/ForgotYourPassword";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";
import BenefitModal from "../../../components/account/BenefitModal";

import { Grid, Box, Stack } from "@mui/material";

import tymt7 from "../../../assets/account/tymt2.png";

const CustodialLogIn1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("cca-62_invalid-email-address"))
        .required(t("cca-63_required"))
        .test("equals", t("cca-59_wrong-email"), (value) => value === "custodialStore.email"),
      password: Yup.string()
        .required(t("cca-63_required"))
        .test("equals", t("cca-60_wrong-password"), (value) => createKeccakHash("keccak256").update(value).digest("hex") === "custodialStore.password"),
    }),
    onSubmit: () => {
      setPath("/custodial/login/2");
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
                    <Stepper all={2} now={1} text={t("cca-35_email-password")} />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader title={t("cca-36_login-with-email")} text={t("cca-37_use-email-password")} />
                  </Grid>
                  <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="custodial-login-email"
                        label={t("cca-38_your-email")}
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
                        id="custodial-login-password"
                        label={t("cca-39_your-password")}
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password ? true : false}
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
                      {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red"}>{formik.errors.password}</Box>}
                    </Grid>
                    <Grid item xs={12} mt={"12px"}>
                      <ForgotYourPassword />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton text={t("cca-41_next")} isSubmit={true} disabled={formik.errors.email || formik.errors.password ? true : false} />
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
              src={tymt7}
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

export default CustodialLogIn1;
