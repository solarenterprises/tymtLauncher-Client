import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

const UpdateProvider = () => {
  useEffect(() => {
    const initUpdateCheck = async () => {
      try {
        const { shouldUpdate, manifest } = await checkUpdate();
        console.log("shouldUpdate", shouldUpdate, "manifest", manifest);

        if (shouldUpdate) {
          console.log(`Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`);

          await installUpdate();
          await relaunch();
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };

    initUpdateCheck();
  }, []);

  useEffect(() => {
    let unlisten: () => void;
    const initUpdaterEvent = async () => {
      try {
        unlisten = await onUpdaterEvent(({ error, status }) => {
          console.log("Updater event: ", { error, status });
        });
      } catch (error) {
        console.error("Failed to initialize updater event listener:", error);
      }
    };

    initUpdaterEvent();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default UpdateProvider;
