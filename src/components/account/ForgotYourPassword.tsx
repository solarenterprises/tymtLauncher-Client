import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Link, Box, Grid } from "@mui/material";

import { accountType, walletEnum } from "../../types/accountTypes";

import { getAccount } from "../../features/account/AccountSlice";

const ForgotYourPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const accountStore: accountType = useSelector(getAccount);
  return (
    <Grid container justifyContent={"flex-end"}>
      <Link href="#" underline="none">
        <Box
          onClick={() => {
            accountStore.wallet === walletEnum.custodial
              ? navigate("/custodial/reset/1")
              : navigate("/non-custodial/reset/1");
          }}
        >
          <Box
            className={"fs-14-regular blue t-right"}
            sx={{
              width: "100%"
            }}
          >
            {t("ncl-5_forgot-your-password")}
          </Box>
        </Box>
      </Link>
    </Grid>
  );
};

export default ForgotYourPassword;
