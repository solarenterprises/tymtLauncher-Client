import { useTranslation } from "react-i18next";

import { Box, Stack } from "@mui/material";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewDescription {
  game: IGame;
}

const GameOverViewDescription = ({ game }: IPropsGameOverViewDescription) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Box className={"fs-40-bold white"}>{t("ga-10_overview")}</Box>
      <Box
        className={"fs-16-regular white"}
        sx={{
          marginTop: "16px",
          textOverflow: "ellipsis",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
          whiteSpace: "pre-line",
        }}
      >
        {game?.projectMeta?.description}
      </Box>
    </Stack>
  );
};

export default GameOverViewDescription;
