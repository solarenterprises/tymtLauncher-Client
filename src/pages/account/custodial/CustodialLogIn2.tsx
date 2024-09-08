import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Grid, Box, Stack } from "@mui/material";
import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import DontHaveAccount from "../../../components/account/DontHaveAccount";
import OtpInput from "../../../components/account/OtpInput";
import tymt4 from "../../../assets/account/tymt4.png";
import "../../../global.css";

const CustodialLogin2 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState<boolean>(false);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleSetValue = (_value: string) => {
    setError(false);
    setValue(_value);
  };

  const handleNextClick = () => {
    if (value === "123456") {
      navigate("/home");
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (value.length === 6) {
      const timer = setTimeout(() => {
        handleNextClick();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [value, handleNextClick]);

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
                    <Stepper all={2} now={2} text={t("cca-56_google-2fa")} />
                  </Grid>
                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader title={t("cca-42_google-2fa")} text={t("cca-43_code-sent-google")} />
                  </Grid>
                  <Grid item xs={12} mb={"30px"}>
                    <OtpInput value={value} setValue={handleSetValue} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      height: "20px",
                      padding: "0px 6px",
                    }}
                  >
                    {error && <Box className={"fs-16-regular red"}>{t("cca-58_wrong-code")}</Box>}
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountNextButton text={t("cca-41_next")} onClick={handleNextClick} />
                  </Grid>
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

export default CustodialLogin2;
