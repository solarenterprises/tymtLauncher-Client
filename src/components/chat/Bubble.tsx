import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import { Box, Stack } from "@mui/material";

import BubbleAudio from "./BubbleAudio";
import BubbleFile from "./BubbleFile";
import BubbleImage from "./BubbleImage";
import BubbleVideo from "./BubbleVideo";
import BubbleText from "./BubbleText";
import OrLinechat from "./Orlinechat";
import Avatar from "../home/Avatar";

import { Chatdecrypt } from "../../lib/api/ChatEncrypt";

import { getChatHistory } from "../../features/chat/ChatHistorySlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { getSKeyList, ISKeyList } from "../../features/chat/SKeyListSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getActiveUserList, IActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { getCurrentChatroomMembers, ICurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";
import { selectNotification } from "../../features/settings/NotificationSlice";

import { ChatHistoryType, ChatMessageType } from "../../types/chatTypes";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";
import { notificationType } from "../../types/settingTypes";

export interface IParamsBubble {
  message: ChatMessageType;
  index: number;
  screenExpanded: boolean;
  roomMode: boolean;
  isDM: boolean;
}

const Bubble = ({ roomMode, screenExpanded, message, index, isDM }: IParamsBubble) => {
  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);
  const notificationStore: notificationType = useSelector(selectNotification);

  const displayNickname: string = useMemo(() => {
    const sender = currentChatroomMembersStore.members.find((member) => member._id === message.sender_id);
    if (sender) return sender.nickName;
    return "Deleted";
  }, [currentChatroomMembersStore]);

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
    [sKey, currentChatroomStore, sKeyListStore, Chatdecrypt]
  );

  const timeline = isFirstMessageOfDay() ? formatDateDifference(message.createdAt) : null;
  const isLastMessageOfStack = detectLastMessageofStack();
  const isSender = message.sender_id === accountStore.uid;
  const decryptedMessage = useMemo(() => {
    try {
      const res = decryptMessage(message.message);
      if (message.type && message.type !== "text") {
        return res.slice(0, -32);
      }
      return res;
    } catch (err) {
      console.error("Failed with decryptedMessage: ", err);
      return "";
    }
  }, [sKey, sKeyListStore, currentChatroomStore, Chatdecrypt, decryptMessage, message]);

  return (
    <Box className={"bubblecontainer"} key={`${index}-${message.createdAt}`}>
      {timeline && decryptedMessage !== undefined && <OrLinechat timeline={timeline} />}
      <Stack
        flexDirection={"row"}
        alignItems={"flex-end"}
        marginTop={"10px"}
        gap={"15px"}
        justifyContent={!screenExpanded ? (message.sender_id === accountStore.uid ? "flex-end" : "flex-start") : "flex-start"}
      >
        {roomMode && screenExpanded && isLastMessageOfStack && isSender && (
          <Avatar onlineStatus={true} url={accountStore.avatar} size={40} status={!notificationStore.alert ? "donotdisturb" : "online"} />
        )}
        {roomMode && screenExpanded && isLastMessageOfStack && !isSender && (
          <Avatar
            onlineStatus={activeUserListStore.users.some((user) => user === message.sender_id)}
            userid={message.sender_id}
            size={40}
            status={currentChatroomMembersStore?.members?.find((member) => member._id === message._id)?.notificationStatus}
          />
        )}
        {roomMode && screenExpanded && !isLastMessageOfStack && <div style={{ width: "40px", height: "40px" }} />}
        {(!message.type || message.type === "text") && (
          <BubbleText
            roomMode={roomMode}
            message={message}
            decryptedMessage={decryptedMessage}
            isLastMessage={isLastMessageOfStack}
            isSender={isSender}
            displayNickname={displayNickname}
            isDM={isDM}
          />
        )}
        {message.type === "audio" && (
          <BubbleAudio
            roomMode={roomMode}
            message={message}
            decryptedMessage={decryptedMessage}
            isLastMessage={isLastMessageOfStack}
            isSender={isSender}
            displayNickname={displayNickname}
            isDM={isDM}
          />
        )}
        {message.type === "image" && (
          <BubbleImage
            roomMode={roomMode}
            message={message}
            decryptedMessage={decryptedMessage}
            isLastMessage={isLastMessageOfStack}
            isSender={isSender}
            displayNickname={displayNickname}
            isDM={isDM}
          />
        )}
        {message.type === "video" && (
          <BubbleVideo
            roomMode={roomMode}
            message={message}
            decryptedMessage={decryptedMessage}
            isLastMessage={isLastMessageOfStack}
            isSender={isSender}
            displayNickname={displayNickname}
            isDM={isDM}
          />
        )}
        {message.type === "file" && (
          <BubbleFile
            roomMode={roomMode}
            message={message}
            decryptedMessage={decryptedMessage}
            isLastMessage={isLastMessageOfStack}
            isSender={isSender}
            displayNickname={displayNickname}
            isDM={isDM}
          />
        )}
      </Stack>
    </Box>
  );
};

export default Bubble;
