import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { invoke } from "@tauri-apps/api/tauri";
import { emit, listen } from "@tauri-apps/api/event";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";

import AlertComp from "../components/AlertComp";

import { getDownloadStatus, setDownloadStatus } from "../features/home/DownloadStatusSlice";
import { selectNotification } from "../features/settings/NotificationSlice";

import { notificationType } from "../types/settingTypes";

import notiIcon from "../assets/main/32x32.png";

import { translateString } from "../lib/api/Translate";

import { IDownloadStatus } from "../types/homeTypes";
import { INotificationGameDownloadParams, INotificationParams } from "../types/NotificationTypes";

import { TauriEventNames } from "../consts/TauriEventNames";

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
      setNotificationStatus(data.status);
      setNotificationTitle(data.translate ? await translateString(data.title) : data.title);
      setNotificationDetail(data.translate ? await translateString(data.message) : data.message);
      setNotificationOpen(true);
      setNotificationLink(data.link);
    });

    const unlisten_game_download = listen(TauriEventNames.GAME_DOWNLOAD, async (event) => {
      const data = event.payload as INotificationGameDownloadParams;
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
            isDownloading: true,
            name: data.id,
          })
        );
      } else if (data.status === "finished") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.name !== data.id) {
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
            isDownloading: false,
            name: "",
          })
        );
      } else if (data.status === "cancelled") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.name !== data.id) {
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
            isDownloading: false,
            name: "",
          })
        );
      } else if (data.status === "failed") {
        if (!downloadStatusStoreRef.current.isDownloading || downloadStatusStoreRef.current.name !== data.id) {
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
            isDownloading: false,
            name: "",
          })
        );
      }
    });

    return () => {
      unlisten_notification.then((unlistenFn) => unlistenFn());
      unlisten_game_download.then((unlistenFn) => unlistenFn());
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
