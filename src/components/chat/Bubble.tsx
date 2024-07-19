import { useCallback } from "react";
import { useSelector } from "react-redux";

import { Box, Stack } from "@mui/material";

import BubbleAudio from "./BubbleAudio";
import BubbleFile from "./BubbleFile";
import BubbleImage from "./BubbleImage";
import BubbleVideo from "./BubbleVideo";
import BubbleText from "./BubbleText";
import OrLinechat from "./Orlinechat";

import { Chatdecrypt } from "../../lib/api/ChatEncrypt";

import { getChatHistory } from "../../features/chat/ChatHistorySlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { getSKeyList, ISKeyList } from "../../features/chat/SKeyListSlice";
import { getAccount } from "../../features/account/AccountSlice";

import { ChatHistoryType, ChatMessageType } from "../../types/chatTypes";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";

export interface IParamsBubble {
  message: ChatMessageType;
  index: number;
}

const Bubble = ({ message, index }: IParamsBubble) => {
  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);

  const sKey = sKeyListStore.sKeys.find((element) => element.roomId === currentChatroomStore?._id)?.sKey;

  const formatDateDifference = (date) => {
    const today: any = new Date(Date.now());
    const yesterday: any = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const options = { month: "long", day: "numeric" };
    const messageDate: any = new Date(date);
    if (messageDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return "Today";
    } else if (messageDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", options) as string;
    }
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  const isFirstMessageOfDay = useCallback(() => {
    if (index === 0) return true;
    const previousMessageDate = new Date([...chatHistoryStore.messages].reverse()[index - 1]?.createdAt);
    const currentMessageDate = new Date(message.createdAt);
    return !isSameDay(previousMessageDate, currentMessageDate);
  }, [chatHistoryStore]);

  const detectLastMessageofStack = useCallback(() => {
    const nextMessageSender = [...chatHistoryStore.messages].reverse()[index + 1]?.sender_id;
    const currentMessageSender = [...chatHistoryStore.messages].reverse()[index]?.sender_id;
    return nextMessageSender !== currentMessageSender;
  }, [chatHistoryStore]);

  const decryptMessage = useCallback(
    (encryptedmessage: string) => {
      if (currentChatroomStore?.isPrivate ?? false) {
        return Chatdecrypt(encryptedmessage, sKey);
      }
      return encryptedmessage;
    },
    [sKey, currentChatroomStore]
  );

  const timeline = isFirstMessageOfDay() ? formatDateDifference(message.createdAt) : null;
  const isLastMessageOfStack = detectLastMessageofStack();
  const decryptedMessage = decryptMessage(message.message);
  const isSender = message.sender_id === accountStore.uid;

  return (
    <Box className={"bubblecontainer"} key={`${index}-${message.createdAt}`}>
      {timeline && decryptedMessage !== undefined && <OrLinechat timeline={timeline} />}
      <Stack
        flexDirection={"row"}
        alignItems={"flex-end"}
        marginTop={"10px"}
        gap={"15px"}
        justifyContent={message.sender_id === accountStore.uid ? "flex-end" : "flex-start"}
      >
        {(!message.type || message.type === "text") && (
          <BubbleImage message={message} decryptedMessage={decryptedMessage} isLastMessage={isLastMessageOfStack} isSender={isSender} />
        )}
        {message.type === "audio" && (
          <BubbleAudio message={message} decryptedMessage={decryptedMessage} isLastMessage={isLastMessageOfStack} isSender={isSender} />
        )}
        {message.type === "image" && (
          <BubbleText message={message} decryptedMessage={decryptedMessage} isLastMessage={isLastMessageOfStack} isSender={isSender} />
        )}
        {message.type === "video" && <BubbleVideo message={message} decryptedMessage={decryptedMessage} />}
        {message.type === "file" && <BubbleFile message={message} decryptedMessage={decryptedMessage} />}
      </Stack>
    </Box>
  );
};

export default Bubble;
