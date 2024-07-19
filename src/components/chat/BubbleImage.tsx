import { useState } from "react";

import { Box } from "@mui/material";

import { ChatMessageType } from "../../types/chatTypes";

const IMAGE_URL = "https://dev.tymt.com/public/upload/room-image/66855e3d70fe2851827b7ccb.jpg";

export interface IParamsBubbleImage {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
}

const BubbleImage = ({ message, isLastMessage, isSender }: IParamsBubbleImage) => {
  const [_showTime, setShowTime] = useState<boolean>(false);
  const [_showImageModal, setShowImageModal] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowTime(true);
  };

  const handleMouseLeave = () => {
    setShowTime(false);
  };

  const handleClick = () => {
    setShowImageModal(true);
  };

  return (
    <>
      <Box
        className={
          isLastMessage
            ? `fs-14-regular white ${isSender ? "bubble-image-last" : "bubble-image-last-partner"}`
            : `fs-14-regular white ${isSender ? "bubble-image" : "bubble-image-partner"}`
        }
      >
        <Box
          component={"img"}
          src={IMAGE_URL}
          width={"200px"}
          height={"150px"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
        <Box
          className="fs-16-regular white"
          sx={{
            position: "relative",
            right: "85px",
            top: "120px",
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

export default BubbleImage;
d