import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCustodial } from "../../../features/account/CustodialSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";

import tymt4 from "../../../assets/account/tymt4.png";

import "../../../global.css";
import { custodialType } from "../../../types/accountTypes";

const CustodialReset1 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const custodialStore: custodialType = useSelector(getCustodial);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("cca-62_invalid-email-address"))
        .required(t("cca-63_required"))
        .test(
          "equals",
          "Wrong email",
          (value) => value === custodialStore.email
        ),
    }),
    onSubmit: () => {
      navigate("/custodial/reset/1/reset-link");
    },
  });

  const handleBackClick = () => {
    navigate("/start");
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
                      now={1}
                      texts={[t("cca-46_reset-password"), ""]}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader
                      title={t("cca-46_reset-password")}
                      text={t("cca-47_enter-your-email")}
                    />
                  </Grid>
                  <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: "100%" }}
                  >
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="custodial-login-email"
                        label={t("cca-38_your-email")}
                        type="text"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && formik.errors.email
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
                      {formik.touched.email && formik.errors.email && (
                        <Box className={"fs-16-regular red"}>
                          {formik.errors.email}
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        text={t("cca-41_next")}
                        isSubmit={true}
                        disabled={formik.errors.email ? true : false}
                      />
                    </Grid>
                  </form>

                  <Grid item xs={12} mt={"467px"}>
                    <DontHaveAccount />
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
            <Box
              component={"img"}
              src={tymt4}
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

export default CustodialReset1;
