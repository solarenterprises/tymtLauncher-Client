import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";

import Avatar from "../home/Avatar";
import UserListItemContextMenu from "./UserListItemContextMenu";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { createContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { getBlockList } from "../../features/chat/BlockListSlice";
import { createDMAsync, getChatroomList } from "../../features/chat/ChatroomListSlice";
import { addOneSKeyList } from "../../features/chat/SKeyListSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getRsa } from "../../features/chat/RsaSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getFriendList } from "../../features/chat/FriendListSlice";
import { rsaDecrypt } from "../../features/chat/RsaApi";

import { IContactList, IRsa, userType } from "../../types/chatTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { ISocketParamsJoinMessageGroup } from "../../types/SocketTypes";
import { accountType } from "../../types/accountTypes";
import { IPoint } from "../../types/homeTypes";

export interface IPropsUserListItem {
  user: userType;
  index: number;
  numberOfUnreadMessages: number;
  setView?: (_: string) => void;
  page: string;
}

const UserListItem = ({ user, index, numberOfUnreadMessages, setView, page }: IPropsUserListItem) => {
  const { socket } = useSocket();

  const dispatch = useDispatch<AppDispatch>();
  const contactListStore: IContactList = useSelector(getContactList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const accountStore: accountType = useSelector(getAccount);
  const rsaStore: IRsa = useSelector(getRsa);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);

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
          if (haveDMWithUser) {
            const newCurrentChatroom = chatroomListStore.chatrooms
              .filter((chatroom) => !chatroom.room_name)
              .find((dm) => dm.participants.some((participant) => participant.userId === user._id));
            dispatch(setCurrentChatroom(newCurrentChatroom));
            dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
            if (setView) setView("chatbox");
          }
          // Else if we didn't have any DM in the past
          else {
            dispatch(createDMAsync(user._id)).then((action) => {
              if (action.type.endsWith("/fulfilled")) {
                const newCurrentChatroom = action.payload as IChatroom;
                dispatch(setCurrentChatroom(newCurrentChatroom));
                dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));

                const data_1: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: user._id,
                };
                const data_2: ISocketParamsJoinMessageGroup = {
                  room_id: newCurrentChatroom._id,
                  joined_user_id: accountStore.uid,
                };
                socket.current.emit("join-message-group", JSON.stringify(data_1));
                socket.current.emit("join-message-group", JSON.stringify(data_2));
                console.log("socket.current.emit > join-message-group", data_1);
                console.log("socket.current.emit > join-message-group", data_2);

                const myUserKey = newCurrentChatroom.participants.find((participant) => participant.userId === accountStore.uid)?.userKey;
                dispatch(
                  addOneSKeyList({
                    roomId: newCurrentChatroom._id,
                    sKey: rsaDecrypt(myUserKey, rsaStore.privateKey),
                  })
                );

                if (setView) setView("chatbox");
              }
            });
          }
        }
        // Else if he is not in my contact list
        else {
          dispatch(createDMAsync(user._id)).then((action) => {
            if (action.type.endsWith("/fulfilled")) {
              const newCurrentChatroom = action.payload as IChatroom;
              dispatch(setCurrentChatroom(newCurrentChatroom));
              dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));

              const data_1: ISocketParamsJoinMessageGroup = {
                room_id: newCurrentChatroom._id,
                joined_user_id: user._id,
              };
              const data_2: ISocketParamsJoinMessageGroup = {
                room_id: newCurrentChatroom._id,
                joined_user_id: accountStore.uid,
              };
              socket.current.emit("join-message-group", JSON.stringify(data_1));
              socket.current.emit("join-message-group", JSON.stringify(data_2));
              console.log("socket.current.emit > join-message-group", data_1);
              console.log("socket.current.emit > join-message-group", data_2);

              const myUserKey = newCurrentChatroom.participants.find((participant) => participant.userId === accountStore.uid)?.userKey;
              dispatch(
                addOneSKeyList({
                  roomId: newCurrentChatroom._id,
                  sKey: rsaDecrypt(myUserKey, rsaStore.privateKey),
                })
              );

              if (setView) setView("chatbox");
            }
          });
          dispatch(createContactAsync(user._id));
        }
        console.log("handleUserListItemClick");
      } catch (err) {
        console.error("Failed to handleUserListItemClick: ", err);
      }
    } else {
      console.error("Failed to handleUserListItemClick: socket not connected!");
    }
  }, [user, contactListStore, blockListStore, friendListStore, chatroomListStore, accountStore, socket.current]);

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
          <Avatar onlineStatus={activeUserListStore.users.some((active) => active === user._id)} userid={user._id} size={40} status={user.notificationStatus} />
          <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
            <Box>
              <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
                <Box className={"fs-16 white"}>{user?.nickName}</Box>
                <Box className={"fs-12-light gray"}>{user?.sxpAddress}</Box>
              </Stack>
            </Box>
            <Box
              className={"unread-dot fs-10-light"}
              sx={{
                display: numberOfUnreadMessages > 0 ? "block" : "none",
              }}
            >
              {numberOfUnreadMessages}
            </Box>
          </Stack>
        </Grid>
      </Box>
      <UserListItemContextMenu user={user} view={showContextMenu} setView={setShowContextMenu} contextMenuPosition={contextMenuPosition} page={page} />
    </>
  );
};

export default UserListItem;
