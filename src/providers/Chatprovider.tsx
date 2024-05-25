import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChatHistoryType,
  ChatMessageType,
  alertType,
  askEncryptionKeyType,
  deliverEncryptionKeyType,
  deliveredEncryptionKeyType,
  userType,
} from "../types/chatTypes";
import { accountType } from "../types/accountTypes";
import { chatType, notificationType } from "../types/settingTypes";

import { getAccount } from "../features/account/AccountSlice";
import {
  generateRandomString,
  getsenderName,
} from "../features/chat/Chat-contactApi";
import {
  createContact,
  receiveContactlist,
} from "../features/chat/Chat-contactApi";
import { getUserlist, setUserList } from "../features/chat/Chat-userlistSlice";
import { selectChat } from "../features/settings/ChatSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../features/chat/Chat-historySlice";
import { selectPartner } from "../features/chat/Chat-currentPartnerSlice";
import {
  getFriendlist,
  setFriendlist,
} from "../features/chat/Chat-friendlistSlice";

import { useNotification } from "./NotificationProvider";
import { useSocket } from "./SocketProvider";
import {
  selectNotification,
  // setNotificationAsync,
} from "../features/settings/NotificationSlice";
import { alertbadgeType } from "../types/alertTypes";
import {
  selectBadgeStatus,
  setBadgeStatus,
} from "../features/alert/AlertbadgeSlice";
import {
  addEncryptionKey,
  selectEncryptionKeyByUserId,
} from "../features/chat/Chat-encryptionkeySlice";
import { useCallback, useEffect } from "react";
// import { decrypt } from "../../lib/api/Encrypt";

