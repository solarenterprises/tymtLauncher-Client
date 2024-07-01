import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { IChatroom, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { accountType } from "../../types/accountTypes";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { leaveGroupAsync } from "../../features/chat/ChatroomListSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { ISocketParamsLeaveMessageGroup } from "../../types/SocketTypes";

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
  const accountStore: accountType = useSelector(getAccount);

  const handleLeaveDMClick = useCallback(async () => {
    try {
      const data: IParamsLeaveGroup = {
        _groupId: DM._id,
        _userId: accountStore.uid,
      };
      dispatch(leaveGroupAsync(data)).then(() => {
        const data_2: ISocketParamsLeaveMessageGroup = {
          room_id: DM._id,
          joined_user_id: accountStore.uid,
        };
        socket.current.emit("leave-message-group", JSON.stringify(data_2));
      });

      console.log("handleLeaveDMClick", DM);
      setView(false);
    } catch (err) {
      console.error("Failed to handleLeaveDMClick: ", err);
    }
  }, [accountStore, socket.current]);

  const handleOnClose = () => {
    setView(false);
  };

  return (
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
          <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleLeaveDMClick}>
            {t("cha-52_leave-DM")}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DMListItemContextMenu;
