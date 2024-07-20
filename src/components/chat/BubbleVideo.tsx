import ReactPlayer from "react-player";

import { Box } from "@mui/material";

import { ChatMessageType } from "../../types/chatTypes";

const VIDEO_LINK = "https://veloren.net/videos/veloren.webm";

export interface IParamsBubbleVideo {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
}

const BubbleVideo = ({ message, isLastMessage, isSender }: IParamsBubbleVideo) => {
  return (
    <>
      <Box
        className={
          isLastMessage
            ? `fs-14-regular white ${isSender ? "bubble-image-last" : "bubble-image-last-partner"}`
            : `fs-14-regular white ${isSender ? "bubble-image" : "bubble-image-partner"}`
        }
        sx={{ position: "relative" }}
      >
        {/* <Box
          component={"img"}
          src={IMAGE_URL}
          width={"200px"}
          height={"150px"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        /> */}
        <ReactPlayer className="react-player" url={VIDEO_LINK} width="200px" height="150px" controls={true} />
        <Box
          className="fs-16-regular white"
          sx={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            padding: "4px",
            borderRadius: "10px",
            height: "20px",
            backgroundColor: "#00000088",
          }}
        >
          {new Date(message.createdAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Box>
      </Box>
    </>
  );
};

export default BubbleVideo;
