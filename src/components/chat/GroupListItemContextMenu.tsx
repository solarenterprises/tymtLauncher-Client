import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { IChatroom, IParamsLeaveGroup } from "../../types/ChatroomAPITypes";
import { IPoint } from "../../types/homeTypes";
import { accountType } from "../../types/accountTypes";

import { AppDispatch } from "../../store";
import { leaveGroupAsync } from "../../features/chat/ChatroomListSlice";
import { getAccount } from "../../features/account/AccountSlice";

export interface IPropsGroupListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  group: IChatroom;
  contextMenuPosition: IPoint;
}

const GroupListItemContextMenu = ({ view, setView, group, contextMenuPosition }: IPropsGroupListItemContextMenu) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);

  const handleLeaveGroupClick = useCallback(async () => {
    try {
      const data: IParamsLeaveGroup = {
        _groupId: group._id,
        _userId: accountStore.uid,
      };
      dispatch(leaveGroupAsync(data));

      console.log("handleLeaveGroupClick", group);
      setView(false);
    } catch (err) {
      console.error("Failed to handleLeaveGroupClick: ", err);
    }
  }, [accountStore]);

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
          <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleLeaveGroupClick}>
            {t("cha-51_leave-group")}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default GroupListItemContextMenu;
