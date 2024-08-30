import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";

import { platformEnum, platformIconMap } from "../../types/GameTypes";
import { IGame } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";
import { getSupportOSList } from "../../lib/helper/DownloadHelper";

export interface IPropsGameOverViewPlatform {
  game: IGame;
}

const GameOverViewPlatform = ({ game }: IPropsGameOverViewPlatform) => {
  const classes = storeStyles();
  const { t } = useTranslation();

  const supportOSList = useMemo(() => getSupportOSList(game), [game]);

  return (
    <Box className={classes.box_gameoption}>
      <Box className={"fs-14-regular gray"}>{t("sto-4_platform")}</Box>
      <Stack direction={"row"} alignItems={"center"}>
        {supportOSList?.some((one) => one === "windows") && <img src={platformIconMap.get(platformEnum.windows)} width={"16px"} className={classes.platform} />}
        {supportOSList?.some((one) => one === "linux") && <img src={platformIconMap.get(platformEnum.linux)} width={"16px"} className={classes.platform} />}
        {supportOSList?.some((one) => one === "darwin") && <img src={platformIconMap.get(platformEnum.mac)} width={"16px"} className={classes.platform} />}
      </Stack>
    </Box>
  );
};

export default GameOverViewPlatform;
