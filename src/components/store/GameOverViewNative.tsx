import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";

export interface IPropsGameOverViewNative {
  game: IGame;
}

const GameOverViewNative = ({ game }: IPropsGameOverViewNative) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  return (
    game?.projectMeta?.type && (
      <Box className={classes.box_gameoption}>
        <Box className={"fs-14-regular gray"}>{t("sto-39_type")}</Box>
        <Box className={"fs-14-regular white"}>{game?.projectMeta?.type}</Box>
      </Box>
    )
  );
};

export default GameOverViewNative;
