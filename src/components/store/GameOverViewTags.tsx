import { Box } from "@mui/material";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewTags {
  game: IGame;
}

const GameOverViewTags = ({ game }: IPropsGameOverViewTags) => {
  return (
    <Box gap={1.5} marginTop={"30px"} marginBottom={"30px"} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
      {game?.projectMeta?.tags.map((tag, index) => (
        <Box key={index} className="fs-14-regular white card_genre_label_GO">
          {tag}
        </Box>
      ))}
    </Box>
  );
};

export default GameOverViewTags;
