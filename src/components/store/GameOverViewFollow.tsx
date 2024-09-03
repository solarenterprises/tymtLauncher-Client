import { useTranslation } from "react-i18next";

import { Box, Button, Tooltip, Stack } from "@mui/material";

import { openLink } from "../../lib/helper/DownloadHelper";

import { IGame } from "../../types/GameTypes";

import Xicon from "../../assets/main/XIcon.png";
import linkicon from "../../assets/main/linkIcon.png";
// import facebookicon from "../../assets/main/facebookIcon.png";
import discordicon from "../../assets/main/discordIcon.png";
import youtubeIcon from "../../assets/main/youtubeIcon.png";

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
          <Tooltip
            placement="bottom"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginTop: "-12px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{game?.projectMeta?.external_url}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                openLink(game?.projectMeta?.external_url);
              }}
            >
              <img src={linkicon} />
            </Button>
          </Tooltip>
        )}

        {game?.projectMeta?.twitter_url && (
          <Tooltip
            placement="bottom"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginTop: "-12px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{game?.projectMeta?.twitter_url}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                openLink(game?.projectMeta?.twitter_url);
              }}
            >
              <img src={Xicon} />
            </Button>
          </Tooltip>
        )}

        {game?.projectMeta?.youtube_url && (
          <Tooltip
            placement="bottom"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginTop: "-12px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{game?.projectMeta?.youtube_url}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                openLink(game?.projectMeta?.youtube_url);
              }}
            >
              <img src={youtubeIcon} />
            </Button>
          </Tooltip>
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
          <Tooltip
            placement="bottom"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginTop: "-12px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{game?.projectMeta?.discord_url}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Button
              className="button_navbar_common"
              onClick={() => {
                openLink(game?.projectMeta?.discord_url);
              }}
            >
              <img src={discordicon} />
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default GameOverViewFollow;
