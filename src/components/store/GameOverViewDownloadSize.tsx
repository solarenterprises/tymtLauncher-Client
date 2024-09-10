import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { getDownloadSizeNewGame } from "../../lib/helper/DownloadHelper";

import storeStyles from "../../styles/StoreStyles";

import { IGame } from "../../types/GameTypes";
import numeral from "numeral";

export interface IPropsGameOverViewDownloadSize {
  game: IGame;
}

const GameOverViewDownloadSize = ({ game }: IPropsGameOverViewDownloadSize) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  const [downloadSize, setDownloadSize] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      const newDownloadSize = parseFloat(await getDownloadSizeNewGame(game));
      setDownloadSize(newDownloadSize / 1024 / 1024);
    };

    init();
  }, [game]);

  return (
    downloadSize > 0 && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-49_download-size")}</Box>
        <Box className={"fs-14-regular white"}>{numeral(downloadSize).format("0,0.[00]")} MB</Box>
      </Box>
    )
  );
};

export default GameOverViewDownloadSize;
