import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "../../../store";
import { getTempNonCustodial, setTempNonCustodial } from "../../../features/account/TempNonCustodialSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid, Box, Stack } from "@mui/material";
import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import InputText from "../../../components/account/InputText";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";
import tymt3 from "../../../assets/account/tymt3.png";
import "../../../global.css";
import { nonCustodialType } from "../../../types/accountTypes";
import { motion } from "framer-motion";

const NonCustodialSignUp4 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);

  const formik = useFormik({
    initialValues: {
      nickname: "",
    },
    validationSchema: Yup.object({
      nickname: Yup.string().required(t("cca-63_required")),
    }),
    onSubmit: async () => {
      dispatch(
        setTempNonCustodial({
          ...tempNonCustodialStore,
          nickname: formik.values.nickname,
        })
      );
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
                      <Stepper all={4} now={4} texts={["", "", "", t("ncca-39_create-nickname")]} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-40_your-nickname")} text={t("ncca-41_nickname-will-displayed")} />
                    </Grid>
                    <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                      <Grid item xs={12} mt={"48px"}>
                        <InputText
                          id="non-custodial-new-nickname"
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
                        <AccountNextButton isSubmit={true} text={t("ncca-44_verify-and-complete")} disabled={formik.errors.nickname ? true : false} />
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
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialSignUp4;
