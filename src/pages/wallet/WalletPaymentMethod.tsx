import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid, Box, Stack, Button } from "@mui/material";

import PaymentButton from "../../components/wallet/PaymentButton";
import ConnectModal from "../../components/wallet/ConnectModal";

import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";

import cardIcon from "../../assets/wallet/card.svg";
import biboxIcon from "../../assets/wallet/bibox.svg";
import binanceIcon from "../../assets/wallet/binance.svg";
import bitayIcon from "../../assets/wallet/bitay.svg";
import bitgetIcon from "../../assets/wallet/bitget.svg";

import { getSupportChainByName } from "../../lib/helper/WalletHelper";

import { ICurrentChain, ISupportChain } from "../../types/walletTypes";

const WalletPaymentMethod = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const currentSupportChain: ISupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);

  const [icon, setIcon] = useState<any>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleConnect = useCallback(
    (icon: any, title: string) => {
      setIcon(icon);
      setTitle(title);
      setOpen(true);
    },
    [title, open, setTitle, setOpen, icon, setIcon]
  );

  return (
    <>
      <Grid container>
        <Grid item xs={12} container justifyContent="center">
          <Box className={"wallet-form-card br-16"} padding="32px 56px" width="592px">
            <Box className="fs-h2 white" mb={"40px"}>
              {t("wal-35_choose-payment-method")}
            </Box>
            <Stack spacing={"16px"} mb="40px">
              <PaymentButton
                src={cardIcon}
                text={t("wal-36_payment-card")}
                onClick={() => {
                  navigate("/wallet/payment-card");
                }}
              />
              <PaymentButton
                src={biboxIcon}
                text={"Bibox"}
                onClick={() => {
                  handleConnect(biboxIcon, "Bibox");
                }}
              />
              <PaymentButton
                src={binanceIcon}
                text={"Binance"}
                onClick={() => {
                  handleConnect(binanceIcon, "Binance");
                }}
              />
              <PaymentButton
                src={bitayIcon}
                text={"Bitay"}
                onClick={() => {
                  handleConnect(bitayIcon, "Bitay");
                }}
              />
              <PaymentButton
                src={bitgetIcon}
                text={"Bitget"}
                onClick={() => {
                  handleConnect(biboxIcon, "Bitget");
                }}
              />
            </Stack>
            <Button className="red-button fw">{t("ncca-7_next")}</Button>
          </Box>
        </Grid>
      </Grid>
      <ConnectModal coin={currentSupportChain?.chain?.logo} src={icon} open={open} setOpen={setOpen} title={title} />
    </>
  );
};

export default WalletPaymentMethod;
