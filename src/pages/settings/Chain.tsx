import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { Chains } from "../../consts/Chains";

import ChainBox from "../../components/ChainBox";

import { AppDispatch } from "../../store";
import { setCurrentChain } from "../../features/wallet/CurrentChainSlice";

import { propsType } from "../../types/settingTypes";

import backIcon from "../../assets/settings/back-icon.svg";

const Chain = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleChainBoxClick = (chainName: string) => {
    dispatch(setCurrentChain(chainName));
  };

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
            {Chains?.map((one, index) => (
              <ChainBox data={one} key={index} onClick={() => handleChainBoxClick(one?.name)} />
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Chain;
