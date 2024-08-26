import { useTranslation } from "react-i18next";
import { Box, Stack, Button, Grid } from "@mui/material";

const SwitchButton = () => {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Box className={"switch-button-group"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            height: "40px",
          }}
          spacing={"6px"}
        >
          <Button className={"switch-button"} onClick={() => {}}>
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: "white",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {t("wc-10_sign-up")}
            </Box>
          </Button>
          <Button className={"switch-button"} onClick={() => {}}>
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: "white",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {t("wc-11_log-in")}
            </Box>
          </Button>
        </Stack>
      </Box>
    </Grid>
  );
};

export default SwitchButton;
