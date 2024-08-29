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

import tymt3 from "../../../assets/account/tymt3.png";

const CustodialSignUp3 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      nickname: "",
    },
    validationSchema: Yup.object({
      nickname: Yup.string().required(t("cca-63_required")),
    }),
    onSubmit: () => {
      navigate("/confirm-information");
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
                    <Stepper all={3} now={3} texts={["", "", t("cca-24_create-nickname")]} />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader title={t("cca-25_your-nickname")} text={t("cca-26_nickname-display-all")} />
                  </Grid>
                  <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <Grid item xs={12} mt={"48px"}>
                      <InputText
                        id="custodial-new-nickname"
                        label={t("ncca-42_choose-nickname")}
                        type="text"
                        name="nickname"
                        value={formik.values.nickname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nickname && formik.errors.nickname ? true : false}
                      />
                    </Grid>
                    <Grid item xs={12} mt={"8px"} padding={"0px 6px"}>
                      {formik.touched.nickname && formik.errors.nickname ? (
                        <Box className={"fs-16-regular red"}>{formik.errors.nickname}</Box>
                      ) : (
                        <Box className={"fs-16-regular light"}>{t("ncca-43_you-use-letters")}</Box>
                      )}
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton text={t("cca-29_verify-and-complete")} isSubmit={true} disabled={formik.errors.nickname ? true : false} />
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

export default CustodialSignUp3;
