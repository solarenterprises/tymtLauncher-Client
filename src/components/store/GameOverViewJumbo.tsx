import ReactPlayer from "react-player/youtube";

import { Box } from "@mui/material";

export interface IPropsGameOverViewJumbo {
  type: string;
  src: string;
}

const GameOverViewJumbo = ({ type, src }: IPropsGameOverViewJumbo) => {
  return (
    <>
      {type === "image" && (
        <img
          src={src}
          width={"100%"}
          style={{
            aspectRatio: "1.78",
            borderRadius: "16px",
          }}
          loading="lazy"
        />
      )}
      {type === "youtube" && (
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1.78",
            borderRadius: "16px",
          }}
        >
          <ReactPlayer url={src} width={"100%"} controls />
        </Box>
      )}
    </>
  );
};

export default GameOverViewJumbo;
