import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";

import tymt4 from "../../../assets/account/tymt4.png";
import email from "../../../assets/account/email.svg";
import link from "../../../assets/account/link.svg";

import "../../../global.css";
import AccountIconBar from "../../../components/account/AccountIconBar";

const CustodialSignUp1VerifyEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                    <AccountHeader title={t("cca-15_verify-your-email")} />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountIconBar icon={email} text={t("cca-16_verify-your-email")} line={2} secondaryText={t("cca-17_check-your-6")} />
                  </Grid>
                  <Grid item xs={12} mt={"32px"}>
                    <AccountIconBar icon={link} text={t("cca-18_welcome-aboard")} line={2} secondaryText={t("cca-19_click-verification-link")} />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountNextButton
                      text={t("cca-20_next")}
                      onClick={() => {
                        navigate("/custodial/signup/2");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"50px"}>
                    <HaveAccount />
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

export default CustodialSignUp1VerifyEmail;
