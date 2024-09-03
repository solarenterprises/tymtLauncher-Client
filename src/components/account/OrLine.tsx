import { Stack, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const OrLine = () => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        height: "18px",
      }}
    >
      <Box
        sx={{
          width: "220px",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
      <Box
        className={"fs-14-regular"}
        sx={{
          width: "80px",
          textAlign: "center",
          color: "#AFAFAF",
          fontFeatureSettings: "'calt' off",
        }}
      >
        {t("ncca-58_or")}
      </Box>
      <Box
        sx={{
          width: "220px",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
    </Stack>
  );
};

export default OrLine;
