import React, { createContext, useContext, useEffect, ReactNode, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-shell";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { selectNotification, setNotification } from "../features/settings/NotificationSlice";
import { notificationType } from "../types/settingTypes";
import { invoke } from "@tauri-apps/api/core";
import { getInstallStatus, setInstallStatus } from "../features/home/InstallStatusSlice";
import { IInstallStatus } from "../types/homeTypes";
const appWindow = getCurrentWebviewWindow()

interface TrayContextType {}

const TrayContext = createContext<TrayContextType>({});

export const useTray = () => useContext(TrayContext);

interface TrayProviderProps {
  children: ReactNode; // This line ensures `children` is accepted
}

export const TrayProvider: React.FC<TrayProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const notificationStore: notificationType = useSelector(selectNotification);
  const installStatusStore: IInstallStatus = useSelector(getInstallStatus);

  const notificationStoreRef = useRef(notificationStore);

  useEffect(() => {
    notificationStoreRef.current = notificationStore;
  }, [notificationStore]);

  const callSetTrayItemsEnabled = async (itemIds: String[], enabled: boolean) => {
    try {
      await invoke("set_tray_items_enabled", { itemIds, enabled });
    } catch (error) {
      console.error("Failed to callSetTrayItemsEnabled:", error);
    }
  };

  useEffect(() => {
    if (true) {
      const itemIds = ["signout"];
      const enabled = false;
      callSetTrayItemsEnabled(itemIds, enabled);
    } else {
      const itemIds = ["signout"];
      const enabled = true;
      callSetTrayItemsEnabled(itemIds, enabled);
    }
  }, []);

  useEffect(() => {
    const unlisten_wallet = listen("wallet", (event) => {
      navigate("/wallet");
      appWindow.setFocus();
      console.log(event.payload as string);
    });

    const unlisten_games = listen("games", (event) => {
      navigate("/library");
      appWindow.setFocus();
      console.log(event.payload as string);
    });

    const unlisten_about = listen("about-tymt", (event) => {
      try {
        open("https://tymt.com");
        console.log(event.payload as string);
      } catch (err) {
        console.error("Failed to open link:", err);
      }
    });

    const unlisten_signout = listen("signout", (event) => {
      navigate("/start");
      appWindow.setFocus();
      console.log(event.payload as string);
    });

    const unlisten_disable_notifications = listen("disable_notifications", (event) => {
      dispatch(setNotification({ ...notificationStoreRef.current, alert: false }));
      console.log(event.payload as string);
    });

    const unlisten_install_dependencies = listen("install_dependencies_for_d53_on_mac", (event) => {
      dispatch(
        setInstallStatus({
          ...installStatusStore,
          isInstalling: event.payload as boolean,
          id: (event.payload as boolean) ? "district53" : "",
        })
      );
      console.log(event.payload as string);
    });

    return () => {
      unlisten_wallet.then((unlistenFn) => unlistenFn());
      unlisten_games.then((unlistenFn) => unlistenFn());
      unlisten_signout.then((unlistenFn) => unlistenFn());
      unlisten_about.then((unlistenFn) => unlistenFn());
      unlisten_disable_notifications.then((unlistenFn) => unlistenFn());
      unlisten_install_dependencies.then((unlistenFn) => unlistenFn());
    };
  }, [notificationStoreRef.current]);

  return <TrayContext.Provider value={{}}>{children}</TrayContext.Provider>;
};
