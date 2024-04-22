import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { nonCustodialType } from "../../types/accountTypes";
import { multiWalletType } from "../../types/walletTypes";
import {
  ChatHistoryType,
  ChatMessageType,
  alertType,
  userType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { chatType } from "../../types/settingTypes";

import { getAccount } from "../../features/account/AccountSlice";
import { getsenderName } from "../../features/chat/Chat-contactApi";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import {
  getaccessToken,
  createContact,
  receiveContactlist,
} from "../../features/chat/Chat-contactApi";
import {
  getUserlist,
  setUserList,
} from "../../features/chat/Chat-userlistSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { getFriendlist } from "../../features/chat/Chat-friendlistSlice";

const socket: Socket = io(socket_backend_url as string);
import { socket_backend_url } from "../../configs";
import { io, Socket } from "socket.io-client";

import { useNotification } from "../../providers/NotificationProvider";

const ChatProvider = () => {
  const dispatch = useDispatch();
  const account: accountType = useSelector(getAccount);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentpartner: userType = useSelector(selectPartner);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const chatfriendlist: userType[] = useSelector(getFriendlist);
  const data: chatType = useSelector(selectChat);
  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const updateContact = async (_id) => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await createContact(_id, accessToken);
    const contacts: userType[] = await receiveContactlist(accessToken);
    dispatch(setUserList(contacts));
  };

  useEffect(() => {
    socket.on("connect", function () {
      socket.emit("user-joined", `${account.uid}`);
    });
    socket.on("message-posted", (message: ChatMessageType) => {
      const senderId = message.sender_id;
      const senderInChatUserlist = chatuserlist.find(
        (user) => user._id === senderId
      );
      const senderInChatFriendlist = chatfriendlist.find(
        (user) => user._id === senderId
      );
      if (
        message.sender_id === currentpartner._id &&
        message.recipient_id === account.uid
      ) {
        if (data.message === "anyone") {
          const updatedHistory = [message, ...chatHistoryStore.messages];
          dispatch(setChatHistory({ messages: updatedHistory }));
        }
        if (data.message === "friend" && senderInChatFriendlist) {
          const updatedHistory = [message, ...chatHistoryStore.messages];
          dispatch(setChatHistory({ messages: updatedHistory }));
        }
      }
      const handleIncomingMessages = async () => {
        if (message.recipient_id === account.uid) {
          if (data.message === "anyone") {
            if (!senderInChatUserlist) {
              const senderName = await getsenderName(message.sender_id);
              await updateContact(message.sender_id);
              {
                !data.disturb && setNotificationOpen(true);
                setNotificationStatus("message");
                setNotificationTitle(senderName);
                setNotificationDetail(message.message);
                setNotificationLink(`/chat?senderId=${message.sender_id}`);
              }
            } else {
              const senderName = senderInChatUserlist.nickName;
              {
                !data.disturb && setNotificationOpen(true);
                setNotificationStatus("message");
                setNotificationTitle(senderName);
                setNotificationDetail(message.message);
                setNotificationLink(`/chat?senderId=${message.sender_id}`);
              }
            }
          }
          if (data.message === "friend") {
            if (senderInChatFriendlist) {
              const senderName = senderInChatFriendlist.nickName;
              setNotificationStatus("message");
              setNotificationTitle(senderName);
              setNotificationDetail(message.message);
              setNotificationLink(`/chat?senderId=${message.sender_id}`);
            }
          }
        } else {
        }
      };

      handleIncomingMessages();
    });
    socket.on("alert-posted", (alert: alertType) => {
      console.log("friend-request", alert);
      console.log("receiver", alert.receivers[0]);
      console.log("my id", account.uid);
      const handleIncomingRequest = async () => {
        if (alert.alertType === "friend-request") {
          if (
            !data.disturb &&
            data.friend === "anyone" &&
            alert.receivers[0] === account.uid
          ) {
            const senderId = alert.note;
            const senderInChatUserlist = chatuserlist.find(
              (user) => user._id === senderId
            );
            console.log("senderInChatuserlist", senderInChatUserlist);
            console.log("senderId", alert.note);
            if (senderInChatUserlist) {
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle("Friend Request");
              setNotificationDetail(alert.note);
              setNotificationLink(null);
            } else {
              await updateContact(senderId);
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle("Friend Request");
              setNotificationDetail(alert.note);
              setNotificationLink(null);
            }
          } else {
          }
        } else {
        }
      };
      handleIncomingRequest();
    });

    return () => {
      socket.off("connect");
      socket.off("message-posted");
      socket.off("alert-posted");
    };
  }, [socket, data, chatHistoryStore]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ChatProvider;
