import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from "@tauri-apps/api/event";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import { appDataDir } from "@tauri-apps/api/path";
import { removeDir } from "@tauri-apps/api/fs";

import { tymt_version } from "../configs";
import { TauriEventNames } from "../consts/TauriEventNames";

import AlertComp from "../components/AlertComp";

import { getDownloadStatus, setDownloadStatus } from "../features/home/DownloadStatusSlice";
import { selectNotification } from "../features/settings/NotificationSlice";

import notiIcon from "../assets/main/32x32.png";

import { translateString } from "../lib/api/Translate";

import { IDownloadStatus } from "../types/homeTypes";
import { notificationType } from "../types/settingTypes";
import { IGame } from "../types/GameTypes";
import { INotificationGameDownloadParams, INotificationGameDownloadProgressParams, INotificationParams } from "../types/NotificationTypes";
import { addRemoveStatus, delRemoveStatus } from "../features/home/RemoveStatusSlice";

interface NotificationContextType {
  setNotificationOpen: (open: boolean) => void;
  setNotificationStatus: (status: string) => void;
  setNotificationTitle: (title: string) => void;
  setNotificationDetail: (detail: any) => void;
  setNotificationLink: (detail: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  setNotificationOpen: () => {},
  setNotificationStatus: () => {},
  setNotificationTitle: () => {},
  setNotificationDetail: () => {},
  setNotificationLink: () => {},
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<string>("");
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [notificationDetail, setNotificationDetail] = useState<string>("");
  const [notificationLink, setNotificationLink] = useState<string>("");

  const notificationStore: notificationType = useSelector(selectNotification);
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const downloadStatusStoreRef = useRef(downloadStatusStore);

  useEffect(() => {
    downloadStatusStoreRef.current = downloadStatusStore;
  }, [downloadStatusStore]);

  useEffect(() => {
    const init = async () => {
      let permissionGranted = await isPermissionGranted();
      const windowIsVisible = await invoke<boolean>("is_window_visible");
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      if (permissionGranted && !windowIsVisible) {
        sendNotification({
          title: notificationTitle,
          body: notificationDetail,
          icon: notiIcon,
        });
      }
    };

    if (notificationOpen && notificationStore.alert) {
      init();
    }
  }, [notificationStatus, notificationLink, notificationOpen, notificationTitle, notificationDetail, notificationStore.alert]);

  useEffect(() => {
    const unlisten_notification = listen(TauriEventNames.NOTIFICATION, async (event) => {
      const data = event.payload as INotificationParams;
      console.log("TauriEventNames.NOTIFICATION", data);
      setNotificationStatus(data.status);
      setNotificationTitle(data.translate ? await translateString(data.title) : data.title);
      setNotificationDetail(data.translate ? await translateString(data.message) : data.message);
      setNotificationOpen(true);
      setNotificationLink(data.link);
    });

    const unlisten_game_download = listen(TauriEventNames.GAME_DOWNLOAD, async (event) => {
      const data = event.payload as INotificationGameDownloadParams;
      console.log("TauriEventNames.GAME_DOWNLOAD", data);
      if (data.status === "started") {
        const noti: INotificationParams = {
          status: "success",
          title: t("alt-28_download-start"),
          message: t("alt-29_wait-for-a-few"),
          link: null,
          translate: false,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
        dispatch(
          setDownloadStatus({
            progress: 0,
            speed: 0,
            total: 0,
            isDownloading: true,
            game: data.game,
          })
        );
      } else if (data.status === "finished") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.game._id !== data.game._id) {
          return;
        }
        const noti: INotificationParams = {
          status: "success",
          title: t("alt-7_download-finish"),
          message: t("alt-8_now-play-game"),
          link: null,
          translate: false,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
        dispatch(
          setDownloadStatus({
            progress: 0,
            speed: 0,
            total: 0,
            isDownloading: false,
            game: null,
          })
        );
      } else if (data.status === "cancelled") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.game._id !== data.game._id) {
          return;
        }
        const noti: INotificationParams = {
          status: "success",
          title: "Success",
          message: "Downloading has been cancelled!",
          link: null,
          translate: true,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
        dispatch(
          setDownloadStatus({
            progress: 0,
            speed: 0,
            total: 0,
            isDownloading: false,
            game: null,
          })
        );
      } else if (data.status === "failed") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.game._id !== data.game._id) {
          return;
        }
        const noti: INotificationParams = {
          status: "failed",
          title: t("alt-5_os-not-support"),
          message: t("alt-6_os-not-support-intro"),
          link: null,
          translate: false,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
        dispatch(
          setDownloadStatus({
            progress: 0,
            speed: 0,
            total: 0,
            isDownloading: false,
            game: null,
          })
        );
      }
    });

    const unlisten_game_download_progress = listen(TauriEventNames.GAME_DOWNLOAD_PROGRESS, async (event) => {
      const data = event.payload as INotificationGameDownloadProgressParams;
      // console.log("TauriEventNames.GAME_DOWNLOAD_PROGRESS", data);
      dispatch(
        setDownloadStatus({
          ...downloadStatusStoreRef.current,
          speed: data.speed,
          progress: data.downloaded,
          total: data.total_size,
        })
      );
    });

    const unlisten_fs_remove_dir = listen(TauriEventNames.FS_REMOVE_DIR, async (event) => {
      const game = event.payload as IGame;
      if (!game) {
        console.log("Failed to unlisten_fs_remove_dir: event.payload is not IGame!");
        return;
      }
      console.log("unlisten_fs_remove_dir", game);
      dispatch(addRemoveStatus(game));
      try {
        const dirPath = (await appDataDir()) + `v${tymt_version}/games/${game?.project_name}`;
        await removeDir(dirPath, {
          recursive: true,
        });
      } catch (err) {
        console.log("Failed to unlisten_fs_remove_dir: ", err);
      }
      dispatch(delRemoveStatus(game));
    });

    return () => {
      unlisten_notification.then((unlistenFn) => unlistenFn());
      unlisten_game_download.then((unlistenFn) => unlistenFn());
      unlisten_game_download_progress.then((unlistenFn) => unlistenFn());
      unlisten_fs_remove_dir.then((unlistenFn) => unlistenFn());
    };
  });

  return (
    <NotificationContext.Provider
      value={{
        setNotificationOpen,
        setNotificationStatus,
        setNotificationTitle,
        setNotificationDetail,
        setNotificationLink,
      }}
    >
      {children}
      <AlertComp
        open={notificationStore.alert && location.pathname !== "/d53-transaction" ? notificationOpen : false}
        status={notificationStatus}
        title={notificationTitle}
        detail={notificationDetail}
        setOpen={setNotificationOpen}
        link={notificationLink}
      />
    </NotificationContext.Provider>
  );
};
