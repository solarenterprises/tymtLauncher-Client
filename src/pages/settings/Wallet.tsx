import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import SwitchComp from "../../components/SwitchComp";

import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";

import { IWalletSetting, propsType } from "../../types/settingTypes";
import { ICurrentCurrency } from "../../types/walletTypes";

const Wallet = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);

  const updateWallet = useCallback(() => {
    dispatch(
      setWalletSetting({
        ...walletSettingStore,
        hidde: !walletSettingStore?.hidde,
      })
    );
  }, [walletSettingStore]);

  return (
    <>
      {view === "wallet" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-28_wallet-settings")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"} gap={1}>
                <Box className="fs-h5 white">{t("set-29_hide-0-balance")}</Box>
                <Box className="fs-14-regular gray">{t("set-29_hide-0-balance")}</Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1}>
                <SwitchComp
                  checked={walletSettingStore?.hidde}
                  onClick={() => {
                    updateWallet();
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("currency");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white center-align">{t("set-30_currency-in-wallet")}</Box>
                  <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"right"} gap={"5px"}>
                    <Box className="fs-16-regular gray center-align">{currentCurrencyStore?.currency}</Box>
                    <Box className="center-align">
                      <img src={arrowImg} />
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"}>
                  <Box className="fs-14-regular gray">{t("set-33_choose-currency-balance")}</Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("fee")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-31_fees")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" sx={{ padding: "20px" }} onClick={() => setView("address")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-32_address-book")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Wallet;
