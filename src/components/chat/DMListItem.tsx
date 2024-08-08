import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Stack } from "@mui/material";
import Avatar from "../home/Avatar";
import DMListItemContextMenu from "./DMListItemContextMenu";

import { AppDispatch } from "../../store";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { createContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { leaveGroupAsync } from "../../features/chat/ChatroomListSlice";
import { delOneSkeyList } from "../../features/chat/SKeyListSlice";
import { fetchAlertListAsync, getAlertList, readMultiplAlertsAsync } from "../../features/alert/AlertListSlice";

import { IChatroom, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";
import { IAlert, IContactList } from "../../types/chatTypes";
import { IPoint } from "../../types/homeTypes";
import { IAlertList } from "../../types/alertTypes";

export interface IPropsDMListItem {
  DM: IChatroom;
  index: number;
  setView?: (_: string) => void;
}

const DMListItem = ({ DM, index, setView }: IPropsDMListItem) => {
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const contactListStore: IContactList = useSelector(getContactList);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const alertListStore: IAlertList = useSelector(getAlertList);

  const partnerId = DM.participants.find((element) => element.userId !== accountStore.uid)?.userId ?? "";
  const user = contactListStore.contacts.find((element) => element._id === partnerId);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const unreadAlertsForThisDM: IAlert[] = useMemo(() => {
    try {
      return alertListStore?.unread?.filter((alert) => alert?.alertType === "chat").filter((chatAlert) => chatAlert?.note?.room_id === DM?._id);
    } catch (err) {
      console.error("Failed with unreadAlertsForThisGroup: ", err);
      return [];
    }
  }, [alertListStore]);

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
      if (setView) setView("chatbox");
      dispatch(fetchCurrentChatroomMembersAsync(DM._id));
      await dispatch(readMultiplAlertsAsync({ ids: unreadAlertsForThisDM?.map((alert) => alert?._id) }));
      await dispatch(fetchAlertListAsync(accountStore.uid));

      console.log("handleDMListItemClick");
    } catch (err) {
      console.error("Failed to handleDMListItemClick: ", err);
    }
  }, [accountStore, unreadAlertsForThisDM]);

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
                  display: unreadAlertsForThisDM?.length > 0 ? "block" : "none",
                }}
              >
                {unreadAlertsForThisDM?.length}
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
