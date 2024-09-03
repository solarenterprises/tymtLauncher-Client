import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Link, Box, Grid } from "@mui/material";

const ForgotYourPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Grid container justifyContent={"flex-end"}>
      <Link href="#" underline="none">
        <Box
          onClick={() => {
            navigate("/non-custodial/reset/1");
          }}
        >
          <Box
            className={"fs-14-regular blue t-right"}
            sx={{
              width: "100%",
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
