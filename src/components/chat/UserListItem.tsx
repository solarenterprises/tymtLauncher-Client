import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";

import Avatar from "../home/Avatar";

import { AppDispatch } from "../../store";
import { createContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { getBlockList } from "../../features/chat/BlockListSlice";
import { createDMAsync, getChatroomList } from "../../features/chat/ChatroomListSlice";

import { IContactList, propsUserlistType, selecteduserType } from "../../types/chatTypes";
import { getSelectedUser, setSelectedUsertoDelete } from "../../features/chat/Chat-selecteduserSlice";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getFriendList } from "../../features/chat/FriendListSlice";

const UserListItem = ({ user, index, numberofunreadmessages, setShowContextMenu, setContextMenuPosition, setView }: propsUserlistType) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedUserToDeleteStore: selecteduserType = useSelector(getSelectedUser);
  const contactListStore: IContactList = useSelector(getContactList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);

  const selectedUserToDeleteStoreRef = useRef(selectedUserToDeleteStore);

  useEffect(() => {
    selectedUserToDeleteStoreRef.current = selectedUserToDeleteStore;
  }, [selectedUserToDeleteStore]);

  const handleContextMenu = (e: any, id: string) => {
    e.preventDefault();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setShowContextMenu(true);
    setContextMenuPosition({ x: mouseX, y: mouseY });
    e.stopPropagation();
    dispatch(
      setSelectedUsertoDelete({
        ...selectedUserToDeleteStoreRef.current,
        id: id,
      })
    );
    const handleClickOutsideContextMenu = (event) => {
      if (!event.target.closest(".context_menu_block") && !event.target.closest(".context_menu_delete")) {
        setShowContextMenu(false);
        document.removeEventListener("click", handleClickOutsideContextMenu);
      }
    };

    document.addEventListener("click", handleClickOutsideContextMenu);
    return false;
  };

  const handleUserListItemClick = useCallback(async () => {
    try {
      if (
        blockListStore.contacts.some((element) => element._id === user._id) ||
        contactListStore.contacts.some((element) => element._id === user._id) ||
        friendListStore.contacts.some((element) => element._id === user._id)
      ) {
        console.log("handleUserListItemClick: Already in the block/contact/friend list!");
        const haveDMWithUser = chatroomListStore.chatrooms
          .filter((chatroom) => !chatroom.room_name)
          .some((dm) => dm.participants.some((participant) => participant.userId === user._id));
        if (haveDMWithUser) {
          const newCurrentChatroom = chatroomListStore.chatrooms
            .filter((chatroom) => !chatroom.room_name)
            .find((dm) => dm.participants.some((participant) => participant.userId === user._id));
          dispatch(setCurrentChatroom(newCurrentChatroom));
          dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
          setView("chatbox");
        } else {
          dispatch(createDMAsync(user._id)).then((action) => {
            if (action.type.endsWith("/fulfilled")) {
              const newCurrentChatroom = action.payload as IChatroom;
              dispatch(setCurrentChatroom(newCurrentChatroom));
              dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
              setView("chatbox");
            }
          });
        }
      } else {
        dispatch(createDMAsync(user._id)).then((action) => {
          if (action.type.endsWith("/fulfilled")) {
            const newCurrentChatroom = action.payload as IChatroom;
            dispatch(setCurrentChatroom(newCurrentChatroom));
            dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
            setView("chatbox");
          }
        });
        dispatch(createContactAsync(user._id));
      }
      console.log("handleUserListItemClick");
    } catch (err) {
      console.error("Failed to handleUserListItemClick: ", err);
    }
  }, [user, contactListStore, blockListStore, friendListStore, chatroomListStore]);

  return (
    <Box key={`${index}-${new Date().toISOString()}`} onClick={handleUserListItemClick}>
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
        onContextMenu={(e) => handleContextMenu(e, user._id)}
      >
        <Avatar onlineStatus={user.onlineStatus} userid={user._id} size={40} status={user.notificationStatus} />
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
              display: numberofunreadmessages > 0 ? "block" : "none",
            }}
          >
            {numberofunreadmessages}
          </Box>
        </Stack>
      </Grid>
    </Box>
  );
};

export default UserListItem;
