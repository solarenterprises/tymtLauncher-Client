import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";
import GroupAvatar from "./GroupAvatar";
import GroupListItemContextMenu from "./GroupListItemContextMenu";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getChatroomList, joinPublicGroupAsync } from "../../features/chat/ChatroomListSlice";
import { fetchAlertListAsync, getAlertList } from "../../features/alert/AlertListSlice";

import { accountType } from "../../types/accountTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { ISocketParamsJoinMessageGroup, ISocketParamsSyncEvent } from "../../types/SocketTypes";
import { IAlertList } from "../../types/alertTypes";
import { IAlert } from "../../types/chatTypes";
import AlertAPI from "../../lib/api/AlertAPI";
import { SyncEventNames } from "../../consts/SyncEventNames";
import { fetchUnreadMessageListAsync } from "../../features/chat/UnreadMessageListSlice";

export interface IPropsGroupListItem {
  group: IChatroom;
  index: number;
  setView?: (_: string) => void;
}

const GroupListItem = ({ group, index, setView }: IPropsGroupListItem) => {
  const { socket } = useSocket();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const alertListStore: IAlertList = useSelector(getAlertList);

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const isGroupInvited: boolean = useMemo(() => {
    try {
      return chatroomListStore.chatrooms.some((chatroom) => chatroom._id === group._id);
    } catch (err) {
      console.error("Failed with isGroupInvited: ", err);
      return false;
    }
  }, [chatroomListStore]);
  const unreadAlertsForThisGroup: IAlert[] = useMemo(() => {
    try {
      return alertListStore?.unread?.filter((alert) => alert?.alertType === "chat").filter((chatAlert) => chatAlert?.note?.room_id === group?._id);
    } catch (err) {
      console.error("Failed with unreadAlertsForThisGroup: ", err);
      return [];
    }
  }, [alertListStore]);

  const handleGroupListItemClick = useCallback(async () => {
    try {
      // When it is a new public group to me
      if (!isGroupInvited && !group.isPrivate) {
        dispatch(
          joinPublicGroupAsync({
            _userId: accountStore.uid,
            _groupId: group._id,
          })
        ).then(async (action) => {
          if (action.type.endsWith("/fulfilled")) {
            const newChatroom = action.payload as IChatroom;
            dispatch(setCurrentChatroom(newChatroom));
            dispatch(fetchCurrentChatroomMembersAsync(newChatroom._id));

            if (socket.current && socket.current.connected) {
              const data: ISocketParamsJoinMessageGroup = {
                room_id: group._id,
                joined_user_id: accountStore.uid,
              };
              socket.current.emit("join-message-group", JSON.stringify(data));
              console.log("socket.current.emit > join-message-group", data);

              const data_2: ISocketParamsSyncEvent = {
                sender_id: accountStore.uid,
                recipient_id: accountStore.uid,
                instructions: [SyncEventNames.UPDATE_ALERT_LIST, SyncEventNames.UPDATE_UNREAD_MESSAGE_LIST],
                is_to_self: true,
              };
              socket.current.emit("sync-event", JSON.stringify(data_2));
              console.log("socket.current.emit > sync-event", data_2);
            }

            if (setView) setView("chatbox");

            await AlertAPI.readAllUnreadAlertsForChatroom({ userId: accountStore.uid, roomId: group._id });
            await dispatch(fetchUnreadMessageListAsync(accountStore.uid));
            await dispatch(fetchAlertListAsync(accountStore.uid));
          }
        });
      } else {
        dispatch(setCurrentChatroom(group));
        dispatch(fetchCurrentChatroomMembersAsync(group._id));
        if (setView) setView("chatbox");
      }

      console.log("handleGroupListItemClick");
    } catch (err) {
      console.error("Failed to handleGroupListItemClick: ", err);
    }
  }, [accountStore, unreadAlertsForThisGroup, socket.current]);

  const handleGroupListItemRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  return (
    <>
      <Box key={`${index}-${new Date().toISOString()}`} onClick={handleGroupListItemClick} onContextMenu={handleGroupListItemRightClick}>
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
          <GroupAvatar size={40} url={group.room_image} />
          <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
            <Box>
              <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
                <Box className={"fs-16 white"}>{group.room_name}</Box>
                <Box className={"fs-12-light gray"}>{`${group.participants.length} Joined`}</Box>
              </Stack>
            </Box>

            <Box
              className={"unread-dot fs-10-light"}
              sx={{
                display: unreadAlertsForThisGroup?.length > 0 ? "block" : "none",
              }}
            >
              {unreadAlertsForThisGroup?.length}
            </Box>
          </Stack>
        </Grid>
      </Box>
      {isGroupInvited && (
        <GroupListItemContextMenu view={showContextMenu} setView={setShowContextMenu} group={group} contextMenuPosition={contextMenuPosition} />
      )}
    </>
  );
};

export default GroupListItem;
