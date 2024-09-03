import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";

import { deleteFriendAsync } from "../../features/chat/FriendListSlice";
import { createContactAsync, deleteContactAsync } from "../../features/chat/ContactListSlice";
import { createBlockAsync, deleteBlockAsync } from "../../features/chat/BlockListSlice";

import { IPoint } from "../../types/homeTypes";
import { IMyInfo, userType } from "../../types/chatTypes";
import { ISocketParamsSyncEvent } from "../../types/SocketTypes";
import { getMyInfo } from "../../features/account/MyInfoSlice";

import { SyncEventNames } from "../../consts/SyncEventNames";

export interface IPropsUserListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  user: userType;
  contextMenuPosition: IPoint;
  page: string;
}

const UserListItemContextMenu = ({ user, view, setView, contextMenuPosition, page }: IPropsUserListItemContextMenu) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const handleOnClose = () => {
    setView(false);
  };

  const handleRemoveFriendClick = useCallback(async () => {
    try {
      await dispatch(deleteFriendAsync(user._id));
      await dispatch(createContactAsync(user._id));

      if (socket.current && socket.current.connected) {
        const data_1: ISocketParamsSyncEvent = {
          sender_id: myInfoStore?._id,
          recipient_id: user._id,
          instructions: [SyncEventNames.UPDATE_CONTACT_LIST, SyncEventNames.UPDATE_FRIEND_LIST],
          is_to_self: false,
        };
        const data_2: ISocketParamsSyncEvent = {
          sender_id: myInfoStore?._id,
          recipient_id: myInfoStore?._id,
          instructions: [SyncEventNames.UPDATE_CONTACT_LIST, SyncEventNames.UPDATE_FRIEND_LIST],
          is_to_self: true,
        };

        socket.current.emit("sync-event", JSON.stringify(data_1));
        socket.current.emit("sync-event", JSON.stringify(data_2));

        console.log("socket.current.emit > sync-event", data_1);
        console.log("socket.current.emit > sync-event", data_2);
      }
    } catch (err) {
      console.error("Failed to handleRemoveFriendClick: ", err);
    }
  }, [socket.current, myInfoStore]);

  const handleBlockClick = useCallback(async () => {
    try {
      await dispatch(deleteFriendAsync(user._id));
      await dispatch(deleteContactAsync(user._id));
      await dispatch(createBlockAsync(user._id));

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

  const handleUnblockClick = useCallback(async () => {
    try {
      await dispatch(deleteBlockAsync(user._id));
      await dispatch(createContactAsync(user._id));

      if (socket.current && socket.current.connected) {
        const data: ISocketParamsSyncEvent = {
          sender_id: myInfoStore?._id,
          recipient_id: myInfoStore?._id,
          instructions: [SyncEventNames.UPDATE_CONTACT_LIST, SyncEventNames.UPDATE_BLOCK_LIST],
          is_to_self: true,
        };

        socket.current.emit("sync-event", JSON.stringify(data));
        console.log("socket.current.emit > sync-event", data);
      }
    } catch (err) {
      console.error("Failed to handleUnblockClick: ", err);
    }
  }, [socket.current, myInfoStore]);

  return (
    <>
      {page !== "DM" && (
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
              {page === "DM" && <></>}
              {page === "friend" && (
                <>
                  <Box className={"fs-16 white context_menu_up"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleRemoveFriendClick}>
                    {t("cha-53_remove-friend")}
                  </Box>
                  <Box className={"fs-16 white context_menu_bottom"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleBlockClick}>
                    {t("cha-4_block")}
                  </Box>
                </>
              )}
              {page === "block" && (
                <>
                  <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleUnblockClick}>
                    {t("cha-39_unblock")}
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default UserListItemContextMenu;
