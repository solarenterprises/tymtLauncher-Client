import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import backIcon from "../../assets/settings/back-icon.svg";

import ChainBox from "../../components/ChainBox";
import { useCallback } from "react";
import { propsType } from "../../types/settingTypes";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { setChainAsync } from "../../features/wallet/ChainSlice";
import { AppDispatch } from "../../store";
import { setTransasctions } from "../../features/wallet/CryptoSlice";

const Chain = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const wallets = useSelector(getMultiWallet);
  const dispatch = useDispatch<AppDispatch>();

  const selectChain = useCallback((data: any) => {
    dispatch(setTransasctions());
    const updateData = { ...data, currentToken: "chain" };
    dispatch(setChainAsync(updateData));
  }, []);

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
            {Object.keys(wallets).map((rowKey, index) => (
              <ChainBox data={wallets[rowKey]} key={index} onClick={selectChain} />
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Chain;
