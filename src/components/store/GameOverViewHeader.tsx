import { Stack, Box } from "@mui/material";
import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewHeader {
  game: IGame;
}

const GameOverViewHeader = ({ game }: IPropsGameOverViewHeader) => {
  return (
    <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
      <Box
        component={"img"}
        src={game.imageUrl}
        width={"124px"}
        height={"82px"}
        sx={{
          borderRadius: "16px",
        }}
      />
      <Stack gap={"8px"}>
        <Box className={"fs-40-bold white"}>{game?.title}</Box>
        <Box
          className={"fs-12-regular white"}
          sx={{
            borderRadius: "8px",
            background: "rgba(255, 165, 0, 0.40)",
            backdropFilter: "blur(10px)",
            display: "flex",
            padding: "6px 2px",
            justifyContent: "center",
            alignItems: "center",
            width: "93px",
          }}
        >
          COMING SOON
        </Box>
      </Stack>
    </Stack>
  );
};

export default GameOverViewHeader;
