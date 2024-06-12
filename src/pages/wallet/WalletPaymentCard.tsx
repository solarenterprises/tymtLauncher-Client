import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Stack } from "@mui/material";
import InputText from "../../components/account/InputText";

const WalletPaymentCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Grid container>
      <Grid item xs={12} container justifyContent={"center"}>
        <Box className={"wallet-form-card br-16"} padding={"32px 56px"}>
          <Box className="fs-h2 white" mb={"40px"}>
            {t("wal-36_payment-card")}
          </Box>
          <Box mb={"40px"}>
            <InputText id="card-number" type="text" label={t("wal-43_card-number")} />
          </Box>
          <Box mb={"40px"}>
            <InputText id="holder-name" type="text" label={t("wal-44_holder-name")} />
          </Box>
          <Stack direction="row" alignItems="center" spacing="24px" mb="40px">
            <InputText id="expiration-date" type="text" label={t("wal-45_expiration-date")} />
            <InputText id="cvv" type="text" label={t("wal-46_CVV")} />
          </Stack>
          <Button className="red-button fw" onClick={() => navigate("/wallet/buy-game")}>
            {t("wal-37_buy-sxp")}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default WalletPaymentCard;
