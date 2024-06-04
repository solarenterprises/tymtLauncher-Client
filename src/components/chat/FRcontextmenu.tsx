import { Modal, Box } from "@mui/material";
import { propsFRcontextmenuType } from "../../types/chatTypes";
import { useTranslation } from "react-i18next";

const FRcontextmenu = ({
  value,
  isClickedBlock,
  isClickedDelete,
  isClickedRequest,
  setIsClickedBlock,
  setOpenBlockModal,
  setShowContextMenu,
  setIsClickedDelete,
  setOpenDeleteModal,
  setOpenRequestModal,
  setIsClickedRequest,
  contextMenuPosition,
}: propsFRcontextmenuType) => {
  const { t } = useTranslation();
  return (
    <Modal open={true}>
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
        {value === "" ? (
          <>
            <Box
              className={"fs-16 white context_menu_block"}
              textAlign={"left"}
              sx={{
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                setIsClickedBlock(!isClickedBlock), setOpenBlockModal(true), setShowContextMenu(false);
              }}
            >
              {t("cha-4_block")}
            </Box>

            <Box
              className={"fs-16 white context_menu_delete"}
              textAlign={"left"}
              sx={{
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                setIsClickedDelete(!isClickedDelete), setOpenDeleteModal(true), setShowContextMenu(false);
              }}
            >
              {t("cha-5_delete-chat")}
            </Box>
          </>
        ) : (
          <>
            <Box
              className={"fs-16 white context_menu_friendrequest"}
              textAlign={"center"}
              sx={{
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                setIsClickedRequest(!isClickedRequest), setOpenRequestModal(true), setShowContextMenu(false);
              }}
            >
              {t("cha-20_send-request")}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default FRcontextmenu;
