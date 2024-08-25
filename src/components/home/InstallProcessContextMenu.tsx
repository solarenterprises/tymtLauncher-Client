import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Box, Fade, Modal } from "@mui/material";

import { IDownloadStatus, IPoint } from "../../types/homeTypes";
import { emit } from "@tauri-apps/api/event";
import { getDownloadStatus } from "../../features/home/DownloadStatusSlice";
import { INotificationGameDownloadParams, INotificationParams } from "../../types/NotificationTypes";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { useCallback } from "react";

export interface IPropsInstallProcessContextMenu {
  view: boolean;
  setView: (_: boolean) => void;
  contextMenuPosition: IPoint;
}

const InstallProcessContextMenu = ({ view, setView, contextMenuPosition }: IPropsInstallProcessContextMenu) => {
  const { t } = useTranslation();
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const handleOnClose = () => {
    setView(false);
  };

  const handleCancelClick = useCallback(() => {
    try {
      const data: INotificationGameDownloadParams = {
        status: "cancelled",
        game: downloadStatusStore.game,
      };
      emit(TauriEventNames.GAME_DOWNLOAD, data);
      setView(false);
    } catch (err) {
      console.error("Failed to handleCancelClick: ", err);
      const data_2: INotificationParams = {
        status: "failed",
        title: "Error",
        message: "Downloading has not been cancelled!",
        link: null,
        translate: true,
      };
      emit(TauriEventNames.NOTIFICATION, data_2);
      setView(false);
    }
  }, [downloadStatusStore]);

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
            <Box className={"fs-16 white context_menu_single"} textAlign={"left"} sx={{ backdropFilter: "blur(10px)" }} onClick={handleCancelClick}>
              {t("cha-7_cancel")}
            </Box>
          </Box>
        </Fade>
      </Modal>
      s
    </>
  );
};

export default InstallProcessContextMenu;
