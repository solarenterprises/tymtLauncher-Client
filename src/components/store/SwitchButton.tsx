import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Box, Stack, Button, Grid } from "@mui/material";
import { getViewmode, setViewmode } from "../../features/store/Gameview";
import { viewType } from "../../types/storeTypes";

const SwitchBtnGameview = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const viewmode: viewType = useSelector(getViewmode);

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
          <Button
            className={viewmode.mode === "overview" ? "switch-button-checked" : "switch-button"}
            onClick={() => {
              dispatch(setViewmode({ ...viewmode, mode: "overview" }));
            }}
          >
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: viewmode.mode === "overview" ? "#52E1F2" : "white",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {t("ga-10_overview")}
            </Box>
          </Button>
          <Button
            className={viewmode.mode === "review" ? "switch-button-checked" : "switch-button"}
            onClick={() => {
              dispatch(setViewmode({ ...viewmode, mode: "review" }));
            }}
          >
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: viewmode.mode === "review" ? "#52E1F2" : "white",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {t("ga-11_review")}
            </Box>
          </Button>
        </Stack>
      </Box>
    </Grid>
  );
};

export default SwitchBtnGameview;
