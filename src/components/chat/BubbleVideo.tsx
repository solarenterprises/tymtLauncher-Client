import { useState } from "react";
import ReactPlayer from "react-player";

import { Box } from "@mui/material";

import BubbleDownloadButton from "./BubbleDownloadButton";

import { ChatMessageType } from "../../types/chatTypes";

import { tymt_avatar_url } from "../../configs";

// const VIDEO_URL = "https://veloren.net/videos/veloren.webm";

export interface IParamsBubbleVideo {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
}

const BubbleVideo = ({ roomMode, message, isLastMessage, isSender }: IParamsBubbleVideo) => {
  const [mouseOn, setMouseOn] = useState<boolean>(false);

  const url = `${tymt_avatar_url}/public/upload/message/${message.file}`;

  return (
    <>
      <Box
        className={`fs-14-regular white bubble-image ${isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"}`}
        sx={{ position: "relative" }}
        onMouseEnter={() => {
          setMouseOn(true);
        }}
        onMouseLeave={() => {
          setMouseOn(false);
        }}
      >
        {mouseOn && <BubbleDownloadButton url={url} />}
        <ReactPlayer className="react-player" url={url} width="200px" height="150px" controls={true} />
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
