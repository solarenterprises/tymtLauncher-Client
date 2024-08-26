import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { emit } from "@tauri-apps/api/event";

import { Box, Grid, Stack } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";
import { useNotification } from "../../providers/NotificationProvider";

import GroupAvatar from "./GroupAvatar";
import GroupListItemContextMenu from "./GroupListItemContextMenu";
import PublicBadge from "./PublicBadge";

import { AppDispatch } from "../../store";
import { fetchCurrentChatroomAsync, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync, setCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";
import { getChatroomList, joinPublicGroupAsync } from "../../features/chat/ChatroomListSlice";
import { fetchAlertListAsync, getAlertList } from "../../features/alert/AlertListSlice";

import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { ISocketParamsJoinMessageGroup, ISocketParamsSyncEvent } from "../../types/SocketTypes";
import { IAlertList } from "../../types/alertTypes";
import { IAlert, IMyInfo } from "../../types/chatTypes";
import AlertAPI from "../../lib/api/AlertAPI";
import { SyncEventNames } from "../../consts/SyncEventNames";
import { fetchUnreadMessageListAsync } from "../../features/chat/UnreadMessageListSlice";
import { translateString } from "../../lib/api/Translate";
import { fetchHistoricalChatroomMembersAsync } from "../../features/chat/HistoricalChatroomMembersSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";

export interface IPropsGroupListItem {
  group: IChatroom;
  index: number;
  roomMode?: boolean;
  setView?: (_: string) => void;
  gray?: boolean;
}

const GroupListItem = ({ group, index, roomMode, setView, gray }: IPropsGroupListItem) => {
  const { socket } = useSocket();
  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const alertListStore: IAlertList = useSelector(getAlertList);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

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
            _userId: myInfoStore?._id,
            _groupId: group._id,
          })
        ).then(async (action) => {
          if (action.type.endsWith("/fulfilled")) {
            const newChatroom = action.payload as IChatroom;
            if (roomMode) {
              navigate(`/chat/${group._id}`);
            } else {
              dispatch(setCurrentChatroom(newChatroom));
              newChatroom.isGlobal ? dispatch(setCurrentChatroomMembers([])) : dispatch(fetchCurrentChatroomMembersAsync(newChatroom._id));
              dispatch(fetchHistoricalChatroomMembersAsync(newChatroom._id));
            }

            if (socket.current && socket.current.connected) {
              const data: ISocketParamsJoinMessageGroup = {
                room_id: group._id,
                joined_user_id: myInfoStore?._id,
              };
              socket.current.emit("join-message-group", JSON.stringify(data));
              console.log("socket.current.emit > join-message-group", data);
            }

            if (setView) setView("chatbox");

            setTimeout(() => {
              emit("focus_chat_input_field");
            }, 200);
          }
        });
      } else {
        if (roomMode) {
          navigate(`/chat/${group._id}`);
        } else {
          await dispatch(fetchCurrentChatroomAsync(group._id));
          group.isGlobal ? dispatch(setCurrentChatroomMembers([])) : dispatch(fetchCurrentChatroomMembersAsync(group._id));
          dispatch(fetchHistoricalChatroomMembersAsync(group._id));
        }

        if (setView) setView("chatbox");

        setTimeout(() => {
          emit("focus_chat_input_field");
        }, 200);

        if (socket.current && socket.current.connected) {
          const data_2: ISocketParamsSyncEvent = {
            sender_id: myInfoStore?._id,
            recipient_id: myInfoStore?._id,
            instructions: [SyncEventNames.UPDATE_ALERT_LIST, SyncEventNames.UPDATE_UNREAD_MESSAGE_LIST],
            is_to_self: true,
          };
          socket.current.emit("sync-event", JSON.stringify(data_2));
          console.log("socket.current.emit > sync-event", data_2);
        }

        await AlertAPI.readAllUnreadAlertsForChatroom({ userId: myInfoStore?._id, roomId: group._id });
        await dispatch(fetchUnreadMessageListAsync(myInfoStore?._id));
        await dispatch(fetchAlertListAsync(myInfoStore?._id));
      }

      console.log("handleGroupListItemClick");
    } catch (err) {
      console.error("Failed to handleGroupListItemClick: ", err);

      setNotificationStatus("failed");
      setNotificationTitle(t("hom-23_error"));
      setNotificationDetail(await translateString(err.toString()));
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [myInfoStore, unreadAlertsForThisGroup, socket.current]);

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
      <Box
        key={`${index}-${group._id}`}
        onClick={handleGroupListItemClick}
        onContextMenu={handleGroupListItemRightClick}
        sx={{
          filter: gray ? "grayscale(100%)" : "none",
        }}
      >
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
                <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
                  <Box className={"fs-16 white"}>{group.room_name}</Box>
                  {!group.isPrivate && <PublicBadge />}
                </Stack>
                {group.isGlobal ? (
                  <Box className={"fs-12-light gray"}>{`Global channel`}</Box>
                ) : (
                  <Box className={"fs-12-light gray"}>{`${group.participants.length} Joined`}</Box>
                )}
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
