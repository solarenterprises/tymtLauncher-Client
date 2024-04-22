import { useCallback } from "react";

import { Stack, Box, Button } from "@mui/material";

import CommonStyles from "../../styles/commonStyles";

import walletImg1 from "../../assets/wallet/wallet-card-1.svg";
import walletImg2 from "../../assets/wallet/wallet-card-2.svg";
import walletImg3 from "../../assets/wallet/wallet-card-3.svg";
import walletImg4 from "../../assets/wallet/wallet-card-4.svg";
import walletImg5 from "../../assets/wallet/wallet-card-5.svg";
import walletImg6 from "../../assets/wallet/wallet-card-6.svg";
import walletImg7 from "../../assets/wallet/wallet-card-7.svg";
import walletImg8 from "../../assets/wallet/wallet-card-8.svg";
import walletImg9 from "../../assets/wallet/wallet-card-9.svg";
import qrIcon from "../../assets/wallet/qr-icon.svg";

import { propsWalletCard } from "../../types/commonTypes";
import QrModal from "./QrModal";
import { useState } from "react";
import { formatBalance } from "../../lib/helper";
import { setChainAsync } from "../../features/wallet/ChainSlice";
import { setTransasctions } from "../../features/wallet/CryptoSlice";

import { IChain, ICurrency } from "../../types/walletTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { getCurrency } from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";

import { useNotification } from "../../providers/NotificationProvider";
import { useTranslation } from "react-i18next";

const backgrounds = [
  walletImg1,
  walletImg2,
  walletImg3,
  walletImg4,
  walletImg5,
  walletImg6,
  walletImg7,
  walletImg8,
  walletImg9,
];

const WalletCard = ({ data, index, setLoading }: propsWalletCard) => {
  const [open, setOpen] = useState(false);
  const background = backgrounds[index];
  const common = CommonStyles();
  const dispatch = useDispatch<AppDispatch>();
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const symbol: string = currencySymbols[currencyStore.current];
  const { t } = useTranslation();

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const selectChain = useCallback((data: IChain) => {
    const udpateData = { ...data, currentToken: "chain" };
    setLoading(true);
    dispatch(setTransasctions());
    dispatch(setChainAsync(udpateData)).then(() => {
      setNotificationOpen(true);
      setNotificationTitle(
        `${t("alt-11_switched-network")} ${data?.chain?.name}`
      );
      setNotificationDetail(
        `${t("alt-12_switched-network-intro")} ${data?.chain?.name}`
      );
      setNotificationStatus("success");
      setNotificationLink(null);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Button
        fullWidth
        sx={{
          textTransform: "none",
          borderRadius: "16px",
          padding: "20px",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${background})`,
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
        onClick={() => {
          selectChain(data);
        }}
      >
        <Stack
          direction={"row"}
          gap={3}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Stack direction={"row"} justifyContent={"flex-start"} gap={"16px"}>
            <Box
              component={"img"}
              src={data?.chain?.logo}
              width={"40px"}
              height={"40px"}
            />
            <Stack gap={1}>
              <Box className={"fs-h3 white t-left"}>{data?.chain?.name}</Box>
              <Box className={"fs-18-regular white"}>
                {data?.chain?.symbol}
                {` ${formatBalance(data?.chain?.balance, 4)}`}
              </Box>
              <Box className={"fs-16-regular light t-left"}>
                {`${symbol} ${formatBalance(
                  Number(data?.chain?.price ?? 0) *
                    Number(data?.chain?.balance ?? 0) *
                    reserve
                )}`}
              </Box>
            </Stack>
          </Stack>
          <Box
            className={`${common.center_align} qr-btn`}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <img src={qrIcon} />
          </Box>
        </Stack>
      </Button>
      <QrModal data={data} open={open} setOpen={setOpen} />
    </>
  );
};

export default WalletCard;
