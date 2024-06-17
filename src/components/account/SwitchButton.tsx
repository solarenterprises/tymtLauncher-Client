import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Box, Stack, Button, Grid } from "@mui/material";
import { getAccount, setAccount } from "../../features/account/AccountSlice";
import { loginEnum, accountType } from "../../types/accountTypes";

const SwitchButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountStore: accountType = useSelector(getAccount);

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
            className={accountStore.mode === loginEnum.signup ? "switch-button-checked" : "switch-button"}
            onClick={() => {
              dispatch(setAccount({ ...accountStore, mode: loginEnum.signup }));
            }}
          >
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: accountStore.mode === loginEnum.signup ? "#52E1F2" : "white",
                fontFeatureSettings: "'calt' off",
              }}
            >
              {t("wc-10_sign-up")}
            </Box>
          </Button>
          <Button
            className={accountStore.mode === loginEnum.login ? "switch-button-checked" : "switch-button"}
            onClick={() => {
              dispatch(setAccount({ ...accountStore, mode: loginEnum.login }));
            }}
          >
            <Box
              className={"fs-18-regular"}
              sx={{
                padding: "8px 16px",
                color: accountStore.mode === loginEnum.login ? "#52E1F2" : "white",
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
