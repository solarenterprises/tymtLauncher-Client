import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";
import { useTranslation } from "react-i18next";

export interface IPropsGameOverViewReleaseName {
  game: IGame;
}

const GameOverViewReleaseName = ({ game }: IPropsGameOverViewReleaseName) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  return (
    game?.releaseMeta?.name && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-37_release_version")}</Box>
        <Box className={"fs-14-regular white"}>{game?.releaseMeta?.name}</Box>
      </Box>
    )
  );
};

export default GameOverViewReleaseName;
