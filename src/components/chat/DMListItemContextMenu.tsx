import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ExportChatModal from "./ExportChatModal";

import { Modal, Box, Fade } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { deleteFriendAsync } from "../../features/chat/FriendListSlice";
import { leaveGroupAsync } from "../../features/chat/ChatroomListSlice";
import { delOneSkeyList } from "../../features/chat/SKeyListSlice";
import { createBlockAsync, deleteBlockAsync } from "../../features/chat/BlockListSlice";
import { createContactAsync, deleteContactAsync } from "../../features/chat/ContactListSlice";
import { getMyInfo } from "../../features/account/MyInfoSlice";

import { ISocketParamsLeaveMessageGroup, ISocketParamsSyncEvent } from "../../types/SocketTypes";
import { IChatroom, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { IAlert, IMyInfo } from "../../types/chatTypes";
import { SyncEventNames } from "../../consts/SyncEventNames";

export interface IPropsDMListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  DM: IChatroom;
  contextMenuPosition: IPoint;
}

const DMListItemContextMenu = ({ view, setView, DM, contextMenuPosition }: IPropsDMListItemContextMenu) => {
  const { socket } = useSocket();

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const [openExportModal, setOpenExportModal] = useState<boolean>(false);

  const handleFriendRequestClick = useCallback(async () => {
    try {
      const partner = DM.participants.find((participant) => participant.userId !== myInfoStore?._id);

      console.log("handleFriendRequestClick", partner.userId);

      if (!partner) {
        console.error("Failed to handleSendFriendRequestClick: partner already left DM!");
        return;
      }

      await dispatch(deleteBlockAsync(partner.userId));
      await dispatch(createContactAsync(partner.userId));

      if (socket.current && socket.current.connected) {
        const data: IAlert = {
          alertType: "friend-request",
          note: {
            sender: myInfoStore?._id,
            to: partner.userId,
            status: "pending",
          },
          receivers: [partner.userId],
        };
        socket.current.emit("post-alert", JSON.stringify(data));
        console.log("socket.current.emit > post-alert", data);

        const data_2: ISocketParamsSyncEvent = {
          sender_id: myInfoStore?._id,
          recipient_id: myInfoStore?._id,
          instructions: [SyncEventNames.UPDATE_BLOCK_LIST, SyncEventNames.UPDATE_CONTACT_LIST],
          is_to_self: true,
        };
        socket.current.emit("sync-event", JSON.stringify(data_2));
        console.log("socket.current.emit > sync-event", data_2);
      }

      setView(false);
    } catch (err) {
      console.error("Failed to handleFriendRequestClick: ", err);
    }
  }, [myInfoStore, DM, socket.current]);

  const handleBlockClick = useCallback(async () => {
    try {
      const partner = DM.participants.find((participant) => participant.userId !== myInfoStore?._id);
      if (!partner) {
        console.error("Failed to handleSendFriendRequestClick: partner already left DM!");
        return;
      }

      await dispatch(deleteFriendAsync(partner.userId));
      await dispatch(deleteContactAsync(partner.userId));
      await dispatch(createBlockAsync(partner.userId));

      if (socket.current && socket.current.connected) {
        const data: ISocketParamsSyncEvent = {
          sender_id: myInfoStore?._id,
          recipient_id: myInfoStore?._id,
          instructions: [SyncEventNames.UPDATE_CONTACT_LIST, SyncEventNames.UPDATE_FRIEND_LIST, SyncEventNames.UPDATE_BLOCK_LIST],
          is_to_self: true,
        };

        socket.current.emit("sync-event", JSON.stringify(data));
        console.log("socket.current.emit > sync-event", data);
      }
    } catch (err) {
      console.error("Failed to handleBlockClick: ", err);
    }
  }, [socket.current, myInfoStore]);

  const handleExportClick = () => {
    setView(false);
    setOpenExportModal(true);
  };

  const handleLeaveDMClick = useCallback(async () => {
    try {
      const data: IParamsLeaveGroup = {
        _groupId: DM._id,
        _userId: myInfoStore?._id,
      };
      dispatch(leaveGroupAsync(data)).then(() => {
        dispatch(delOneSkeyList(DM._id));

        const data_2: ISocketParamsLeaveMessageGroup = {
          room_id: DM._id,
          joined_user_id: myInfoStore?._id,
        };
        socket.current.emit("leave-message-group", JSON.stringify(data_2));
      });

      console.log("handleLeaveDMClick", DM);
      setView(false);
    } catch (err) {
      console.error("Failed to handleLeaveDMClick: ", err);
    }
  }, [myInfoStore, socket.current]);

  const handleOnClose = () => {
    setView(false);
  };

  return (
    <>
      <Modal open={view} onClose={handleOnClose}>
        <Fade in={view}>
          <Box
            sx={{
              position: "fixed",
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              display: "block",
              flexDirection: "column",
              alignItems: "flex-start",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleFriendRequestClick}>
              {t("not-9_friend-request")}
            </Box>
            <Box className={"fs-16 white context_menu_middle"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleBlockClick}>
              {t("cha-4_block")}
            </Box>
            <Box className={"fs-16 white context_menu_middle"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleExportClick}>
              {t("cha-60_export")}
            </Box>
            <Box className={"fs-16 white context_menu_bottom"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleLeaveDMClick}>
              {t("cha-52_leave-DM")}
            </Box>
          </Box>
        </Fade>
      </Modal>
      <ExportChatModal view={openExportModal} setView={setOpenExportModal} group={DM} />
    </>
  );
};

export default DMListItemContextMenu;
