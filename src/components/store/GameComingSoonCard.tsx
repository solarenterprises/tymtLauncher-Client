import { useSelector } from "react-redux";

import { Box } from "@mui/material";

import { getGameList } from "../../features/store/GameListSlice";

import { IGameList } from "../../types/GameTypes";
import { useMemo } from "react";

const GameComingSoonCard = () => {
  const gameListStore: IGameList = useSelector(getGameList);
  const game = useMemo(() => gameListStore.games[0], [gameListStore]);

  return (
    <Box
      sx={{
        width: "276px",
        height: "300px",
        borderRadius: "16px",
        border: "1px solid",
        borderImageSource: "linear-gradient(92deg, rgba(255, 255, 255, 0.05) 1.69%, rgba(255, 255, 255, 0.1) 50.48%, rgba(255, 255, 255, 0.05) 98.31%)",
      }}
    >
      <Box component={"img"} src={game.imageUrl} width={"276px"} height={"300px"} />
    </Box>
  );
};

export default GameComingSoonCard;
