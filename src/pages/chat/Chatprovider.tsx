import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { nonCustodialType } from "../../types/accountTypes";
import { multiWalletType } from "../../types/walletTypes";
import {
  ChatHistoryType,
  ChatMessageType,
  alertType,
  askEncryptionKeyType,
  deliverEncryptionKeyType,
  encryptionkeyStoreType,
  userType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { chatType, notificationType } from "../../types/settingTypes";

import { getAccount } from "../../features/account/AccountSlice";
import {
  generateRandomString,
  getsenderName,
} from "../../features/chat/Chat-contactApi";
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
import {
  getFriendlist,
  setFriendlist,
} from "../../features/chat/Chat-friendlistSlice";

const socket: Socket = io(socket_backend_url as string);
import { socket_backend_url } from "../../configs";
import { io, Socket } from "socket.io-client";

import { useNotification } from "../../providers/NotificationProvider";
import {
  selectNotification,
  // setNotificationAsync,
} from "../../features/settings/NotificationSlice";
import { alertbadgeType } from "../../types/alertTypes";
import {
  selectBadgeStatus,
  setBadgeStatus,
} from "../../features/alert/AlertbadgeSlice";
import {
  addEncryptionKey,
  selectEncryptionKeyByUserId,
  selectEncryptionKeyStore,
} from "../../features/chat/Chat-enryptionkeySlice";
import { decrypt } from "../../lib/api/Encrypt";

const ChatProvider = () => {
  const dispatch = useDispatch();
  const account: accountType = useSelector(getAccount);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentpartner: userType = useSelector(selectPartner);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const chatfriendlist: userType[] = useSelector(getFriendlist);
  const notification: notificationType = useSelector(selectNotification);
  const alertbadge: alertbadgeType = useSelector(selectBadgeStatus);
  const data: chatType = useSelector(selectChat);
  const keystore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );
  const triggerBadge = () => {
    dispatch(setBadgeStatus({ ...alertbadge, trigger: !alertbadge.trigger }));
  };

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
      console.log("message-posted", message);
      if (
        message.sender_id === currentpartner._id &&
        message.recipient_id === account.uid
      ) {
        if (data.message === "anyone") {
          const updatedHistory = [message, ...chatHistoryStore.messages];
          dispatch(setChatHistory({ messages: updatedHistory }));
        } else if (data.message === "friend" && senderInChatFriendlist) {
          console.log("senderInChatFriendlist", senderInChatFriendlist);
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
              const key = useSelector((state) =>
                selectEncryptionKeyByUserId(state, message.sender_id)
              );
              const decryptedmessage = await decrypt(message.message, key);
              {
                notification.alert && setNotificationOpen(true);
                setNotificationStatus("message");
                setNotificationTitle(senderName);
                setNotificationDetail(decryptedmessage);
                setNotificationLink(`/chat?senderId=${message.sender_id}`);
              }
            } else {
              const senderName = senderInChatUserlist.nickName;
              const key = useSelector((state) =>
                selectEncryptionKeyByUserId(state, message.sender_id)
              );
              const decryptedmessage = await decrypt(message.message, key);
              {
                notification.alert && setNotificationOpen(true);
                setNotificationStatus("message");
                setNotificationTitle(senderName);
                setNotificationDetail(decryptedmessage);
                setNotificationLink(`/chat?senderId=${message.sender_id}`);
              }
            }
          }
          if (data.message === "friend") {
            if (senderInChatFriendlist) {
              const senderName = senderInChatFriendlist.nickName;
              const key = useSelector((state) =>
                selectEncryptionKeyByUserId(state, message.sender_id)
              );
              const decryptedmessage = await decrypt(message.message, key);
              setNotificationOpen(true);
              setNotificationStatus("message");
              setNotificationTitle(senderName);
              setNotificationDetail(decryptedmessage);
              setNotificationLink(`/chat?senderId=${message.sender_id}`);
            }
          }
        } else {
        }
      };

      handleIncomingMessages();
    });
    socket.on("alert-posted", (alert: alertType) => {
      console.log("alert-posted", alert);
      console.log("receiver", alert.receivers[0]);
      console.log("my id", account.uid);
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

    socket.on("alert-updated", (alert: alertType) => {
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

    // receive request for  encryption key and generate/send encryption key to partner
    socket.on("ask-encryption-key", (data: askEncryptionKeyType) => {
      console.log("receiving encryption key request--->", data);
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
        dispatch(addEncryptionKey({ userid, key }));

    });
    // receive encryption key from partner
    socket.on("deliver-encryption-key", (data: deliverEncryptionKeyType) => {
      console.log("encryption-key delievery--->", data);
      const userid = data.sender_id;
      const encryptionkey = data.key;
      const existkey = useSelector((state) =>
        selectEncryptionKeyByUserId(state, userid)
      );
      if (!existkey) {
        dispatch(addEncryptionKey({ userid, encryptionkey }));
      }
    });
    return () => {
      socket.off("connect");
      socket.off("message-posted");
      socket.off("alert-posted");
      socket.off("alert-updated");
      // socket.off("ask-encryption-key");
      socket.off("deliver-encryption-key");
    };
  }, [socket, data, chatHistoryStore, chatuserlist, chatfriendlist, keystore]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ChatProvider;
