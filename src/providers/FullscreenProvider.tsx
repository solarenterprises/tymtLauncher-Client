import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
const appWindow = getCurrentWebviewWindow();

interface FullscreenContextType {}

const FullscreenContext = createContext<FullscreenContextType>({});

export const useFullscreen = () => useContext(FullscreenContext);

interface FullscreenProviderProps {
  children: ReactNode;
}

export const FullscreenProvider: React.FC<FullscreenProviderProps> = ({ children }) => {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "F11") {
        console.log("F11 pressed");
        e.preventDefault();
        const isFullscreen = await appWindow.isFullscreen();
        if (isFullscreen) {
          await appWindow.setFullscreen(false);
        } else {
          await appWindow.setFullscreen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <FullscreenContext.Provider value={{}}>{children}</FullscreenContext.Provider>;
};
