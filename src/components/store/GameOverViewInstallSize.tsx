import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { getInstallSizeNewGame } from "../../lib/helper/DownloadHelper";

import storeStyles from "../../styles/StoreStyles";

import { IGame } from "../../types/GameTypes";
import numeral from "numeral";

export interface IPropsGameOverViewInstallSize {
  game: IGame;
}

const GameOverViewInstallSize = ({ game }: IPropsGameOverViewInstallSize) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  const [installSize, setInstallSize] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const newInstallSize = parseFloat(await getInstallSizeNewGame(game));
      setInstallSize(newInstallSize / 1024 / 1024);
    };

    init();
  }, [game]);

  return (
    installSize > 0 && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-50_install-size")}</Box>
        <Box className={"fs-14-regular white"}>{numeral(installSize).format("0,0.[00]")} MB</Box>
      </Box>
    )
  );
};

export default GameOverViewInstallSize;
