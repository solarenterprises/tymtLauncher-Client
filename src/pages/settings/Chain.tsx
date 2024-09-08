import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { supportChains } from "../../consts/SupportTokens";

import { Box, Button, Divider, Stack } from "@mui/material";

import ChainBox from "../../components/ChainBox";

import { AppDispatch } from "../../store";
import { setCurrentChain } from "../../features/wallet/CurrentChainSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import backIcon from "../../assets/settings/back-icon.svg";

import { getCurrentChainWalletAddress } from "../../lib/helper/WalletHelper";

import { ISupportChain, IWallet } from "../../types/walletTypes";
import { propsType } from "../../types/settingTypes";
import { INotificationParams } from "../../types/NotificationTypes";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { emit } from "@tauri-apps/api/event";

const Chain = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const walletStore: IWallet = useSelector(getWallet);

  const handleChainBoxClick = (one: ISupportChain) => {
    dispatch(setCurrentChain(one?.chain?.name));
    const chainName = one?.chain?.name;

    const noti: INotificationParams = {
      status: "success",
      title: t("set-85_success"),
      message: `${t("alt-12_switched-network-intro")}: ${chainName}`,
      link: null,
      translate: false,
    };
    emit(TauriEventNames.NOTIFICATION, noti);
  };

  const copyAddress = useCallback(
    (one: ISupportChain) => {
      const chainName = one?.chain?.name;
      const address = getCurrentChainWalletAddress(walletStore, chainName);

      navigator.clipboard.writeText(address);

      const noti: INotificationParams = {
        status: "success",
        title: t("set-85_success"),
        message: t("set-96_chain_address_copied"),
        link: null,
        translate: false,
      };
      emit(TauriEventNames.NOTIFICATION, noti);
    },
    [walletStore]
  );

  return (
    <>
      {view === "chain" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("main")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-5_choose-chain")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack>
            {supportChains?.map((one, index) => (
              <ChainBox supportChain={one} key={index} onClick={() => copyAddress(one)} onDoubleClick={() => handleChainBoxClick(one)} />
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Chain;
