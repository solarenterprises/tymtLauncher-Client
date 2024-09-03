import { Modal, Box } from "@mui/material";
import { propsFRcontextmenuType } from "../../types/chatTypes";
import { useTranslation } from "react-i18next";

const FRcontextmenu = ({
  tab, // 1: Contact, 2: Friend, 3: Block
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
            {tab !== 1 && (
              <Box
                className={"fs-16 white context_menu_up"}
                textAlign={"left"}
                sx={{
                  backdropFilter: "blur(10px)",
                }}
                onClick={() => {
                  setIsClickedRequest(!isClickedRequest), setOpenRequestModal(true), setShowContextMenu(false);
                }}
              >
                {t("cha-20_send-request")}
              </Box>
            )}

            <Box
              className={tab === 1 ? "fs-16 white context_menu_up" : "fs-16 white context_menu_middle"}
              textAlign={"left"}
              sx={{
                backdropFilter: "blur(10px)",
              }}
              onClick={() => {
                setIsClickedBlock(!isClickedBlock), setOpenBlockModal(true), setShowContextMenu(false);
              }}
            >
              {tab === 2 ? t("cha-39_unblock") : t("cha-4_block")}
            </Box>

            <Box
              className={"fs-16 white context_menu_bottom"}
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
              className={"fs-16 white context_menu_single"}
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
