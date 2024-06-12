import { MutableRefObject, createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket_backend_url } from "../configs";
import { io, Socket } from "socket.io-client";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import {
  ChatHistoryType,
  ChatMessageType,
  ISocketHash,
  IAlert,
  askEncryptionKeyType,
  deliverEncryptionKeyType,
  deliveredEncryptionKeyType,
  encryptionkeyStoreType,
  IContact,
  IContactList,
} from "../types/chatTypes";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../store";
import { createFriendAsync, getFriendList } from "../features/chat/FriendListSlice";
import { selectChat } from "../features/settings/ChatSlice";
import { chatType, notificationType } from "../types/settingTypes";
import { setChatHistory, getChatHistory } from "../features/chat/Chat-historySlice";
import { useNotification } from "./NotificationProvider";
import { selectNotification } from "../features/settings/NotificationSlice";
import { addEncryptionKey, selectEncryptionKeyStore } from "../features/chat/Chat-encryptionkeySlice";
import { appWindow } from "@tauri-apps/api/window";
import { getCurrentPartner } from "../features/chat/CurrentPartnerSlice";
import { createContactAsync, getContactList, updateOneInContactList } from "../features/chat/ContactListSlice";
import { getsenderName, generateRandomString } from "../features/chat/ContactListApi";
import { addOneToUnreadList, updateFriendRequestAsync } from "../features/alert/AlertListSlice";
import { getBlockList } from "../features/chat/BlockListSlice";

