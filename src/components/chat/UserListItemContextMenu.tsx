import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Modal, Box, Fade } from "@mui/material";

import { AppDispatch } from "../../store";

import { IPoint } from "../../types/homeTypes";
import { userType } from "../../types/chatTypes";
import { deleteFriendAsync } from "../../features/chat/FriendListSlice";
import { createContactAsync, deleteContactAsync } from "../../features/chat/ContactListSlice";
import { createBlockAsync, deleteBlockAsync } from "../../features/chat/BlockListSlice";

export interface IPropsUserListItemContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  user: userType;
  contextMenuPosition: IPoint;
  page: string;
}

const UserListItemContextMenu = ({ user, view, setView, contextMenuPosition, page }: IPropsUserListItemContextMenu) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const handleOnClose = () => {
    setView(false);
  };

  const handleRemoveFriendClick = () => {
    dispatch(deleteFriendAsync(user._id)).then(() => {
      dispatch(createContactAsync(user._id));
    });
  };

  const handleBlockClick = () => {
    dispatch(deleteFriendAsync(user._id)).then(() => {
      dispatch(deleteContactAsync(user._id)).then(() => {
        dispatch(createBlockAsync(user._id));
      });
    });
  };

  const handleUnblockClick = () => {
    dispatch(deleteBlockAsync(user._id)).then(() => {
      dispatch(createContactAsync(user._id));
    });
  };

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
