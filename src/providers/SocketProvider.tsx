import {
  MutableRefObject,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket_backend_url } from "../configs";
import { io, Socket } from "socket.io-client";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import {
  ChatHistoryType,
  ChatMessageType,
  ISocketHash,
  alertType,
  askEncryptionKeyType,
  deliverEncryptionKeyType,
  deliveredEncryptionKeyType,
  encryptionkeyStoreType,
  userType,
} from "../types/chatTypes";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../store";
import { getUserlist, setUserList } from "../features/chat/Chat-userlistSlice";
import {
  getFriendlist,
  setFriendlist,
} from "../features/chat/Chat-friendlistSlice";
import { selectPartner } from "../features/chat/Chat-currentPartnerSlice";
import { selectChat } from "../features/settings/ChatSlice";
import { chatType, notificationType } from "../types/settingTypes";
import {
  setChatHistory,
  getChatHistory,
} from "../features/chat/Chat-historySlice";
import {
  createContact,
  generateRandomString,
  getsenderName,
  receiveContactlist,
} from "../features/chat/Chat-contactApi";
import { useNotification } from "./NotificationProvider";
import { selectNotification } from "../features/settings/NotificationSlice";
import {
  selectBadgeStatus,
  setBadgeStatus,
} from "../features/alert/AlertbadgeSlice";
import { alertbadgeType } from "../types/alertTypes";
import {
  addEncryptionKey,
  selectEncryptionKeyStore,
} from "../features/chat/Chat-encryptionkeySlice";
import { appWindow } from "@tauri-apps/api/window";

const SocketContext = createContext<
  { socket: MutableRefObject<Socket> } | undefined
