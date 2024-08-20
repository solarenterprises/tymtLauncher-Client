import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

export interface IPropsComingGameCard {
  game: IGame;
}

const ComingGameCard = ({ game }: IPropsComingGameCard) => {
  return (
    <Box
      sx={{
        width: "276px",
        height: "225px",
        flexShrink: "0",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background: "rgba(255, 255, 255, 0.02)",
        backgroundBlendMode: "luminosity",
        backdropFilter: "blur(50px)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        "&:hover": {
          backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.1))",
          border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.1))",
        },
        "&:active": {
          background: "var(--bg-stroke-icon-button-bg-active-30, rgba(128, 128, 128, 0.3))",
        },
      }}
    >
      <Box
        className={"fs-12-regular white"}
        sx={{
          position: "absolute",
          top: "14px",
          right: "14px",
          background: "linear-gradient(to right, rgb(196, 176, 102), rgb(125, 108, 49))",
          borderRadius: "50ch",
          padding: "4px",
        }}
      >
        COMING SOON
      </Box>
      <Box
        component={"img"}
        src={game.imageUrl}
        width={"100%"}
        height={"165px"}
        sx={{
          borderRadius: "16px",
        }}
      />
      <Box
        className="fs-20-regular white"
        sx={{
          padding: "16px",
        }}
      >
        {game.title}
      </Box>
    </Box>
  );
};

export default ComingGameCard;
