import { useTranslation } from "react-i18next";
import SettingStyle from "../styles/SettingStyle";
import { Stack, Box, Button } from "@mui/material";
import { walletType } from "../types/settingTypes";
import { useDispatch, useSelector } from "react-redux";
import { selectWallet, setWallet } from "../features/settings/WalletSlice";
import { AppDispatch } from "../store";
import { getChain } from "../features/wallet/ChainSlice";
import { IChain } from "../types/walletTypes";

const FeeSwitchButton = () => {
  const { t } = useTranslation();
  const classname = SettingStyle();
  const dispatch = useDispatch<AppDispatch>();
  const walletStore: walletType = useSelector(selectWallet);
  const chainStore: IChain = useSelector(getChain);

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"6px"} className={classname.fee_switch_container}>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (chainStore.chain.symbol === "BTC") {
            dispatch(
              setWallet({
                ...walletStore,
                status: "minimum",
                fee: "7.5",
              })
            );
          } else {
            dispatch(
              setWallet({
                ...walletStore,
                status: "minimum",
                fee: "0.0183",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletStore.status === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletStore.status === "minimum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletStore.status === "minimum" ? "#52E1F2" : "white" }}>
          {t("set-58_minimum")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (chainStore.chain.symbol === "BTC") {
            dispatch(
              setWallet({
                ...walletStore,
                status: "average",
                fee: "10",
              })
            );
          } else {
            dispatch(
              setWallet({
                ...walletStore,
                status: "average",
                fee: "0.0223",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletStore.status === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletStore.status === "average" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletStore.status === "average" ? "#52E1F2" : "white" }}>
          {t("set-59_average")}
        </Box>
      </Button>
      <Button
        className={classname.fee_switch_button}
        onClick={() => {
          if (chainStore.chain.symbol === "BTC") {
            dispatch(
              setWallet({
                ...walletStore,
                status: "maximum",
                fee: "20",
              })
            );
          } else {
            dispatch(
              setWallet({
                ...walletStore,
                status: "maximum",
                fee: "0.5",
              })
            );
          }
        }}
        sx={{
          backgroundColor: walletStore.status === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: walletStore.status === "maximum" ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classname.switch_button} sx={{ color: walletStore.status === "maximum" ? "#52E1F2" : "white" }}>
          {t("set-60_maximum")}
        </Box>
      </Button>
    </Stack>
  );
};

export default FeeSwitchButton;
