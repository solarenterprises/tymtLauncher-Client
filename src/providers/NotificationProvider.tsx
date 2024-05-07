import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AlertComp from "../components/AlertComp";
import { useSelector } from "react-redux";
import { selectNotification } from "../features/settings/NotificationSlice";
import { notificationType } from "../types/settingTypes";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
import notiIcon from "../assets/main/32x32.png";
import { decrypt } from "../lib/api/Encrypt";
import { selectEncryptionKeyStore } from "../features/chat/Chat-encryptionkeySlice";
import { encryptionkeyStoreType } from "../types/chatTypes";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/tauri";

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

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<string>("");
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [notificationDetail, setNotificationDetail] = useState<string>("");
  const [notificationLink, setNotificationLink] = useState<string>("");

  const notificationStore: notificationType = useSelector(selectNotification);

  const encryptionStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  useEffect(() => {
    const init = async () => {
      let permissionGranted = await isPermissionGranted();
      const windowIsVisible = await invoke<boolean>("is_window_visible");
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      if (permissionGranted && !windowIsVisible) {
        if (notificationStatus === "message") {
          const senderId = notificationLink.split("?senderId=")[1];
          const existkey = encryptionStore.encryption_Keys[senderId];
          console.log("existkey", existkey);
          console.log("encryptionStore", encryptionStore);
          console.log("senderId", senderId);
          console.log("notiLink", notificationLink);
          const decryptedmessage: string = existkey
            ? await decrypt(notificationDetail, existkey)
            : t("not-13_cannot-decrypt");
          sendNotification({
            title: notificationTitle,
            body: decryptedmessage,
            icon: notiIcon,
          });
        } else {
          sendNotification({
            title: notificationTitle,
            body: notificationDetail,
            icon: notiIcon,
          });
        }
      }
    };

    if (notificationOpen && notificationStore.alert) {
      init();
    }
  }, [
    notificationStatus,
    notificationLink,
    notificationOpen,
    notificationTitle,
    notificationDetail,
    notificationStore.alert,
  ]);

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
        open={notificationStore.alert ? notificationOpen : false}
        status={notificationStatus}
        title={notificationTitle}
        detail={notificationDetail}
        setOpen={setNotificationOpen}
        link={notificationLink}
      />
    </NotificationContext.Provider>
  );
};
