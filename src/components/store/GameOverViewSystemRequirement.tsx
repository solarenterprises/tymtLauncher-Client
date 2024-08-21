import { Box, Stack } from "@mui/material";

import { IGame } from "../../types/GameTypes";
import { useTranslation } from "react-i18next";

export interface IPropsGameOverViewSystemRequirement {
  game: IGame;
}

const GameOverViewSystemRequirement = ({ game }: IPropsGameOverViewSystemRequirement) => {
  const { t } = useTranslation();

  return (
    game?.projectMeta?.system_requirements && (
      <Box marginTop={"12px"} borderBottom={"1px solid rgba(255, 255, 255, 0.10)"} paddingBottom={"16px"}>
        <Box className={"fs-14-regular gray"}>{t("sto-38_system-requirement")}</Box>
        <Stack mt={"16px"}>
          {game?.projectMeta?.system_requirements?.cpu && <Box className={"fs-14-regular white"}>{`• PROCESSOR: ${game.projectMeta.system_requirements.cpu}`}</Box>}
          {game?.projectMeta?.system_requirements?.gpu && <Box className={"fs-14-regular white"}>{`• GRAPHICS: ${game.projectMeta.system_requirements.gpu}`}</Box>}
          {game?.projectMeta?.system_requirements?.memory && (
            <Box className={"fs-14-regular white"}>{`• MEMORY: ${game.projectMeta.system_requirements.memory}`}</Box>
          )}
          {game?.projectMeta?.system_requirements?.disk && <Box className={"fs-14-regular white"}>{`• STORAGE: ${game.projectMeta.system_requirements.disk}`}</Box>}
        </Stack>
      </Box>
    )
  );
};

export default GameOverViewSystemRequirement;
