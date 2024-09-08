import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Stack, Box, Button } from "@mui/material";

import { AppDispatch } from "../store";
import { getWalletSetting, setWalletSetting } from "../features/settings/WalletSettingSlice";
import { getCurrentChain } from "../features/wallet/CurrentChainSlice";

import SettingStyle from "../styles/SettingStyle";

import { IWalletSetting } from "../types/settingTypes";
import { ICurrentChain, ISupportChain } from "../types/walletTypes";
import { useMemo } from "react";
import { getSupportChainByName } from "../lib/helper/WalletHelper";

const FeeSwitchButton = () => {
  const { t } = useTranslation();
  const classname = SettingStyle();
  const dispatch = useDispatch<AppDispatch>();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const currentSupportChain: ISupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"6px"} className={classname.fee_switch_container}>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (currentSupportChain?.chain?.symbol === "BTC") {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "minimum",
                fee: "7.5",
              })
            );
          } else {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "minimum",
                fee: "0.0183",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletSettingStore?.status === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.status === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.status === "minimum" ? "#52E1F2" : "white" }}>
          {t("set-58_minimum")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (currentSupportChain?.chain?.symbol === "BTC") {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "average",
                fee: "10",
              })
            );
          } else {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "average",
                fee: "0.0223",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletSettingStore?.status === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.status === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.status === "average" ? "#52E1F2" : "white" }}>
          {t("set-59_average")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (currentSupportChain?.chain?.symbol === "BTC") {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "maximum",
                fee: "20",
              })
            );
          } else {
            dispatch(
              setWalletSetting({
                ...walletSettingStore,
                status: "maximum",
                fee: "0.5",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletSettingStore?.status === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletSettingStore?.status === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletSettingStore?.status === "maximum" ? "#52E1F2" : "white" }}>
          {t("set-60_maximum")}
        </Box>
      </Button>
    </Stack>
  );
};

export default FeeSwitchButton;
