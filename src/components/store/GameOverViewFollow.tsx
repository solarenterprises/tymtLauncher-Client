import { useTranslation } from "react-i18next";

import { Box, Button } from "@mui/material";

import { openLink } from "../../lib/api/Downloads";

import { IGame } from "../../types/GameTypes";

import Xicon from "../../assets/main/XIcon.png";
import linkicon from "../../assets/main/linkIcon.png";
// import facebookicon from "../../assets/main/facebookIcon.png";
import discordicon from "../../assets/main/discordIcon.png";

export interface IPropsGameOverViewFollow {
  game: IGame;
}

const GameOverViewFollow = ({ game }: IPropsGameOverViewFollow) => {
  const { t } = useTranslation();

  return (
    <Box marginTop={"24px"} borderBottom={"1px solid rgba(255, 255, 255, 0.10)"} paddingBottom={"16px"}>
      <Box className={"fs-20-regular white"}>{t("ga-5_follow-game-on")}</Box>

      <Box marginTop={"16px"} display={"flex"} flexDirection={"row"} gap={2}>
        {game?.projectMeta?.external_url && (
          <Button
            className="button_navbar_common"
            onClick={() => {
              openLink(game?.projectMeta?.external_url);
            }}
          >
            <img src={linkicon} />
          </Button>
        )}

        {game?.projectMeta?.twitter_url && (
          <Button
            className="button_navbar_common"
            onClick={() => {
              openLink(game?.projectMeta?.twitter_url);
            }}
          >
            <img src={Xicon} />
          </Button>
        )}

        {/* <Button
        className="button_navbar_common"
        onClick={() => {
          openLink(game?.projectMeta);
        }}
      >
        <img src={facebookicon} />
      </Button> */}

        {game?.projectMeta?.discord_url && (
          <Button
            className="button_navbar_common"
            onClick={() => {
              openLink(game?.projectMeta?.discord_url);
            }}
          >
            <img src={discordicon} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GameOverViewFollow;
