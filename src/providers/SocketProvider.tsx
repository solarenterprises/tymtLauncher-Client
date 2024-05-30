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

  const chatHistoryStoreRef = useRef(chatHistoryStore);

  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    if (accountStore.uid && socketHashStore.socketHash) {
      socket.current = io(socket_backend_url as string, {
        auth: {
          userId: accountStore.uid,
          socket_hash: socketHashStore.socketHash,
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
              const senderInChatUserlist = chatUserListStore.find(
                (user) => user._id === senderId
              );
              const senderInChatFriendlist = chatFriendListStore.find(
                (user) => user._id === senderId
              );
              if (
                message.sender_id === currentPartnerStore._id &&
                message.recipient_id === accountStore.uid
              ) {
                console.log("message reception", chatStore.message);
                if (chatStore.message === "anyone") {
                  const prev = [...chatHistoryStore.messages];
                  prev.unshift(message);
                  dispatch(setChatHistory({ messages: prev }));
                } else if (
                  chatStore.message === "friend" &&
                  senderInChatFriendlist
                ) {
                  console.log("senderInChatFriendlist", senderInChatFriendlist);
                  const updatedHistory = [
                    message,
                    ...chatHistoryStore.messages,
                  ];
                  dispatch(setChatHistory({ messages: updatedHistory }));
                } else {
                }
              } else {
              }
              console.log("handleIncomingMessages");
              if (message.recipient_id === accountStore.uid) {
                if (chatStore.message === "anyone") {
                  console.log("messagereception", chatStore.message);
                  if (!senderInChatUserlist) {
                    const senderName = await getsenderName(message.sender_id);
                    await createContact(message.sender_id);
                    const contacts: userType[] = await receiveContactlist();
                    dispatch(setUserList(contacts));

                    setNotificationOpen(true);
                    setNotificationStatus("message");
                    setNotificationTitle(senderName);
                    setNotificationDetail(message.message);
                    setNotificationLink(`/chat?senderId=${message.sender_id}`);
                  } else {
                    const senderName = senderInChatUserlist.nickName;

                    setNotificationOpen(true);
                    setNotificationStatus("message");
                    setNotificationTitle(senderName);
                    setNotificationDetail(message.message);
                    setNotificationLink(`/chat?senderId=${message.sender_id}`);
                  }
                } else if (chatStore.message === "friend") {
                  console.log("messagereception", chatStore.message);
                  if (senderInChatFriendlist) {
                    const senderName = senderInChatFriendlist.nickName;

                    setNotificationOpen(true);
                    setNotificationStatus("message");
                    setNotificationTitle(senderName);
                    setNotificationDetail(message.message);
                    setNotificationLink(`/chat?senderId=${message.sender_id}`);
                  }
                } else {
                }
              } else {
                console.log("messagereception", chatStore.message);
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
                  chatStore.friend === "anyone" &&
                  alert.receivers[0] === accountStore.uid
                ) {
                  const senderId = alert.note?.sender;
                  const senderInChatUserlist = chatUserListStore.find(
                    (user) => user._id === senderId
                  );
                  console.log("senderInChatuserlist", senderInChatUserlist);
                  console.log("senderId", alert.note.sender);
                  if (senderInChatUserlist) {
                    dispatch(
                      setBadgeStatus({
                        ...alertBadgeStore,
                        trigger: !alertBadgeStore.trigger,
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
                          ...alertBadgeStore,
                          trigger: !alertBadgeStore.trigger,
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
                notificationStore.alert &&
                alert.alertType !== "chat" &&
                alert.receivers.find((userid) => userid === accountStore.uid)
              ) {
                dispatch(
                  setBadgeStatus({
                    ...alertBadgeStore,
                    trigger: !alertBadgeStore.trigger,
                  })
                );
                setNotificationOpen(true);
                setNotificationStatus("alert");
                setNotificationTitle(`${alert.alertType}`);
                setNotificationDetail(`${alert.note.detail}`);
                setNotificationLink(null);
              } else if (
                notificationStore.alert &&
                alert.alertType === "chat" &&
                alert.receivers.find((userid) => userid === accountStore.uid)
              ) {
                dispatch(
                  setBadgeStatus({
                    ...alertBadgeStore,
                    trigger: !alertBadgeStore.trigger,
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
                (alert.note.sender === accountStore.uid ||
                  alert.receivers[0] === accountStore.uid)
              ) {
                {
                  if (notificationStore.alert) {
                    dispatch(
                      setBadgeStatus({
                        ...alertBadgeStore,
                        trigger: !alertBadgeStore.trigger,
                      })
                    );
                    setNotificationOpen(true);
                    setNotificationStatus("alert");
                    setNotificationTitle(`Friend request ${alert.note.status}`);
                    setNotificationDetail(`Friend request accepted`);
                    setNotificationLink(null);
                  }
                  if (
                    alert.note.sender === accountStore.uid &&
                    alert.note.status === "accepted"
                  ) {
                    const senderInChatUserlist = chatUserListStore.find(
                      (user) => user._id === alert.receivers[0]
                    );
                    const updatedFriendlist: userType[] = [
                      ...chatFriendListStore,
                      senderInChatUserlist,
                    ];
                    dispatch(setFriendlist(updatedFriendlist));
                  }
                }
              } else {
                if (
                  notificationStore.alert &&
                  alert.receivers.find((userid) => userid === accountStore.uid)
                ) {
                  dispatch(
                    setBadgeStatus({
                      ...alertBadgeStore,
                      trigger: !alertBadgeStore.trigger,
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
              const existkey = encryptionKeyStore.encryption_Keys[userid];
              const key = existkey ? existkey : generateRandomString(32);
              const deliverydata: deliverEncryptionKeyType = {
                sender_id: accountStore.uid,
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
              console.log("socket.current.on > deliver-encryption-key", data);
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
            console.log("socket.current.on > user-online-status-updated", data);
            const handleUpdatedOnlineStatus = async () => {
              const userId = data.userid;
              const userinChatuserlist = chatUserListStore.find(
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

        if (!socket.current.hasListeners("user-notification-status-updated")) {
          socket.current.on(
            "user-notification-status-updated",
            async (data) => {
              console.log(
                "socket.current.on > user-notification-status-updated",
                data
              );
              const handleUpdatedOnlineStatus = async () => {
                const userId = data.userid;
                const userinChatuserlist = chatUserListStore.find(
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

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [accountStore.uid, socketHashStore.socketHash, chatHistoryStore]);

  // const socket: Socket = io(socket_backend_url as string, {
  //   auth: { userId: accountStore.uid, socket_hash: socketHashStore.socketHash },
  // });

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
