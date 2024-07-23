import { useCallback, useState } from "react";
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

import { accountType } from "../../types/accountTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { ISocketParamsJoinMessageGroup } from "../../types/SocketTypes";

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
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const isGroupInvited = chatroomListStore.chatrooms.some((chatroom) => chatroom._id === group._id);

  const handleGroupListItemClick = useCallback(async () => {
    try {
      // When it is a new public group to me
      if (!isGroupInvited && !group.isPrivate) {
        dispatch(
          joinPublicGroupAsync({
            _userId: accountStore.uid,
            _groupId: group._id,
          })
        ).then((action) => {
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
            }

            if (setView) setView("chatbox");
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
  }, [accountStore, socket.current]);

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

            {/* <Box
          className={"unread-dot fs-10-light"}
          sx={{
            display: numberofunreadmessages > 0 ? "block" : "none",
          }}
        >
          {numberofunreadmessages}
        </Box> */}
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
