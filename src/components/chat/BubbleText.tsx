import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";

import { Box, Stack } from "@mui/material";

import Linkify from "./Linkify";

import { getCurrentChatroomMembers, ICurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";

import { ChatMessageType } from "../../types/chatTypes";

export interface IParamsBubbleText {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
}

const BubbleText = ({ roomMode, message, decryptedMessage, isLastMessage, isSender }: IParamsBubbleText) => {
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);
  const displayNickname: string = useMemo(() => {
    const sender = currentChatroomMembersStore.members.find((member) => member._id === message.sender_id);
    if (sender) return sender.nickName;
    return "Deleted";
  }, [currentChatroomMembersStore]);

  return (
    <>
      <Box
        className={`fs-14-regular white ${isSender ? "bubble" : "bubble-partner"} ${
          isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"
        }`}
      >
        <Stack>
          <Box className={"fs-12-regular white"}>{displayNickname}</Box>
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