interface SocketContextType {
  socket: MutableRefObject<Socket>;
  askEncryptionKey: (recipientId: string) => void;
  approveFriendRequest: (alert: IAlert) => void;
  declineFriendRequest: (alert: IAlert) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  askEncryptionKey: (_) => {},
  approveFriendRequest: (_) => {},
  declineFriendRequest: (_) => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = () => {
  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const socketHashStore: ISocketHash = useSelector(getSocketHash);
  const contactListStore: IContactList = useSelector(getContactList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const currentPartnerStore: IContact = useSelector(getCurrentPartner);
  const chatStore: chatType = useSelector(selectChat);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const notificationStore: notificationType = useSelector(selectNotification);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(selectEncryptionKeyStore);

  const accountStoreRef = useRef(accountStore);
  const socketHashStoreRef = useRef(socketHashStore);
  const contactListStoreRef = useRef(contactListStore);
  const friendListStoreRef = useRef(friendListStore);
  const blockListStoreRef = useRef(blockListStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const chatStoreRef = useRef(chatStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const notificationStoreRef = useRef(notificationStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    socketHashStoreRef.current = socketHashStore;
  }, [socketHashStore]);
  useEffect(() => {
    contactListStoreRef.current = contactListStore;
  }, [contactListStore]);
  useEffect(() => {
    friendListStoreRef.current = friendListStore;
  }, [friendListStore]);
  useEffect(() => {
    blockListStoreRef.current = blockListStore;
  }, [blockListStore]);
  useEffect(() => {
    currentPartnerStoreRef.current = currentPartnerStore;
  }, [currentPartnerStore]);
  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    notificationStoreRef.current = notificationStore;
  }, [notificationStore]);
  useEffect(() => {
    encryptionKeyStoreRef.current = encryptionKeyStore;
  }, [encryptionKeyStore]);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    if (accountStore.uid && socketHashStore.socketHash) {
      appWindow.title().then((res) => {
        if (res === "tymtLauncher (debug) 2.1.2") {
          socket.current = io(socket_backend_url as string, {
            auth: {
              userId: accountStoreRef.current.uid,
              socket_hash: socketHashStoreRef.current.socketHash,
            },
          });

          if (socket.current) {
            if (!socket.current.hasListeners("connect")) {
              socket.current.on("connect", () => {
                console.log("socket.current.on > connect");
              });
            }

            if (!socket.current.hasListeners("message-posted")) {
              socket.current.on("message-posted", async (message: ChatMessageType) => {
                console.log("socket.current.on > message-posted");
                const senderId = message.sender_id;
                const senderInBlockList = blockListStoreRef.current.contacts.find((user) => user._id === senderId);
                if (senderInBlockList) {
                  console.log("Blocked by the block list!");
                  return;
                }
                const senderInContactList = contactListStoreRef.current.contacts.find((user) => user._id === senderId);
                const senderInFriendlist = friendListStoreRef.current.contacts.find((user) => user._id === senderId);
                if (message.sender_id === currentPartnerStoreRef.current._id) {
                  if (chatStoreRef.current.message === "anyone") {
                    const updatedHistory = [message, ...chatHistoryStoreRef.current.messages];
                    dispatch(
                      setChatHistory({
                        messages: updatedHistory,
                      })
                    );
                  } else if (chatStoreRef.current.message === "friend" && senderInFriendlist) {
                    const updatedHistory = [message, ...chatHistoryStoreRef.current.messages];
                    dispatch(setChatHistory({ messages: updatedHistory }));
                  }
                } else {
                  if (chatStoreRef.current.message === "anyone") {
                    if (!senderInContactList) {
                      const senderName = await getsenderName(message.sender_id);
                      dispatch(createContactAsync(message.sender_id)).then(() => {
                        setNotificationOpen(true);
                        setNotificationStatus("message");
                        setNotificationTitle(senderName);
                        setNotificationDetail(message.message);
                        setNotificationLink(`/chat?senderId=${message.sender_id}`);
                      });
                    } else {
                      const senderName = senderInContactList.nickName;
                      setNotificationOpen(true);
                      setNotificationStatus("message");
                      setNotificationTitle(senderName);
                      setNotificationDetail(message.message);
                      setNotificationLink(`/chat?senderId=${message.sender_id}`);
                    }
                  } else if (chatStoreRef.current.message === "friend") {
                    if (senderInFriendlist) {
                      const senderName = senderInFriendlist.nickName;
                      setNotificationOpen(true);
                      setNotificationStatus("message");
                      setNotificationTitle(senderName);
                      setNotificationDetail(message.message);
                      setNotificationLink(`/chat?senderId=${message.sender_id}`);
                    }
                  }
                }
              });
            }

            if (!socket.current.hasListeners("alert-posted")) {
              socket.current.on("alert-posted", async (alert: IAlert) => {
                console.log("socket.current.on > alert-posted");
                if (!alert || !alert.alertType) {
                  console.error("Alert wrong format!", alert);
                  return;
                }
                const senderId = alert.note?.sender ?? "";
                const senderInBlockList = blockListStoreRef.current.contacts.find((element) => element._id === senderId);
                if (senderInBlockList) {
                  console.log("Blocked by the block list!");
                  return;
                }
                if (alert.alertType === "friend-request") {
                  const senderInContactList = contactListStoreRef.current.contacts.find((element) => element._id === senderId);
                  const senderInFriendList = friendListStoreRef.current.contacts.find((element) => element._id === senderId);
                  if (senderInFriendList) {
                    console.log("Sender is already in my friend list!");
                    return;
                  }
                  if (!senderInContactList) {
                    dispatch(createContactAsync(senderId));
                  }
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle("Friend Request");
                  setNotificationDetail(alert.note?.detail ?? "");
                  setNotificationLink(null);
                } else if (alert.alertType !== "chat") {
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle(`${alert.alertType}`);
                  setNotificationDetail(`${alert.note.detail}`);
                  setNotificationLink(null);
                } else if (alert.alertType === "chat") {
                  dispatch(addOneToUnreadList(alert));
                  const key = encryptionKeyStoreRef.current.encryption_Keys[alert.note?.sender];
                  if (!key) askEncryptionKey(alert.note?.sender);
                }
              });
            }

            if (!socket.current.hasListeners("alert-updated")) {
              socket.current.on("alert-updated", async (alert: IAlert) => {
                console.log("socket.current.on > alert-updated", alert);
                if (alert.alertType === "friend-request") {
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle(`Friend request ${alert.note.status}`);
                  setNotificationDetail(`Friend request accepted`);
                  setNotificationLink(null);
                  if (alert.note?.status && alert.note?.status === "accepted") {
                    const senderInFriendList = friendListStoreRef.current.contacts.find((user) => user._id === alert.receivers[0]);
                    if (senderInFriendList) {
                      console.log("Already in my friend list!");
                      return;
                    }
                    const senderInContactList = contactListStoreRef.current.contacts.find((user) => user._id === alert.receivers[0]);
                    if (!senderInContactList) {
                      console.log("createContactAsync");
                      dispatch(createContactAsync(alert.receivers[0]));
                    }
                    console.log("createFriendAsync");
                    dispatch(createFriendAsync(alert.receivers[0]));
                  }
                } else {
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle(`${alert.alertType}`);
                  setNotificationDetail(`${alert.note.detail}`);
                  setNotificationLink(null);
                }
              });
            }

            if (!socket.current.hasListeners("ask-encryption-key")) {
              socket.current.on("ask-encryption-key", async (data: askEncryptionKeyType) => {
                console.log("socket.current.on > ask-encryption-key", data);
                const userid: string = data.sender_id;
                const existkey = encryptionKeyStoreRef.current.encryption_Keys[userid];
                const key = existkey ? existkey : generateRandomString(32);
                const deliverydata: deliverEncryptionKeyType = {
                  sender_id: accountStoreRef.current.uid,
                  recipient_id: data.sender_id,
                  key: key,
                };
                socket.current.emit("deliver-encryption-key", JSON.stringify(deliverydata));
                dispatch(addEncryptionKey({ userId: userid, encryptionKey: key }));
              });
            }

            if (!socket.current.hasListeners("deliver-encryption-key")) {
              socket.current.on("deliver-encryption-key", async (data: deliveredEncryptionKeyType) => {
                console.log("socket.current.on > deliver-encryption-key", data);
                const userid = data.sender_id;
                const encryptionkey = data.key;
                dispatch(
                  addEncryptionKey({
                    userId: userid,
                    encryptionKey: encryptionkey,
                  })
                );
                socket.current.emit("received-encryption-key", JSON.stringify(data));
              });
            }

            if (!socket.current.hasListeners("user-online-status-updated")) {
              socket.current.on("user-online-status-updated", async (data) => {
                console.log("socket.current.on > user-online-status-updated", data);
                const handleUpdatedOnlineStatus = async () => {
                  const userId = data.userid;
                  const userInChatuserlist = contactListStoreRef.current.contacts.find((user) => user._id === userId);
                  if (userInChatuserlist) {
                    dispatch(updateOneInContactList(data));
                  }
                };
                handleUpdatedOnlineStatus();
              });
            }

            if (!socket.current.hasListeners("user-notification-status-updated")) {
              socket.current.on("user-notification-status-updated", async (data) => {
                console.log("socket.current.on > user-notification-status-updated", data);
                const handleUpdatedOnlineStatus = async () => {
                  const userId = data.userid;
                  const userInChatuserlist = contactListStoreRef.current.contacts.find((user) => user._id === userId);
                  if (userInChatuserlist) {
                    dispatch(updateOneInContactList(data));
                  }
                };
                handleUpdatedOnlineStatus();
              });
            }
          }
        }
      });
    }

    return () => {
      if (socket.current && socket.current.connected) {
        socket.current.disconnect();
      }
    };
  }, [accountStore.uid, socketHashStore.socketHash]);

  const askEncryptionKey = useCallback(
    async (recipientId: string) => {
      try {
        if (encryptionKeyStore.encryption_Keys[recipientId]) return;
        if (!socket.current) {
          console.error("Failed to askEncryptionKey: socket.current undefined");
          return;
        }
        const askData: askEncryptionKeyType = {
          sender_id: accountStore.uid,
          recipient_id: recipientId,
        };
        socket.current.emit("ask-encryption-key", JSON.stringify(askData));
        console.log("askEncryptionKey");
      } catch (err) {
        console.error("Failed to askEncryptionKey: ", err);
      }
    },
    [accountStore, encryptionKeyStore]
  );

  const approveFriendRequest = useCallback(
    (alert: IAlert) => {
      try {
        console.log("approveFriendRequest");
        if (socket.current && socket.current.connected) {
          const data = {
            alertType: "friend-request",
            note: { sender: accountStore.uid, status: "accepted" },
            receivers: [alert.note.sender],
          };
          socket.current.emit("post-alert", JSON.stringify(data));
          // To avoid spam
          dispatch(updateFriendRequestAsync({ alertId: alert._id, status: "accepted" })).then(() => {
            dispatch(createContactAsync(alert.note.sender)).then(() => {
              dispatch(createFriendAsync(alert.note.sender));
            });
          });
        }
      } catch (err) {
        console.error("Failed to approveFriendRequest: ", err);
      }
    },
    [accountStore]
  );

  const declineFriendRequest = useCallback(
    (alert: IAlert) => {
      try {
        console.log("declineFriendRequest");
        if (socket.current && socket.current.connected) {
          const data = {
            alertType: "friend-request",
            note: { sender: accountStore.uid, status: "rejected" },
            receivers: [alert.note.sender],
          };
          socket.current.emit("post-alert", JSON.stringify(data));
          dispatch(updateFriendRequestAsync({ alertId: alert._id, status: "rejected" }));
        }
      } catch (err) {
        console.error("Failed to declineFriendRequest: ", err);
      }
    },
    [accountStore]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        askEncryptionKey,
        approveFriendRequest,
        declineFriendRequest,
      }}
    >
      <Outlet />
    </SocketContext.Provider>
  );
};
