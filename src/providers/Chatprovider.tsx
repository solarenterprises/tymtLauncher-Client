import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChatHistoryType,
  ChatMessageType,
  alertType,
  askEncryptionKeyType,
  deliverEncryptionKeyType,
  deliveredEncryptionKeyType,
  encryptionkeyStoreType,
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
  selectEncryptionKeyStore,
} from "../features/chat/Chat-encryptionkeySlice";
import { useEffect, useRef } from "react";
import { AppDispatch } from "../store";
// import { decrypt } from "../../lib/api/Encrypt";

const ChatProvider = () => {
  const dispatch = useDispatch<AppDispatch>();

  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentPartnerStore: userType = useSelector(selectPartner);
  const chatUserListStore: userType[] = useSelector(getUserlist);
  const chatFriendListStore: userType[] = useSelector(getFriendlist);
  const notificationStore: notificationType = useSelector(selectNotification);
  const alertBadgeStore: alertbadgeType = useSelector(selectBadgeStatus);
  const chatStore: chatType = useSelector(selectChat);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  const accountStoreRef = useRef(accountStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const chatUserListStoreRef = useRef(chatUserListStore);
  const chatFriendListStoreRef = useRef(chatFriendListStore);
  const notificationStoreRef = useRef(notificationStore);
  const alertBadgeStoreRef = useRef(alertBadgeStore);
  const chatStoreRef = useRef(chatStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    currentPartnerStoreRef.current = currentPartnerStore;
  }, [currentPartnerStore]);
  useEffect(() => {
    chatUserListStoreRef.current = chatUserListStore;
  }, [chatUserListStore]);
  useEffect(() => {
    chatFriendListStoreRef.current = chatFriendListStore;
  }, [chatFriendListStore]);
  useEffect(() => {
    notificationStoreRef.current = notificationStore;
  }, [notificationStore]);
  useEffect(() => {
    alertBadgeStoreRef.current = alertBadgeStore;
  }, [alertBadgeStore]);
  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);
  useEffect(() => {
    encryptionKeyStoreRef.current = encryptionKeyStore;
  }, [encryptionKeyStore]);

  const { socket } = useSocket();

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const triggerBadge = () => {
    dispatch(
      setBadgeStatus({
        ...alertBadgeStoreRef.current,
        trigger: !alertBadgeStoreRef.current.trigger,
      })
    );
  };

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

  const handleEncryptionKeyDelivery = (data) => {
    const userid = data.sender_id;
    const encryptionkey = data.key;
    dispatch(
      addEncryptionKey({ userId: userid, encryptionKey: encryptionkey })
    );
  };

  const handleAskingEncryptionKey = (data) => {
    const userid: string = data.sender_id;
    const existkey = encryptionKeyStoreRef.current.encryption_Keys[userid];
    const key = existkey ? existkey : generateRandomString(32);
    const deliverydata: deliverEncryptionKeyType = {
      sender_id: accountStoreRef.current.uid,
      recipient_id: data.sender_id,
      key: key,
    };
    socket.emit("deliver-encryption-key", JSON.stringify(deliverydata));
    dispatch(addEncryptionKey({ userId: userid, encryptionKey: key }));
  };

  const handleIncomingMessages = async (
    message: ChatMessageType,
    senderInChatUserlist: userType,
    senderInChatFriendlist: userType
  ) => {
    console.log("handleIncomingMessages");
    if (message.recipient_id === accountStoreRef.current.uid) {
      if (chatStoreRef.current.message === "anyone") {
        console.log("messagereception", chatStoreRef.current.message);
        if (!senderInChatUserlist) {
          const senderName = await getsenderName(message.sender_id);
          await updateContact(message.sender_id);
          {
            notificationStoreRef.current.alert && setNotificationOpen(true);
            setNotificationStatus("message");
            setNotificationTitle(senderName);
            setNotificationDetail(message.message);
            setNotificationLink(`/chat?senderId=${message.sender_id}`);
          }
        } else {
          const senderName = senderInChatUserlist.nickName;
          {
            notificationStoreRef.current.alert && setNotificationOpen(true);
            setNotificationStatus("message");
            setNotificationTitle(senderName);
            setNotificationDetail(message.message);
            setNotificationLink(`/chat?senderId=${message.sender_id}`);
          }
        }
      } else if (chatStoreRef.current.message === "friend") {
        console.log("messagereception", chatStoreRef.current.message);
        if (senderInChatFriendlist) {
          const senderName = senderInChatFriendlist.nickName;
          {
            notificationStoreRef.current.alert && setNotificationOpen(true);
            setNotificationStatus("message");
            setNotificationTitle(senderName);
            setNotificationDetail(message.message);
            setNotificationLink(`/chat?senderId=${message.sender_id}`);
          }
        }
      } else {
      }
    } else {
      console.log("messagereception", chatStoreRef.current.message);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket.on > connect");
    });
    return () => {
      socket.off("connect");
    };
  }, [socket]);

  // Handle each posted message incoming to user
  useEffect(() => {
    socket.on("message-posted", async (message: ChatMessageType) => {
      console.log("socket.on > message-posted", message);
      const senderId = message.sender_id;
      const senderInChatUserlist = chatUserListStoreRef.current.find(
        (user) => user._id === senderId
      );
      const senderInChatFriendlist = chatFriendListStoreRef.current.find(
        (user) => user._id === senderId
      );
      if (
        message.sender_id === currentPartnerStoreRef.current._id &&
        message.recipient_id === accountStoreRef.current.uid
      ) {
        console.log("message reception", chatStoreRef.current.message);
        if (chatStoreRef.current.message === "anyone") {
          const updatedHistory = [
            message,
            ...chatHistoryStoreRef.current.messages,
          ];
          dispatch(setChatHistory({ messages: updatedHistory }));
        } else if (
          chatStoreRef.current.message === "friend" &&
          senderInChatFriendlist
        ) {
          console.log("senderInChatFriendlist", senderInChatFriendlist);
          const updatedHistory = [
            message,
            ...chatHistoryStoreRef.current.messages,
          ];
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
    return () => {
      socket.off("message-posted");
    };
  }, [socket]);

  // Handle each posted alert incoming to user
  useEffect(() => {
    socket.on("alert-posted", async (alert: alertType) => {
      console.log("socket.on > alert-posted", alert);
      const handleIncomingRequest = async () => {
        if (alert.alertType === "friend-request") {
          if (
            chatStoreRef.current.friend === "anyone" &&
            alert.receivers[0] === accountStoreRef.current.uid
          ) {
            const senderId = alert.note?.sender;
            const senderInChatUserlist = chatUserListStoreRef.current.find(
              (user) => user._id === senderId
            );
            console.log("senderInChatuserlist", senderInChatUserlist);
            console.log("senderId", alert.note.sender);
            if (senderInChatUserlist) {
              notificationStoreRef.current.alert && triggerBadge();
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle("Friend Request");
              setNotificationDetail(alert);
              setNotificationLink(null);
            } else {
              await updateContact(senderId);
              {
                notificationStoreRef.current.alert && triggerBadge();
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
          notificationStoreRef.current.alert &&
          alert.alertType !== "chat" &&
          alert.receivers.find(
            (userid) => userid === accountStoreRef.current.uid
          )
        ) {
          triggerBadge();
          setNotificationOpen(true);
          setNotificationStatus("alert");
          setNotificationTitle(`${alert.alertType}`);
          setNotificationDetail(`${alert.note.detail}`);
          setNotificationLink(null);
        } else if (
          notificationStoreRef.current.alert &&
          alert.alertType === "chat" &&
          alert.receivers.find(
            (userid) => userid === accountStoreRef.current.uid
          )
        ) {
          triggerBadge();
        }
      };
      handleIncomingRequest();
    });
    return () => {
      socket.off("alert-posted");
    };
  }, [socket]);

  // Handle each updated alert incoming to user
  useEffect(() => {
    socket.on("alert-updated", async (alert: alertType) => {
      console.log("socket.on > alert-updated", alert);
      const handleIncomingUpdatedAlert = () => {
        if (
          alert.alertType === "friend-request" &&
          (alert.note.sender === accountStoreRef.current.uid ||
            alert.receivers[0] === accountStoreRef.current.uid)
        ) {
          {
            if (notificationStoreRef.current.alert) {
              triggerBadge();
              setNotificationOpen(true);
              setNotificationStatus("alert");
              setNotificationTitle(`Friend request ${alert.note.status}`);
              setNotificationDetail(`Friend request accepted`);
              setNotificationLink(null);
            }
            if (
              alert.note.sender === accountStoreRef.current.uid &&
              alert.note.status === "accepted"
            ) {
              const senderInChatUserlist = chatUserListStoreRef.current.find(
                (user) => user._id === alert.receivers[0]
              );
              const updatedFriendlist: userType[] = [
                ...chatFriendListStoreRef.current,
                senderInChatUserlist,
              ];
              dispatch(setFriendlist(updatedFriendlist));
            }
          }
        } else {
          if (
            notificationStoreRef.current.alert &&
            alert.receivers.find(
              (userid) => userid === accountStoreRef.current.uid
            )
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
  }, [socket]);

  // receive request for  encryption key and generate/send encryption key to partner
  useEffect(() => {
    socket.on("ask-encryption-key", async (data: askEncryptionKeyType) => {
      console.log("socket.on > ask-encryption-key", data);
      handleAskingEncryptionKey(data);
    });
    return () => {
      socket.off("ask-encryption-key");
    };
  }, [socket]);

  // receive delivered encryption key
  useEffect(() => {
    socket.on(
      "deliver-encryption-key",
      async (data: deliveredEncryptionKeyType) => {
        console.log("socket.on > deliver-encryption-key", data);
        handleEncryptionKeyDelivery(data);
        socket.emit("received-encryption-key", JSON.stringify(data));
      }
    );
    return () => {
      socket.off("deliver-encryption-key");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("user-online-status-updated", async (data) => {
      console.log("socket.on > user-online-status-updated", data);
      const handleUpdatedOnlineStatus = async () => {
        const userId = data.userid;
        const userinChatuserlist = chatUserListStoreRef.current.find(
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
    return () => {
      socket.off("user-online-status-updated");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("user-notification-status-updated", async (data) => {
      console.log("socket.on > user-notification-status-updated", data);
      const handleUpdatedOnlineStatus = async () => {
        const userId = data.userid;
        const userinChatuserlist = chatUserListStoreRef.current.find(
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
    return () => {
      socket.off("user-notification-status-updated");
    };
  }, [socket]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ChatProvider;
