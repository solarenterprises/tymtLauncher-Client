import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverShortDescription {
  game: IGame;
}

const GameOverViewShortDescription = ({ game }: IPropsGameOverShortDescription) => {
  return (
    <Box
      className={"fs-16-regular"}
      sx={{
        color: "white",
        textOverflow: "ellipsis",
        overflow: "hidden",
        WebkitLineClamp: 8,
        WebkitBoxOrient: "vertical",
        display: "-webkit-box",
      }}
    >
      {game?.projectMeta?.short_description}
    </Box>
  );
};

export default GameOverViewShortDescription;
