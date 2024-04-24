import React, { createContext, useContext, useState, ReactNode } from "react";
import AlertComp from "../components/AlertComp";
import { useSelector } from "react-redux";
import { selectNotification } from "../features/settings/NotificationSlice";
import { notificationType } from "../types/settingTypes";

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
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationStatus, setNotificationStatus] = useState<string>("");
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [notificationDetail, setNotificationDetail] = useState<string>("");
  const [notificationLink, setNotificationLink] = useState<string>("");

  const notificationStore: notificationType = useSelector(selectNotification);

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
