import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const UpdateProvider = () => {
  useEffect(() => {
    const initUpdateCheck = async () => {
      try {
        const update = await check();
        if (update?.available) {
          console.log(`Update to ${update.version} available! Date: ${update.date}`);
          console.log(`Release notes: ${update.body}`);
          await update.downloadAndInstall();
          // requires the `process` plugin
          await relaunch();
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    };

    initUpdateCheck();
  }, []);

  useEffect(() => {
    // let unlisten: () => void;
    // const initUpdaterEvent = async () => {
    //   try {
    //     unlisten = await onUpdaterEvent(({ error, status }) => {
    //       console.log("Updater event: ", { error, status });
    //     });
    //   } catch (error) {
    //     console.error("Failed to initialize updater event listener:", error);
    //   }
    // };

    // initUpdaterEvent();

    // return () => {
    //   if (unlisten) {
    //     unlisten();
    //   }
    // };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default UpdateProvider;
