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

const CustodialReset1ResetLink = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
                height: "1008px"
              }}
            >
              <Grid container justifyContent={"center"} pt={"56px"}>
                <Grid
                  item
                  container
                  sx={{
                    width: "520px"
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
                    <AccountHeader title={t("cca-46_reset-password")} />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountIconBar
                      icon={email}
                      text={t("cca-48_check-your-box")}
                      line={2}
                      secondaryText={t("cca-17_check-your-6")}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"32px"}>
                    <AccountIconBar
                      icon={link}
                      text={t("cca-50_if-dont-receive")}
                      line={2}
                      secondaryText={t("cca-51_contact-our-support")}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountNextButton
                      text={t("cca-52_back-to-login")}
                      onClick={() => {
                        navigate("/custodial/reset/2");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} mt={"357px"}>
                    <HaveAccount />
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
                padding: "32px"
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default CustodialReset1ResetLink;
