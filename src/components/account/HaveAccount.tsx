import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Stack } from "@mui/material";

import { accountType, loginEnum, walletEnum } from "../../types/accountTypes";

import { getAccount, setAccount } from "../../features/account/AccountSlice";

const HaveAccount = () => {
  const { t } = useTranslation();
  const accountStore: accountType = useSelector(getAccount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Stack direction="row" width={"100%"} spacing={"16px"} className={"center-align"}>
      <Box className={"fs-16-regular white t-center"}>{t("ncca-8_have-an-account")}</Box>
      <Box
        onClick={() => {
          dispatch(setAccount({ ...accountStore, mode: loginEnum.login }));
          accountStore.wallet === walletEnum.noncustodial ? navigate("/non-custodial/login/1") : navigate("/custodial/login/1");
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
