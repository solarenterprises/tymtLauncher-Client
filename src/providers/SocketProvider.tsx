import { MutableRefObject, createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { appWindow } from "@tauri-apps/api/window";
import { io, Socket } from "socket.io-client";

import { socket_backend_url, tymt_version } from "../configs";

import { useNotification } from "./NotificationProvider";

import { AppDispatch } from "../store";
import { getAccount } from "../features/account/AccountSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../features/chat/CurrentChatroomSlice";
import { getCurrentPartner } from "../features/chat/CurrentPartnerSlice";
import { createContactAsync, getContactList, updateOneInContactList } from "../features/chat/ContactListSlice";
import { addOneToUnreadList, fetchAlertListAsync, updateFriendRequestInAlertList } from "../features/alert/AlertListSlice";
import { getBlockList } from "../features/chat/BlockListSlice";
import { addOneToChatroomListAsync, delOneFromChatroomList, getChatroomList } from "../features/chat/ChatroomListSlice";
import { selectNotification } from "../features/settings/NotificationSlice";
import { fetchFriendListAsync, getFriendList } from "../features/chat/FriendListSlice";
import { selectChat } from "../features/settings/ChatSlice";
import { setChatHistory, getChatHistory } from "../features/chat/ChatHistorySlice";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { fetchCurrentChatroomMembersAsync, setCurrentChatroomMembers } from "../features/chat/CurrentChatroomMembersSlice";
import { ISKey, ISKeyList, addOneSKeyList, delOneSkeyList, getSKeyList } from "../features/chat/SKeyListSlice";
import { getRsa } from "../features/chat/RsaSlice";
import { addOneActiveUserList, delOneActiveUserList, setActiveUserList } from "../features/chat/ActiveUserListSlice";
import { getMutedList } from "../features/chat/MutedListSlice";
import { getMachineId } from "../features/account/MachineIdSlice";
import { rsaDecrypt } from "../features/chat/RsaApi";

import { IChatroom, IChatroomList } from "../types/ChatroomAPITypes";
import { ISocketParamsActiveUsers, ISocketParamsJoinedMessageGroup, ISocketParamsLeftMessageGroup, ISocketParamsPostMessage } from "../types/SocketTypes";
import { accountType, IMachineId } from "../types/accountTypes";
import { chatType, notificationType } from "../types/settingTypes";
import { ChatHistoryType, ISocketHash, IAlert, IContact, IContactList, IRsa } from "../types/chatTypes";

import { Chatdecrypt } from "../lib/api/ChatEncrypt";

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
  const { t } = useTranslation();

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
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const rsaStore: IRsa = useSelector(getRsa);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);
  const mutedListStore: IChatroomList = useSelector(getMutedList);
  const machineIdStore: IMachineId = useSelector(getMachineId);

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
  const chatroomListStoreRef = useRef(chatroomListStore);
  const rsaStoreRef = useRef(rsaStore);
  const sKeyListStoreRef = useRef(sKeyListStore);
  const mutedListStoreRef = useRef(mutedListStore);
  const machineIdStoreRef = useRef(machineIdStore);

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
    chatroomListStoreRef.current = chatroomListStore;
  }, [chatroomListStore]);
  useEffect(() => {
    rsaStoreRef.current = rsaStore;
  }, [rsaStore]);
  useEffect(() => {
    sKeyListStoreRef.current = sKeyListStore;
  }, [sKeyListStore]);
  useEffect(() => {
    mutedListStoreRef.current = mutedListStore;
  }, [mutedListStore]);
  useEffect(() => {
    machineIdStoreRef.current = machineIdStore;
  }, [machineIdStore]);

  const socket = useRef<Socket>(null);

  useEffect(() => {
    if (accountStore.uid && socketHashStore.socketHash) {
      appWindow.title().then((res) => {
        if (res === `tymtLauncher ${tymt_version}`) {
          socket.current = io(socket_backend_url as string, {
            auth: {
              userId: accountStoreRef.current.uid,
              socketHash: socketHashStoreRef.current.socketHash,
              deviceId: machineIdStoreRef.current.machineId,
            },
          });

          if (socket.current) {
            if (!socket.current.hasListeners("connect")) {
              socket.current.on("connect", () => {
                console.log("socket.current.on > connect");
                socket.current.emit("get-active-users");
                console.log("socket.current.emit > get-active-users");
              });
            }

            if (!socket.current.hasListeners("message-posted")) {
              socket.current.on("message-posted", async (data: ISocketParamsPostMessage) => {
                console.log("socket.current.on > message-posted", data);

                const senderId = data.sender_id;
                const senderInBlockList = blockListStoreRef.current.contacts.find((user) => user._id === senderId);
                const senderInContactList = contactListStoreRef.current.contacts.find((user) => user._id === senderId);
                const senderInFriendlist = friendListStoreRef.current.contacts.find((user) => user._id === senderId);
                const roomInChatroomList = chatroomListStoreRef.current.chatrooms.find((room) => room._id === data.room_id);
                const roomInMutedList = mutedListStoreRef.current.chatrooms.some((room) => room._id === data.room_id);

                // Block if the message is from someone in the block list
                if (senderInBlockList || !roomInChatroomList) {
                  console.log("Blocked the message from someone in the block list or from an unknown chat room!", data);
                  return;
                }

                if (chatStoreRef.current.message === "anyone" || (chatStoreRef.current.message === "friend" && senderInFriendlist)) {
                  if (data.room_id === currentChatroomStoreRef.current?._id) {
                    const updatedHistory = [data, ...chatHistoryStoreRef.current.messages];
                    dispatch(
                      setChatHistory({
                        messages: updatedHistory,
                      })
                    );
                  } else {
                    const senderName = senderInContactList?.nickName;
                    const roomName = roomInChatroomList?.room_name;
                    const sKey = sKeyListStoreRef.current.sKeys.find((element) => element.roomId === data.room_id)?.sKey;
                    const decryptedMessage = sKey ? Chatdecrypt(data.message, sKey) : data.message;
                    if (!roomInMutedList) {
                      setNotificationOpen(true);
                      setNotificationStatus("message");
                      setNotificationTitle(senderName ? senderName : roomName);
                      setNotificationDetail(decryptedMessage);
                      setNotificationLink(`/chat?senderId=${data.sender_id}`);
                    }
                  }
                }
              });
            }

            if (!socket.current.hasListeners("alert-posted")) {
              socket.current.on("alert-posted", async (alert: IAlert) => {
                console.log("socket.current.on > alert-posted", alert);
                // Alert wrong format
                if (!alert || !alert.alertType) {
                  console.error("Alert wrong format!", alert);
                  return;
                }

                const senderId = alert.note?.sender ?? "";
                const senderInBlockList = blockListStoreRef.current.contacts.find((element) => element._id === senderId);
                const senderInFriendList = friendListStoreRef.current.contacts.find((element) => element._id === senderId);

                // Block if the alert is from someone in the block list
                if (senderInBlockList) {
                  console.log("Blocked the alert from someone in the block list!", alert);
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
                  setNotificationTitle(t("not-9_friend-request"));
                  setNotificationDetail(t("not-10_fr-intro"));
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

            if (!socket.current.hasListeners("alert-updated")) {
              socket.current.on("alert-udpated", async (alert: IAlert) => {
                console.log("socket.current.on > alert-udpated", alert);
                // if (alert.alertType === "friend-request") {
                //   // Update the friend lists of both him and me
                //   dispatch(fetchFriendListAsync());
                //   if (alert.note.to === accountStoreRef.current.uid) {
                //     // If I accepted the friend request, synchronize the alert lists of all my other login sessions
                //     dispatch(fetchAlertListAsync(accountStoreRef.current.uid));
                //     return;
                //   }
                //   setNotificationOpen(true);
                //   setNotificationStatus("alert");
                //   setNotificationTitle(t("not-9_friend-request"));
                //   setNotificationDetail(alert.note.status === "accepted" ? t("not-11_fr-accept") : t("not-12_fr-reject"));
                //   setNotificationLink(null);
                // }
              });
            }

            if (!socket.current.hasListeners("friend-request-accepted")) {
              socket.current.on("friend-request-accepted", async (alert: IAlert) => {
                console.log("socket.current.on > friend-request-accepted", alert);
                dispatch(fetchAlertListAsync(accountStoreRef.current.uid));
                dispatch(fetchFriendListAsync());
              });
            }

            if (!socket.current.hasListeners("friend-request-rejected")) {
              socket.current.on("friend-request-rejected", async (alert: IAlert) => {
                console.log("socket.current.on > friend-request-rejected", alert);
                dispatch(fetchAlertListAsync(accountStoreRef.current.uid));
                dispatch(fetchFriendListAsync());
              });
            }

            if (!socket.current.hasListeners("joined-message-group")) {
              socket.current.on("joined-message-group", async (data: ISocketParamsJoinedMessageGroup) => {
                console.log("socket.current.on > joined-message-group", data);
                try {
                  const { room_id, joined_user_id } = data;

                  dispatch(addOneToChatroomListAsync(room_id)).then((action) => {
                    if (action.type.endsWith("/fulfilled")) {
                      const newAddedChatroom = action.payload as IChatroom;

                      if (joined_user_id === accountStoreRef.current.uid) {
                        const newSkey: ISKey = {
                          roomId: newAddedChatroom._id,
                          sKey: rsaDecrypt(
                            newAddedChatroom.participants.find((participant) => participant.userId === accountStoreRef.current.uid).userKey,
                            rsaStoreRef.current.privateKey
                          ),
                        };
                        dispatch(addOneSKeyList(newSkey));

                        // Create the contact when invited to a new DM with a new partner
                        if (!newAddedChatroom.room_name) {
                          const partner = newAddedChatroom.participants.find((participant) => participant.userId !== accountStoreRef.current.uid);
                          if (!contactListStoreRef.current.contacts.some((contact) => contact._id === partner.userId)) {
                            dispatch(createContactAsync(partner.userId));
                          }
                        }
                      } else {
                        if (currentChatroomStoreRef.current?._id === room_id) {
                          dispatch(setCurrentChatroom(newAddedChatroom));
                          dispatch(fetchCurrentChatroomMembersAsync(newAddedChatroom._id));
                        }
                      }
                    }
                  });
                } catch (err) {
                  console.error("Failed to socket.current.on > joined-message-group", data);
                }
              });
            }

            if (!socket.current.hasListeners("left-message-group")) {
              socket.current.on("left-message-group", async (data: ISocketParamsLeftMessageGroup) => {
                console.log("socket.current.on > left-message-group", data);
                try {
                  const { room_id, left_user_id } = data;
                  if (left_user_id === accountStoreRef.current.uid) {
                    dispatch(delOneFromChatroomList(room_id));
                    dispatch(delOneSkeyList(room_id));
                    if (currentChatroomStoreRef.current?._id === room_id) {
                      dispatch(setCurrentChatroom(null));
                      dispatch(setCurrentChatroomMembers([]));
                    }
                  } else {
                    dispatch(addOneToChatroomListAsync(room_id)).then((action) => {
                      if (action.type.endsWith("/fulfilled")) {
                        const newChatroom = action.payload as IChatroom;
                        if (currentChatroomStoreRef.current?._id === room_id) {
                          dispatch(setCurrentChatroom(newChatroom));
                          dispatch(fetchCurrentChatroomMembersAsync(newChatroom._id));
                        }
                      }
                    });
                  }
                } catch (err) {
                  console.error("Failed to socket.current.on > left-message-group", data);
                }
              });
            }

            if (!socket.current.hasListeners("user-online")) {
              socket.current.on("user-online", async (userId: string) => {
                console.log("socket.current.on > user-online", userId);
                dispatch(addOneActiveUserList(userId));
              });
            }

            if (!socket.current.hasListeners("user-offline")) {
              socket.current.on("user-offline", async (userId: string) => {
                console.log("socket.current.on > user-offline", userId);
                dispatch(delOneActiveUserList(userId));
              });
            }

            if (!socket.current.hasListeners("active-users")) {
              socket.current.on("active-users", async (data: ISocketParamsActiveUsers) => {
                console.log("socket.current.on > active-users", data);
                dispatch(setActiveUserList(data.users));
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
            id: alert._id,
            alertType: "friend-request",
            note: {
              sender: alert.note.sender,
              to: alert.note.to,
              status: "accepted",
            },
          };
          socket.current.emit("update-alert", JSON.stringify(data));
          console.log("socket.current.emit > update-alert", data);

          dispatch(updateFriendRequestInAlertList(data));
          dispatch(createContactAsync(alert.note.sender));
          dispatch(fetchFriendListAsync());
        }
      } catch (err) {
        console.error("Failed to approveFriendRequest: ", err);
      }
    },
    [accountStore, socket.current]
  );

  const declineFriendRequest = useCallback(
    (alert: IAlert) => {
      try {
        console.log("declineFriendRequest");
        if (socket.current && socket.current.connected) {
          const data = {
            id: alert._id,
            alertType: "friend-request",
            note: {
              sender: alert.note.sender,
              to: alert.note.to,
              status: "rejected",
            },
          };
          socket.current.emit("update-alert", JSON.stringify(data));
          console.log("socket.current.emit > update-alert", data);

          dispatch(updateFriendRequestInAlertList(data));
          dispatch(createContactAsync(alert.note.sender));
          dispatch(fetchFriendListAsync());
        }
      } catch (err) {
        console.error("Failed to declineFriendRequest: ", err);
      }
    },
    [accountStore, socket.current]
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
