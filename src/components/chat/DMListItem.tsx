import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";
import Avatar from "../home/Avatar";
import DMListItemContextMenu from "./DMListItemContextMenu";
import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { createContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { leaveGroupAsync } from "../../features/chat/ChatroomListSlice";
import { delOneSkeyList } from "../../features/chat/SKeyListSlice";
import { fetchAlertListAsync } from "../../features/alert/AlertListSlice";

import { IChatroom, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";
import { IContactList } from "../../types/chatTypes";
import { IPoint } from "../../types/homeTypes";
import AlertAPI from "../../lib/api/AlertAPI";
import { ISocketParamsSyncEvent } from "../../types/SocketTypes";
import { SyncEventNames } from "../../consts/SyncEventNames";
import { fetchUnreadMessageListAsync, getUnreadMessageList, IUnreadMessageList } from "../../features/chat/UnreadMessageListSlice";

export interface IPropsDMListItem {
  DM: IChatroom;
  index: number;
  setView?: (_: string) => void;
}

const DMListItem = ({ DM, index, setView }: IPropsDMListItem) => {
  const { socket } = useSocket();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const contactListStore: IContactList = useSelector(getContactList);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const unreadMessageListStore: IUnreadMessageList = useSelector(getUnreadMessageList);

  const partnerId = DM.participants.find((element) => element.userId !== accountStore.uid)?.userId ?? "";
  const user = contactListStore.contacts.find((element) => element._id === partnerId);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const unreadMessageCountForChatroom: number = useMemo(() => {
    try {
      return unreadMessageListStore.data.find((element) => element.chatroomId === DM._id).unreadMessageCount;
    } catch (err) {
      console.error("Failed with unreadMessageCountForChatroom: ", err);
      return 0;
    }
  }, [unreadMessageListStore]);

  useEffect(() => {
    if (!user && partnerId) {
      dispatch(createContactAsync(partnerId));
    } else if (!partnerId) {
      const data: IParamsLeaveGroup = {
        _groupId: DM._id,
        _userId: accountStore.uid,
      };
      dispatch(leaveGroupAsync(data)).then(() => {
        dispatch(delOneSkeyList(DM._id));
      });
    }
  }, [user, partnerId]);

  const handleDMListItemClick = useCallback(async () => {
    try {
      dispatch(setCurrentChatroom(DM));
      dispatch(fetchCurrentChatroomMembersAsync(DM._id));

      if (setView) setView("chatbox");

      await AlertAPI.readAllUnreadAlertsForChatroom({ userId: accountStore.uid, roomId: DM._id });
      await dispatch(fetchUnreadMessageListAsync(accountStore.uid));
      await dispatch(fetchAlertListAsync(accountStore.uid));

      if (socket.current && socket.current.connected) {
        const data: ISocketParamsSyncEvent = {
          sender_id: accountStore.uid,
          recipient_id: accountStore.uid,
          instructions: [SyncEventNames.UPDATE_ALERT_LIST, SyncEventNames.UPDATE_UNREAD_MESSAGE_LIST],
          is_to_self: true,
        };
        socket.current.emit("sync-event", JSON.stringify(data));
        console.log("socket.current.emit > sync-event", data);
      }

      console.log("handleDMListItemClick");
    } catch (err) {
      console.error("Failed to handleDMListItemClick: ", err);
    }
  }, [socket.current, accountStore]);

  const handleDMListItemRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  return (
    user && (
      <>
        <Box key={`${index}-${new Date().toISOString()}`} onClick={handleDMListItemClick} onContextMenu={handleDMListItemRightClick}>
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
            <Avatar
              onlineStatus={activeUserListStore.users.some((active) => active === user._id)}
              url={user.avatar}
              size={40}
              status={user.notificationStatus}
            />
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
                  display: unreadMessageCountForChatroom > 0 ? "block" : "none",
                }}
              >
                {unreadMessageCountForChatroom}
              </Box>
            </Stack>
          </Grid>
        </Box>
        <DMListItemContextMenu view={showContextMenu} setView={setShowContextMenu} DM={DM} contextMenuPosition={contextMenuPosition} />
      </>
    )
  );
};

export default DMListItem;
