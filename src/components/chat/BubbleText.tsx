import React from "react";
import { ThreeDots } from "react-loader-spinner";

import { Box } from "@mui/material";

import Linkify from "./Linkify";

import { ChatMessageType } from "../../types/chatTypes";

const decryptedMessage = "Here is the link https://www.npmjs.com/package/react-player please\nhttps://www.npmjs.com/package/react-player";

export interface IParamsBubbleText {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
}

const BubbleText = ({ message, isLastMessage, isSender }: IParamsBubbleText) => {
  return (
    <>
      <Box
        className={
          isLastMessage
            ? `fs-14-regular white ${isSender ? "bubble-last" : "bubble-last-partner"}`
            : `fs-14-regular white ${isSender ? "bubble" : "bubble-partner"}`
        }
      >
        {decryptedMessage !== undefined ? (
          <>
            {decryptedMessage.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                <Linkify>{line}</Linkify>
                <br />
              </React.Fragment>
            ))}
            <Box className="fs-14-light timestamp-inbubble" sx={{ alignSelf: "flex-end" }} color={"rgba(11, 11, 11, 0.7)"}>
              {new Date(message.createdAt).toLocaleString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Box>
          </>
        ) : (
          <ThreeDots height="23px" width={"40px"} radius={4} color={`white`} />
        )}
      </Box>
    </>
  );
};

export default BubbleText;
