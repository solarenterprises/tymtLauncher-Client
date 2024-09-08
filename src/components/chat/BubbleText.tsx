import React from "react";
import { ThreeDots } from "react-loader-spinner";

import { Box, Stack } from "@mui/material";

import Linkify from "./Linkify";

import { ChatMessageType } from "../../types/chatTypes";

import adminIcon from "../../assets/chat/admin.png";
import moderatorIcon from "../../assets/chat/moderator.png";

export interface IParamsBubbleText {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
  displayNickname: string;
  isDM: boolean;
  displayRole: string;
}

const BubbleText = ({ roomMode, message, decryptedMessage, isLastMessage, isSender, displayNickname, isDM, displayRole }: IParamsBubbleText) => {
  return (
    <>
      <Box
        className={`fs-14-regular white ${isSender ? "bubble" : "bubble-partner"} ${
          isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"
        }`}
      >
        <Stack>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            {!isDM && <Box className={"fs-12-regular white"}>{displayNickname}</Box>}
            {!isDM && displayRole === "admin" && <Box component={"img"} src={adminIcon} width={"12px"} height={"12px"} />}
            {!isDM && displayRole === "moderator" && <Box component={"img"} src={moderatorIcon} width={"12px"} height={"12px"} />}
          </Stack>
          <Box>
            {decryptedMessage !== undefined ? (
              <>
                {decryptedMessage.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    <Linkify>{line}</Linkify>
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
        </Stack>
      </Box>
    </>
  );
};

export default BubbleText;
