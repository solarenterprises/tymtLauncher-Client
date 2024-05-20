import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/api/shell";
import { appWindow } from "@tauri-apps/api/window";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import {
  selectNotification,
  setNotification,
} from "../features/settings/NotificationSlice";
import { notificationType } from "../types/settingTypes";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { invoke } from "@tauri-apps/api/tauri";

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
  const accountStore: accountType = useSelector(getAccount);

  const callSetTrayItemsEnabled = async (
    itemIds: String[],
    enabled: boolean
  ) => {
    try {
      await invoke("set_tray_items_enabled", { itemIds, enabled });
      console.log("set_tray_items_enabled function invoked successfully");
    } catch (error) {
      console.error("Error invoking set_tray_items_enabled function:", error);
    }
  };

  useEffect(() => {
    if (!accountStore.isLoggedIn) {
      const itemIds = ["signout"];
      const enabled = false;
      callSetTrayItemsEnabled(itemIds, enabled);
    } else {
      const itemIds = ["signout"];
      const enabled = true;
      callSetTrayItemsEnabled(itemIds, enabled);
    }
  }, [accountStore.isLoggedIn]);

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

    const unlisten_disable_notifications = listen(
      "disable_notifications",
      (event) => {
        dispatch(setNotification({ ...notificationStore, alert: false }));
        console.log(event.payload as string);
      }
    );

    return () => {
      unlisten_wallet.then((unlistenFn) => unlistenFn());
      unlisten_games.then((unlistenFn) => unlistenFn());
      unlisten_signout.then((unlistenFn) => unlistenFn());
      unlisten_about.then((unlistenFn) => unlistenFn());
      unlisten_disable_notifications.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return <TrayContext.Provider value={{}}>{children}</TrayContext.Provider>;
};