const ChatProvider = () => {
  const dispatch = useDispatch();
  const account: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentpartner: userType = useSelector(selectPartner);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const chatfriendlist: userType[] = useSelector(getFriendlist);
  const notification: notificationType = useSelector(selectNotification);
  const alertbadge: alertbadgeType = useSelector(selectBadgeStatus);
  const data: chatType = useSelector(selectChat);
  const { socket } = useSocket();

  const triggerBadge = useCallback(() => {
    dispatch(setBadgeStatus({ ...alertbadge, trigger: !alertbadge.trigger }));
  }, [dispatch, alertbadge.trigger]);

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const updateContact = async (_id) => {
    await createContact(_id);
    const contacts: userType[] = await receiveContactlist();
    dispatch(setUserList(contacts));
  };

  // const selectEncryptionKey = (message) => {
  //   return useSelector((state) =>
  //     selectEncryptionKeyByUserId(state, message.sender_id)
  //   );
  // };

  const handleIncomingMessages = useCallback(
    async (
      message: ChatMessageType,
      senderInChatUserlist: userType,
      senderInChatFriendlist: userType
    ) => {
      if (message.recipient_id === account.uid) {
        if (data.message === "anyone") {
          console.log("messagereception", data.message);
          if (!senderInChatUserlist) {
            const senderName = await getsenderName(message.sender_id);
            await updateContact(message.sender_id);
            {
              notification.alert && setNotificationOpen(true);
              setNotificationStatus("message");
              setNotificationTitle(senderName);
              setNotificationDetail(message.message);
              setNotificationLink(`/chat?senderId=${message.sender_id}`);
            }
          } else {
            const senderName = senderInChatUserlist.nickName;
            {
              notification.alert && setNotificationOpen(true);
              setNotificationStatus("message");
              setNotificationTitle(senderName);
              setNotificationDetail(message.message);
              setNotificationLink(`/chat?senderId=${message.sender_id}`);
            }
          }
        } else if (data.message === "friend") {
          console.log("messagereception", data.message);
          if (senderInChatFriendlist) {
            const senderName = senderInChatFriendlist.nickName;
            {
              notification.alert && setNotificationOpen(true);
              setNotificationStatus("message");
              setNotificationTitle(senderName);
              setNotificationDetail(message.message);
              setNotificationLink(`/chat?senderId=${message.sender_id}`);
            }
          }
        } else {
        }
      } else {
        console.log("messagereception", data.message);
      }
    },
    [data.message]
  );

  const handleEncryptionKeyDelivery = (data) => {
    const userid = data.sender_id;
    const encryptionkey = data.key;
    // const existkey = useSelector((state) =>
    //   selectEncryptionKeyByUserId(state, userid)
    // );

    // if (!existkey) {
    dispatch(
      addEncryptionKey({ userId: userid, encryptionKey: encryptionkey })
    );
    // }
  };

  const handleAskingEncryptionKey = (data) => {
    const userid: string = data.sender_id;
    const existkey = useSelector((state) =>
      selectEncryptionKeyByUserId(state, userid)
    );
    const key = existkey ? existkey : generateRandomString(32);
    const deliverydata: deliverEncryptionKeyType = {
      sender_id: account.uid,
      recipient_id: data.sender_id,
      key: key,
    };
    socket.emit("deliver-encryption-key", JSON.stringify(deliverydata));
    dispatch(addEncryptionKey({ userId: userid, encryptionKey: key }));
  };

  // Check for socket connection
  socket.on("connect", function () {});

  // Handle each posted message incoming to user
  socket.on("message-posted", async (message: ChatMessageType) => {
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
      console.log("message reception", data.message);
      if (data.message === "anyone") {
        const updatedHistory = [message, ...chatHistoryStore.messages];
        dispatch(setChatHistory({ messages: updatedHistory }));
      } else if (data.message === "friend" && senderInChatFriendlist) {
        console.log("senderInChatFriendlist", senderInChatFriendlist);
        const updatedHistory = [message, ...chatHistoryStore.messages];
        dispatch(setChatHistory({ messages: updatedHistory }));
      } else {
      }
    } else {
    }

    handleIncomingMessages(
      message,
      senderInChatUserlist,
      senderInChatFriendlist
    );
  });

  // Handle each posted alert incoming to user
  useEffect(() => {
    socket.on("alert-posted", async (alert: alertType) => {
      console.log("alert-posted", alert);
      const handleIncomingRequest = async () => {
        if (alert.alertType === "friend-request") {
          if (data.friend === "anyone" && alert.receivers[0] === account.uid) {
            const senderId = alert.note?.sender;
            const senderInChatUserlist = chatuserlist.find(
              (user) => user._id === senderId
            );
            console.log("senderInChatuserlist", senderInChatUserlist);
            console.log("senderId", alert.note.sender);
            if (senderInChatUserlist) {
              notification.alert && triggerBadge();
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle("Friend Request");
              setNotificationDetail(alert);
              setNotificationLink(null);
            } else {
              await updateContact(senderId);
              {
                notification.alert && triggerBadge();
                setNotificationOpen(true);
                setNotificationStatus("alert");
                setNotificationTitle("Friend Request");
                setNotificationDetail(alert);
                setNotificationLink(null);
              }
            }
          } else {
          }
        } else if (
          notification.alert &&
          alert.alertType !== "chat" &&
          alert.receivers.find((userid) => userid === account.uid)
        ) {
          triggerBadge();
          setNotificationOpen(true);
          setNotificationStatus("alert");
          setNotificationTitle(`${alert.alertType}`);
          setNotificationDetail(`${alert.note.detail}`);
          setNotificationLink(null);
        } else if (
          notification.alert &&
          alert.alertType === "chat" &&
          alert.receivers.find((userid) => userid === account.uid)
        ) {
          triggerBadge();
        }
      };
      handleIncomingRequest();
    });
    return () => {
      socket.off("alert-posted");
    };
  }, [alertbadge.trigger]);

  // Handle each updated alert incoming to user
  useEffect(() => {
    socket.on("alert-updated", async (alert: alertType) => {
      console.log("alert-updated", alert);
      const handleIncomingUpdatedAlert = () => {
        if (
          alert.alertType === "friend-request" &&
          (alert.note.sender === account.uid ||
            alert.receivers[0] === account.uid)
        ) {
          {
            if (notification.alert) {
              triggerBadge();
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle(`Friend request ${alert.note.status}`);
              setNotificationDetail(`Friend request accepted`);
              setNotificationLink(null);
            }
            if (
              alert.note.sender === account.uid &&
              alert.note.status === "accepted"
            ) {
              const senderInChatUserlist = chatuserlist.find(
                (user) => user._id === alert.receivers[0]
              );
              const updatedFriendlist: userType[] = [
                ...chatfriendlist,
                senderInChatUserlist,
              ];
              dispatch(setFriendlist(updatedFriendlist));
            }
          }
        } else {
          if (
            notification.alert &&
            alert.receivers.find((userid) => userid === account.uid)
          ) {
            triggerBadge();
            setNotificationOpen(true);
            setNotificationStatus("alert");
            setNotificationTitle(`${alert.alertType}`);
            setNotificationDetail(`${alert.note.detail}`);
            setNotificationLink(null);
          } else {
          }
        }
      };
      handleIncomingUpdatedAlert();
    });
    return () => {
      socket.off("alert-updated");
    };
  }, [alertbadge.trigger, chatuserlist, chatfriendlist]);

  // receive request for  encryption key and generate/send encryption key to partner
  socket.on("ask-encryption-key", async (data: askEncryptionKeyType) => {
    console.log("receiving encryption key request--->", data);
    handleAskingEncryptionKey(data);
  });
  // receive delivered encryption key
  socket.on(
    "deliver-encryption-key",
    async (data: deliveredEncryptionKeyType) => {
      console.log("encryption-key delievery--->", data);
      handleEncryptionKeyDelivery(data);
      socket.emit("received-encryption-key", JSON.stringify(data));
    }
  );

  socket.on("user-online-status-updated", async (data) => {
    console.log("received updated user online status-->", data);
    const handleUpdatedOnlineStatus = async () => {
      const userId = data.userid;
      const userinChatuserlist = chatuserlist.find(
        (user) => user._id === userId
      );
      if (userinChatuserlist) {
        dispatch(
          setUserList({ ...userinChatuserlist, onlineStatus: data.status })
        );
      }
    };
    handleUpdatedOnlineStatus();
  });

  socket.on("user-notification-status-updated", async (data) => {
    console.log("received updated user online status-->", data);
    const handleUpdatedOnlineStatus = async () => {
      const userId = data.userid;
      const userinChatuserlist = chatuserlist.find(
        (user) => user._id === userId
      );
      if (userinChatuserlist) {
        dispatch(
          setUserList({
            ...userinChatuserlist,
            notificationStatus: data.status,
          })
        );
      }
    };
    handleUpdatedOnlineStatus();
  });

  return (
    <>
      <Outlet />
    </>
  );
};

export default ChatProvider;
