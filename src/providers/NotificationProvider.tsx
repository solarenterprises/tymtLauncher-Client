import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";

import AlertComp from "../components/AlertComp";

import { selectNotification } from "../features/settings/NotificationSlice";

import { notificationType } from "../types/settingTypes";

import notiIcon from "../assets/main/32x32.png";

import { translateString } from "../lib/api/Translate";

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
  const location = useLocation();
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<string>("");
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [notificationDetail, setNotificationDetail] = useState<string>("");
  const [notificationLink, setNotificationLink] = useState<string>("");

  const notificationStore: notificationType = useSelector(selectNotification);

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
    const unlisten_error = listen("error", async (event) => {
      const message = (event.payload as any)?.message as string;
      setNotificationStatus("failed");
      setNotificationTitle(t("hom-23_error"));
      setNotificationDetail(await translateString(message));
      setNotificationOpen(true);
      setNotificationLink(null);
    });

    return () => {
      unlisten_error.then((unlistenFn) => unlistenFn());
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
