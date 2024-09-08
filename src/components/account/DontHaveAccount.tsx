import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Box, Stack } from "@mui/material";

const DontHaveAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack direction="row" width={"100%"} spacing={"16px"} className={"center-align"}>
      <Box className={"fs-16-regular white t-center"}>{t("ncl-9_dont-have-account")}</Box>
      <Box
        onClick={() => {
          navigate("/welcome");
        }}
        sx={{
          cursor: "pointer",
        }}
      >
        <Box className={"fs-18-regular blue t-center"}>{t("ncl-10_sign-up")}</Box>
      </Box>
    </Stack>
  );
};

export default DontHaveAccount;
