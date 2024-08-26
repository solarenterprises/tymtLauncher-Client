import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";

const HaveAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack direction="row" width={"100%"} spacing={"16px"} className={"center-align"}>
      <Box className={"fs-16-regular white t-center"}>{t("ncca-8_have-an-account")}</Box>
      <Box
        onClick={() => {
          navigate("/non-custodial/login/1");
        }}
        sx={{
          cursor: "pointer",
        }}
      >
        <Box className={"fs-18-regular blue t-center"}>{t("ncca-9_log-in")}</Box>
      </Box>
    </Stack>
  );
};

export default HaveAccount;
