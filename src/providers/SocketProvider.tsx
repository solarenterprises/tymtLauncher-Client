import { MutableRefObject, createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { appWindow } from "@tauri-apps/api/window";
import { io, Socket } from "socket.io-client";

import { socket_backend_url } from "../configs";

import { useNotification } from "./NotificationProvider";

import { AppDispatch } from "../store";
import { getAccount } from "../features/account/AccountSlice";
import { getCurrentChatroom } from "../features/chat/CurrentChatroomSlice";
import { getCurrentPartner } from "../features/chat/CurrentPartnerSlice";
import { createContactAsync, getContactList, updateOneInContactList } from "../features/chat/ContactListSlice";
import { addOneToUnreadList, updateFriendRequestAsync } from "../features/alert/AlertListSlice";
import { getBlockList } from "../features/chat/BlockListSlice";
import { addOneToChatroomListAsync, getChatroomList, leaveGroupAsync } from "../features/chat/ChatroomListSlice";
import { selectNotification } from "../features/settings/NotificationSlice";
import { selectEncryptionKeyStore } from "../features/chat/Chat-encryptionkeySlice";
import { createFriendAsync, getFriendList } from "../features/chat/FriendListSlice";
import { selectChat } from "../features/settings/ChatSlice";
import { setChatHistory, getChatHistory } from "../features/chat/Chat-historySlice";
import { getSocketHash } from "../features/chat/SocketHashSlice";

import { IChatroom, IChatroomList, IParamsLeaveGroup } from "../types/ChatroomAPITypes";
import { ISocketParamsJoinedMessageGroup, ISocketParamsLeftMessageGroup, ISocketParamsPostMessage } from "../types/SocketTypes";
import { accountType } from "../types/accountTypes";
import { chatType, notificationType } from "../types/settingTypes";
import { ChatHistoryType, ISocketHash, IAlert, encryptionkeyStoreType, IContact, IContactList } from "../types/chatTypes";

interface SocketContextType {
  socket: MutableRefObject<Socket>;
  approveFriendRequest: (alert: IAlert) => void;
  declineFriendRequest: (alert: IAlert) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
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
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const chatStore: chatType = useSelector(selectChat);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const notificationStore: notificationType = useSelector(selectNotification);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(selectEncryptionKeyStore);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);

  const accountStoreRef = useRef(accountStore);
  const socketHashStoreRef = useRef(socketHashStore);
  const contactListStoreRef = useRef(contactListStore);
  const friendListStoreRef = useRef(friendListStore);
  const blockListStoreRef = useRef(blockListStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const currentChatroomStoreRef = useRef(currentChatroomStore);
  const chatStoreRef = useRef(chatStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const notificationStoreRef = useRef(notificationStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);
  const chatroomListStoreRef = useRef(chatroomListStore);

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
    currentChatroomStoreRef.current = currentChatroomStore;
  }, [currentChatroomStore]);
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
  useEffect(() => {
    chatroomListStoreRef.current = chatroomListStore;
  }, [chatroomListStore]);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    if (accountStore.uid && socketHashStore.socketHash) {
      appWindow.title().then((res) => {
        if (res === "tymtLauncherDebug 2.1.2") {
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
              socket.current.on("message-posted", async (data: ISocketParamsPostMessage) => {
                console.log("socket.current.on > message-posted");

                const senderId = data.sender_id;
                const senderInBlockList = blockListStoreRef.current.contacts.find((user) => user._id === senderId);
                const senderInContactList = contactListStoreRef.current.contacts.find((user) => user._id === senderId);
                const senderInFriendlist = friendListStoreRef.current.contacts.find((user) => user._id === senderId);
                const roomInChatroomList = chatroomListStoreRef.current.chatrooms.find((room) => room._id === data.room_id);

                // Block if the message is from someone in the block list
                if (senderInBlockList) {
                  console.log("Blocked the message from someone in the block list!", data);
                  return;
                }

                // Ignore if the message is from someone not in the contact list or not in the chat room list
                if (!senderInContactList || !roomInChatroomList) {
                  console.log("Ignored the message from a stranger not in the contact list or not in the chat room list!", data);
                  return;
                }

                if (chatStoreRef.current.message === "anyone" || (chatStoreRef.current.message === "friend" && senderInFriendlist)) {
                  if (data.room_id === currentChatroomStoreRef.current._id) {
                    const updatedHistory = [data, ...chatHistoryStoreRef.current.messages];
                    dispatch(
                      setChatHistory({
                        messages: updatedHistory,
                      })
                    );
                  } else {
                    const senderName = senderInContactList.nickName;
                    setNotificationOpen(true);
                    setNotificationStatus("message");
                    setNotificationTitle(senderName);
                    setNotificationDetail(data.message);
                    setNotificationLink(`/chat?senderId=${data.sender_id}`);
                  }
                }
              });
            }

            if (!socket.current.hasListeners("alert-posted")) {
              socket.current.on("alert-posted", async (alert: IAlert) => {
                console.log("socket.current.on > alert-posted");
                // Alert wrong format
                if (!alert || !alert.alertType) {
                  console.error("Alert wrong format!", alert);
                  return;
                }

                const senderId = alert.note?.sender ?? "";
                const senderInBlockList = blockListStoreRef.current.contacts.find((element) => element._id === senderId);
                const senderInContactList = contactListStoreRef.current.contacts.find((element) => element._id === senderId);
                const senderInFriendList = friendListStoreRef.current.contacts.find((element) => element._id === senderId);

                // Block if the alert is from someone in the block list
                if (senderInBlockList) {
                  console.log("Blocked the alert from someone in the block list!", alert);
                  return;
                }

                // Ignore if the alert is from someone not in the contact list or not in the chat room list
                if (!senderInContactList) {
                  console.log("Ignored the alert from a stranger not in the contact list or not in the chat room list!", alert);
                  return;
                }

                // Friend request alert
                if (alert.alertType === "friend-request") {
                  if (senderInFriendList) {
                    console.log("Sender is already in my friend list!");
                    return;
                  }
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle("Friend Request");
                  setNotificationDetail(alert.note?.detail ?? "");
                  setNotificationLink(null);
                }
                // General alert
                else if (alert.alertType !== "chat") {
                  dispatch(addOneToUnreadList(alert));
                  setNotificationOpen(true);
                  setNotificationStatus("alert");
                  setNotificationTitle(`${alert.alertType}`);
                  setNotificationDetail(`${alert.note.detail}`);
                  setNotificationLink(null);
                }
                // Chat alert
                else if (alert.alertType === "chat") {
                  dispatch(addOneToUnreadList(alert));
                }
              });
            }

            if (!socket.current.hasListeners("joined-message-group")) {
              socket.current.on("joined-message-group", async (data: ISocketParamsJoinedMessageGroup) => {
                console.log("socket.current.on > joined-message-group", data);

                const { room_id } = data;
                dispatch(addOneToChatroomListAsync(room_id)).then((action) => {
                  if (action.type.endsWith("/fulfilled")) {
                    const newAddedChatroom = action.payload as IChatroom;

                    if (!newAddedChatroom.room_name) {
                      const partner = newAddedChatroom.participants.find((participant) => participant.userId !== accountStoreRef.current.uid);
                      dispatch(createContactAsync(partner.userId));
                    }
                  }
                });
              });
            }

            if (!socket.current.hasListeners("left-message-group")) {
              socket.current.on("left-message-group", async (data: ISocketParamsLeftMessageGroup) => {
                console.log("socket.current.on > left-message-group", data);

                const { room_id } = data;
                const data_2: IParamsLeaveGroup = {
                  _userId: accountStoreRef.current.uid,
                  _groupId: room_id,
                };
                dispatch(leaveGroupAsync(data_2));
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
        approveFriendRequest,
        declineFriendRequest,
      }}
    >
      <Outlet />
    </SocketContext.Provider>
  );
};
