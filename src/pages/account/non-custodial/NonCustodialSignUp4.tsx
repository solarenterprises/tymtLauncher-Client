import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

import tymt3 from "../../../assets/account/tymt3.png";
import { IAccount } from "../../../types/accountTypes";
import { useDispatch, useSelector } from "react-redux";
import { getTempAccount, setTempAccount } from "../../../features/account/TempAccountSlice";

const NonCustodialSignUp4 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const formik = useFormik({
    initialValues: {
      nickname: "",
    },
    validationSchema: Yup.object({
      nickname: Yup.string()
        .required(t("cca-63_required"))
        .min(3, t("ncca-59_too-short"))
        .max(50, t("ncca-60_too-long"))
        .matches(/^[a-zA-Z0-9_ !@#$%^&*()\-+=,.?]+$/, t("ncca-61_invalid-characters")),
    }),
    onSubmit: async () => {
      const newNickName = formik.values.nickname;
      dispatch(
        setTempAccount({
          ...tempAccountStore,
          nickName: newNickName,
        })
      );
      navigate("/confirm-information/signup");
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
