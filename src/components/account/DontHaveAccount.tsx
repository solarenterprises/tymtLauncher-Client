import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Stack } from "@mui/material";

import { getAccount, setAccount } from "../../features/account/AccountSlice";

import { accountType, loginEnum, walletEnum } from "../../types/accountTypes";

const DontHaveAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountStore: accountType = useSelector(getAccount);
  return (
    <Stack
      direction="row"
      width={"100%"}
      spacing={"16px"}
      className={"center-align"}
    >
      <Box className={"fs-16-regular white t-center"}>
        {t("ncl-9_dont-have-account")}
      </Box>
      <Box
        onClick={() => {
          dispatch(setAccount({ ...accountStore, mode: loginEnum.signup }));
          if (accountStore.wallet === walletEnum.custodial)
            navigate("/custodial/signup/1");
          else navigate("/non-custodial/signup/1");
        }}
        sx={{
          cursor: "pointer"
        }}
      >
        <Box className={"fs-18-regular blue t-center"}>
          {t("ncl-10_sign-up")}
        </Box>
      </Box>
    </Stack>
  );
};

export default DontHaveAccount;
