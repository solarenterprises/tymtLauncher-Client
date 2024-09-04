import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { emit } from "@tauri-apps/api/event";

import { Box, Grid, Stack } from "@mui/material";

import Avatar from "../home/Avatar";
import UserListItemContextMenu from "./UserListItemContextMenu";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { createContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { getBlockList } from "../../features/chat/BlockListSlice";
import { createDMAsync, getChatroomList } from "../../features/chat/ChatroomListSlice";
import { addOneSKeyList } from "../../features/chat/SKeyListSlice";
import { getRsa } from "../../features/chat/RsaSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getFriendList } from "../../features/chat/FriendListSlice";
import { fetchHistoricalChatroomMembersAsync } from "../../features/chat/HistoricalChatroomMembersSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";
import { rsaDecrypt } from "../../features/chat/RsaApi";

import { IContactList, IMyInfo, IRsa, userType } from "../../types/chatTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { ISocketParamsJoinMessageGroup } from "../../types/SocketTypes";
import { IPoint } from "../../types/homeTypes";

export interface IPropsUserListItem {
  user: userType;
  index: number;
  roomMode?: boolean;
  setView?: (_: string) => void;
  page: string;
}

const UserListItem = ({ user, index, roomMode, setView, page }: IPropsUserListItem) => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const contactListStore: IContactList = useSelector(getContactList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const rsaStore: IRsa = useSelector(getRsa);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const handleUserListItemRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  const handleUserListItemClick = useCallback(async () => {
    if (socket.current && socket.current.connected) {
      try {
        // If he is already in my contact list
        if (
          blockListStore.contacts.some((element) => element._id === user._id) ||
          contactListStore.contacts.some((element) => element._id === user._id) ||
          friendListStore.contacts.some((element) => element._id === user._id)
        ) {
          console.log("handleUserListItemClick: Already in the block/contact/friend list!");
          const haveDMWithUser = chatroomListStore.chatrooms
            .filter((chatroom) => !chatroom.room_name)
            .some((dm) => dm.participants.some((participant) => participant.userId === user._id));
          // If we already had DM in the past
          console.log("haveDMWithUser: ", haveDMWithUser);
          if (haveDMWithUser) {
            const newCurrentChatroom = chatroomListStore.chatrooms
              .filter((chatroom) => !chatroom.room_name)
              .find((dm) => dm.participants.some((participant) => participant.userId === user._id));
            console.log("newCurrentChatroom: ", newCurrentChatroom);

            if (roomMode) {
              navigate(`/chat/${newCurrentChatroom._id}`);
            } else {
              dispatch(setCurrentChatroom(newCurrentChatroom));
              await dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
              await dispatch(fetchHistoricalChatroomMembersAsync(newCurrentChatroom._id));
            }

            if (setView) setView("chatbox");

            setTimeout(() => {
              emit("focus_chat_input_field");
            }, 200);
          }
          // Else if we didn't have any DM in the past
          else {
            dispatch(createDMAsync(user._id)).then(async (action) => {
              if (action.type.endsWith("/fulfilled")) {
                const newCurrentChatroom = action.payload as IChatroom;

                if (roomMode) {
                  navigate(`/chat/${newCurrentChatroom._id}`);
                } else {
                  dispatch(setCurrentChatroom(newCurrentChatroom));
                  await dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
                  await dispatch(fetchHistoricalChatroomMembersAsync(newCurrentChatroom._id));
                }

                const data_1: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: user._id,
                };
                const data_2: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: myInfoStore?._id,
                };
                socket.current.emit("join-message-group", JSON.stringify(data_1));
                socket.current.emit("join-message-group", JSON.stringify(data_2));
                console.log("socket.current.emit > join-message-group", data_1);
                console.log("socket.current.emit > join-message-group", data_2);

                const myUserKey = newCurrentChatroom.participants.find((participant) => participant.userId === myInfoStore?._id)?.userKey;
                dispatch(
                  addOneSKeyList({
                    roomId: newCurrentChatroom._id,
                    sKey: rsaDecrypt(myUserKey, rsaStore.privateKey),
                  })
                );

                if (setView) setView("chatbox");

                setTimeout(() => {
                  emit("focus_chat_input_field");
                }, 200);
              }
            });
          }
        }
        // Else if he is not in my contact list
        else {
          dispatch(createContactAsync(user._id)).then(() => {
            dispatch(createDMAsync(user._id)).then(async (action) => {
              if (action.type.endsWith("/fulfilled")) {
                const newCurrentChatroom = action.payload as IChatroom;
                if (roomMode) {
                  navigate(`/chat/${newCurrentChatroom._id}`);
                } else {
                  dispatch(setCurrentChatroom(newCurrentChatroom));
                  await dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
                  await dispatch(fetchHistoricalChatroomMembersAsync(newCurrentChatroom._id));
                }

                const data_1: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: user._id,
                };
                const data_2: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: myInfoStore?._id,
                };
                socket.current.emit("join-message-group", JSON.stringify(data_1));
                socket.current.emit("join-message-group", JSON.stringify(data_2));
                console.log("socket.current.emit > join-message-group", data_1);
                console.log("socket.current.emit > join-message-group", data_2);

                const myUserKey = newCurrentChatroom.participants.find((participant) => participant.userId === myInfoStore?._id)?.userKey;
                dispatch(
                  addOneSKeyList({
                    roomId: newCurrentChatroom._id,
                    sKey: rsaDecrypt(myUserKey, rsaStore.privateKey),
                  })
                );

                if (setView) setView("chatbox");

                setTimeout(() => {
                  emit("focus_chat_input_field");
                }, 200);
              }
            });
          });
        }
        console.log("handleUserListItemClick");
      } catch (err) {
        console.log("Failed to handleUserListItemClick: ", err);
      }
    } else {
      console.log("Failed to handleUserListItemClick: socket not connected!");
    }
  }, [user, contactListStore, blockListStore, friendListStore, chatroomListStore, myInfoStore, socket.current]);

  return (
    <>
      <Box key={`${index}-${new Date().toISOString()}`} onClick={handleUserListItemClick} onContextMenu={handleUserListItemRightClick}>
        <Grid
          item
          xs={12}
          container
          sx={{
            overflowX: "hidden",
            height: "64px",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            padding: "12px 5px 12px 5px",
            cursor: "pointer",
            "&:hover": {
              borderRadius: "5px",
              borderTopRightRadius: "0",
              borderBottomRightRadius: "0",
              backgroundColor: "#FFFFFF1A",
            },
            "&:active": {
              backgroundColor: "#52E1F21A",
            },
          }}
        >
          <Avatar onlineStatus={activeUserListStore.users.some((active) => active === user._id)} url={user.avatar} size={40} status={user.notificationStatus} />
          <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
            <Box>
              <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
                <Box className={"fs-16 white"}>{user?.nickName}</Box>
                <Box className={"fs-12-light gray"}>{user?.sxpAddress}</Box>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Box>
      <UserListItemContextMenu user={user} view={showContextMenu} setView={setShowContextMenu} contextMenuPosition={contextMenuPosition} page={page} />
    </>
  );
};

export default UserListItem;