>(undefined);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = () => {
  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const socketHashStore: ISocketHash = useSelector(getSocketHash);
  const chatUserListStore: userType[] = useSelector(getUserlist);
  const chatFriendListStore: userType[] = useSelector(getFriendlist);
  const currentPartnerStore: userType = useSelector(selectPartner);
  const chatStore: chatType = useSelector(selectChat);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const notificationStore: notificationType = useSelector(selectNotification);
  const alertBadgeStore: alertbadgeType = useSelector(selectBadgeStatus);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  const accountStoreRef = useRef(accountStore);
  const socketHashStoreRef = useRef(socketHashStore);
  const chatUserListStoreRef = useRef(chatUserListStore);
  const chatFriendListStoreRef = useRef(chatFriendListStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const chatStoreRef = useRef(chatStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const notificationStoreRef = useRef(notificationStore);
  const alertBadgeStoreRef = useRef(alertBadgeStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    socketHashStoreRef.current = socketHashStore;
  }, [socketHashStore]);
  useEffect(() => {
    chatUserListStoreRef.current = chatUserListStore;
  }, [chatUserListStore]);
  useEffect(() => {
    chatFriendListStoreRef.current = chatFriendListStore;
  }, [chatFriendListStore]);
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
    alertBadgeStoreRef.current = alertBadgeStore;
  }, [alertBadgeStore]);
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
              socket.current.on(
                "message-posted",

                async (message: ChatMessageType) => {
                  console.log("socket.on > message-posted");
                  const senderId = message.sender_id;
                  const senderInChatUserlist =
                    chatUserListStoreRef.current.find(
                      (user) => user._id === senderId
                    );
                  const senderInChatFriendlist =
                    chatFriendListStoreRef.current.find(
                      (user) => user._id === senderId
                    );
                  if (
                    message.sender_id === currentPartnerStoreRef.current._id &&
                    message.recipient_id === accountStoreRef.current.uid
                  ) {
                    console.log(
                      "message reception",
                      chatStoreRef.current.message
                    );
                    if (chatStoreRef.current.message === "anyone") {
                      const updatedHistory = [
                        message,
                        ...chatHistoryStoreRef.current.messages,
                      ];
                      dispatch(
                        setChatHistory({
                          messages: updatedHistory,
                        })
                      );
                    } else if (
                      chatStoreRef.current.message === "friend" &&
                      senderInChatFriendlist
                    ) {
                      console.log(
                        "senderInChatFriendlist",
                        senderInChatFriendlist
                      );
                      const updatedHistory = [
                        message,
                        ...chatHistoryStoreRef.current.messages,
                      ];
                      dispatch(setChatHistory({ messages: updatedHistory }));
                    } else {
                    }
                  } else {
                  }
                  console.log("handleIncomingMessages");
                  if (message.recipient_id === accountStoreRef.current.uid) {
                    if (chatStoreRef.current.message === "anyone") {
                      console.log(
                        "messagereception",
                        chatStoreRef.current.message
                      );
                      if (!senderInChatUserlist) {
                        const senderName = await getsenderName(
                          message.sender_id
                        );
                        await createContact(message.sender_id);
                        const contacts: userType[] = await receiveContactlist();
                        dispatch(setUserList(contacts));

                        setNotificationOpen(true);
                        setNotificationStatus("message");
                        setNotificationTitle(senderName);
                        setNotificationDetail(message.message);
                        setNotificationLink(
                          `/chat?senderId=${message.sender_id}`
                        );
                      } else {
                        const senderName = senderInChatUserlist.nickName;

                        setNotificationOpen(true);
                        setNotificationStatus("message");
                        setNotificationTitle(senderName);
                        setNotificationDetail(message.message);
                        setNotificationLink(
                          `/chat?senderId=${message.sender_id}`
                        );
                      }
                    } else if (chatStoreRef.current.message === "friend") {
                      console.log(
                        "messagereception",
                        chatStoreRef.current.message
                      );
                      if (senderInChatFriendlist) {
                        const senderName = senderInChatFriendlist.nickName;

                        setNotificationOpen(true);
                        setNotificationStatus("message");
                        setNotificationTitle(senderName);
                        setNotificationDetail(message.message);
                        setNotificationLink(
                          `/chat?senderId=${message.sender_id}`
                        );
                      }
                    } else {
                    }
                  } else {
                    console.log(
                      "messagereception",
                      chatStoreRef.current.message
                    );
                  }
                }
              );
            }

            if (!socket.current.hasListeners("alert-posted")) {
              socket.current.on("alert-posted", async (alert: alertType) => {
                console.log("socket.current.on > alert-posted", alert);
                const handleIncomingRequest = async () => {
                  if (alert.alertType === "friend-request") {
                    if (
                      chatStoreRef.current.friend === "anyone" &&
                      alert.receivers[0] === accountStore.uid
                    ) {
                      const senderId = alert.note?.sender;
                      const senderInChatUserlist =
                        chatUserListStoreRef.current.find(
                          (user) => user._id === senderId
                        );
                      console.log("senderInChatuserlist", senderInChatUserlist);
                      console.log("senderId", alert.note.sender);
                      if (senderInChatUserlist) {
                        dispatch(
                          setBadgeStatus({
                            ...alertBadgeStoreRef.current,
                            trigger: !alertBadgeStoreRef.current.trigger,
                          })
                        );
                        setNotificationOpen(true);
                        setNotificationStatus("alert");
                        setNotificationTitle("Friend Request");
                        setNotificationDetail(alert);
                        setNotificationLink(null);
                      } else {
                        await createContact(senderId);
                        const contacts: userType[] = await receiveContactlist();
                        dispatch(setUserList(contacts));
                        {
                          dispatch(
                            setBadgeStatus({
                              ...alertBadgeStoreRef.current,
                              trigger: !alertBadgeStoreRef.current.trigger,
                            })
                          );
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
                      (userid) => userid === accountStore.uid
                    )
                  ) {
                    dispatch(
                      setBadgeStatus({
                        ...alertBadgeStoreRef.current,
                        trigger: !alertBadgeStoreRef.current.trigger,
                      })
                    );
                    setNotificationOpen(true);
                    setNotificationStatus("alert");
                    setNotificationTitle(`${alert.alertType}`);
                    setNotificationDetail(`${alert.note.detail}`);
                    setNotificationLink(null);
                  } else if (
                    notificationStoreRef.current.alert &&
                    alert.alertType === "chat" &&
                    alert.receivers.find(
                      (userid) => userid === accountStore.uid
                    )
                  ) {
                    dispatch(
                      setBadgeStatus({
                        ...alertBadgeStoreRef.current,
                        trigger: !alertBadgeStoreRef.current.trigger,
                      })
                    );
                  }
                };
                handleIncomingRequest();
              });
            }

            if (!socket.current.hasListeners("alert-updated")) {
              socket.current.on("alert-updated", async (alert: alertType) => {
                console.log("socket.current.on > alert-updated", alert);
                const handleIncomingUpdatedAlert = () => {
                  if (
                    alert.alertType === "friend-request" &&
                    (alert.note.sender === accountStoreRef.current.uid ||
                      alert.receivers[0] === accountStoreRef.current.uid)
                  ) {
                    {
                      if (notificationStoreRef.current.alert) {
                        dispatch(
                          setBadgeStatus({
                            ...alertBadgeStoreRef.current,
                            trigger: !alertBadgeStoreRef.current.trigger,
                          })
                        );
                        setNotificationOpen(true);
                        setNotificationStatus("alert");
                        setNotificationTitle(
                          `Friend request ${alert.note.status}`
                        );
                        setNotificationDetail(`Friend request accepted`);
                        setNotificationLink(null);
                      }
                      if (
                        alert.note.sender === accountStoreRef.current.uid &&
                        alert.note.status === "accepted"
                      ) {
                        const senderInChatUserlist =
                          chatUserListStoreRef.current.find(
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
                      dispatch(
                        setBadgeStatus({
                          ...alertBadgeStoreRef.current,
                          trigger: !alertBadgeStoreRef.current.trigger,
                        })
                      );
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
            }

            if (!socket.current.hasListeners("ask-encryption-key")) {
              socket.current.on(
                "ask-encryption-key",
                async (data: askEncryptionKeyType) => {
                  console.log("socket.current.on > ask-encryption-key", data);
                  const userid: string = data.sender_id;
                  const existkey =
                    encryptionKeyStoreRef.current.encryption_Keys[userid];
                  const key = existkey ? existkey : generateRandomString(32);
                  const deliverydata: deliverEncryptionKeyType = {
                    sender_id: accountStoreRef.current.uid,
                    recipient_id: data.sender_id,
                    key: key,
                  };
                  socket.current.emit(
                    "deliver-encryption-key",
                    JSON.stringify(deliverydata)
                  );
                  dispatch(
                    addEncryptionKey({ userId: userid, encryptionKey: key })
                  );
                }
              );
            }

            if (!socket.current.hasListeners("deliver-encryption-key")) {
              socket.current.on(
                "deliver-encryption-key",
                async (data: deliveredEncryptionKeyType) => {
                  console.log(
                    "socket.current.on > deliver-encryption-key",
                    data
                  );
                  const userid = data.sender_id;
                  const encryptionkey = data.key;
                  dispatch(
                    addEncryptionKey({
                      userId: userid,
                      encryptionKey: encryptionkey,
                    })
                  );
                  socket.current.emit(
                    "received-encryption-key",
                    JSON.stringify(data)
                  );
                }
              );
            }

            if (!socket.current.hasListeners("user-online-status-updated")) {
              socket.current.on("user-online-status-updated", async (data) => {
                console.log(
                  "socket.current.on > user-online-status-updated",
                  data
                );
                const handleUpdatedOnlineStatus = async () => {
                  const userId = data.userid;
                  const userinChatuserlist = chatUserListStoreRef.current.find(
                    (user) => user._id === userId
                  );
                  if (userinChatuserlist) {
                    dispatch(
                      setUserList({
                        ...userinChatuserlist,
                        onlineStatus: data.status,
                      })
                    );
                  }
                };
                handleUpdatedOnlineStatus();
              });
            }

            if (
              !socket.current.hasListeners("user-notification-status-updated")
            ) {
              socket.current.on(
                "user-notification-status-updated",
                async (data) => {
                  console.log(
                    "socket.current.on > user-notification-status-updated",
                    data
                  );
                  const handleUpdatedOnlineStatus = async () => {
                    const userId = data.userid;
                    const userinChatuserlist =
                      chatUserListStoreRef.current.find(
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
                }
              );
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

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      <Outlet />
    </SocketContext.Provider>
  );
};
