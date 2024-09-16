import { readDir } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { type, arch } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";

import tymtStorage from "../Storage";
import { District53 } from "../game/district 53/District53";

import { local_server_port, tymt_version } from "../../configs";

import { ISaltToken } from "../../types/accountTypes";
import { IGame, IGameReleaseNative } from "../../types/GameTypes";

export async function runUrlArgs(url: string, args: string[]) {
  return invoke("run_url_args", {
    url: url,
    args: args,
  });
}

export async function isInstalled(game: IGame) {
  try {
    await readDir(`${await appDataDir()}v${tymt_version}/games/${game.project_name}`);
    return true;
  } catch (err) {
    console.log("Failed to isInstalled: ", err);
    return false;
  }
}

export const runNewGame = async (game: IGame) => {
  try {
    const fullExecutablePath = await getFullExecutablePathNewGame(game);
    const gameExtension = (await getExecutableFileExtension(game)).toLowerCase();

    const platform = await type();

    switch (platform) {
      case "linux":
        switch (gameExtension) {
          case "appimage":
            await runUrlArgs(fullExecutablePath, [`--appimage-extract-and-run`]);
            break;
        }
        break;
      case "windows":
        switch (gameExtension) {
          case "exe":
            await runUrlArgs(fullExecutablePath, []);
            break;
          case "bat":
            await runUrlArgs(fullExecutablePath, []);
            break;
        }
        break;
      case "macos":
        switch (gameExtension) {
          case "":
            await runUrlArgs(fullExecutablePath, []);
            break;
          case "app":
            await runUrlArgs("open", [`-a`, fullExecutablePath]);
            break;
        }
        break;
    }

    return true;
  } catch (err) {
    console.error("Failed to runNewGame: ", err);
    return false;
  }
};

export const runD53 = async (serverIp: string, autoMode: boolean) => {
  try {
    const fullExePath: string = await getFullExecutablePathNewGame(District53);
    const d53_server = serverIp.split(":")[0];
    const d53_port = serverIp.split(":")[1];
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const token = saltTokenStore.token;
    const launcherUrl = `http://localhost:${local_server_port}`;

    if (!fullExePath || !d53_server || !d53_port || !token || !launcherUrl) {
      console.log(`Failed to runD53: fullExePath ${fullExePath}, d53_server ${d53_server}, d53_port ${d53_port}, token ${token}, launcherUrl ${launcherUrl}`);
      return false;
    }

    const platform = await type();
    let args: string[] = [];

    switch (platform) {
      case "linux":
        args = [`--appimage-extract-and-run`, `--launcher_url`, launcherUrl, `--token`, token];
        break;
      case "windows":
        args = [`--launcher_url`, launcherUrl, `--token`, token];
        break;
      case "macos":
        args = [`--launcher_url`, launcherUrl, `--token`, token];
        break;
    }
    if (autoMode) args.push(`--address`, d53_server, `--port`, d53_port, `--go`);

    switch (platform) {
      case "linux":
        await runUrlArgs(fullExePath, args);
        break;
      case "windows":
        await runUrlArgs(fullExePath, args);
        break;
      case "macos":
        await runUrlArgs("open", ["-a", fullExePath, "--args", ...args]);
        break;
    }

    return true;
  } catch (err) {
    console.log("Failed to runD53: ", err);
    return false;
  }
};

export async function openDir() {
  return invoke("open_directory", {
    path: await appDataDir(),
  });
}

export async function openLink(url: string) {
  try {
    await open(url);
  } catch (err) {
    console.error("Failed to open link:", err);
  }
}

export const checkOnline = async (): Promise<boolean> => {
  try {
    await fetch("https://www.google.com", {
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const downloadFileToAppDir = async (game: IGame) => {
  try {
    console.log("downloadFileToAppDir");

    const url: string = await getDownloadLinkNewGame(game);
    const downloadPath: string = await getDownloadFileFullPath(game);
    if (!url || !downloadPath) return false;

    console.log("url", url);
    console.log("downloadPath", downloadPath);

    await invoke("download_to_app_dir", {
      url: url,
      fileLocation: downloadPath,
    });

    return true;
  } catch (err) {
    console.error("Failed to downloadFileToAppDir: ", err);
    return false;
  }
};

export const installGame = async (game: IGame) => {
  try {
    console.log("installGame");

    const fileLocation: string = await getDownloadFileFullPath(game);
    const installDir: string = await getInstallDir(game);
    if (!fileLocation || !installDir) return false;

    console.log("fileLocation", fileLocation);
    console.log("installDir", installDir);

    const fullExecutablePath = await getFullExecutablePathNewGame(game);
    const sourceExtension = (await getDownloadFileExtension(game))?.toLocaleLowerCase();
    const platform = await type();

    switch (platform) {
      case "linux":
        switch (sourceExtension) {
          case "zip":
            await invoke("unzip_linux", {
              fileLocation: fileLocation,
              installDir: installDir,
            });
            break;
          case "appimage":
            await invoke("move_appimage_linux", {
              fileLocation: fileLocation,
              installDir: installDir,
            });

            break;
        }
        await invoke("set_permission", {
          executablePath: fullExecutablePath,
        });
        break;
      case "windows":
        switch (sourceExtension) {
          case "zip":
            await invoke("unzip_windows", {
              fileLocation: fileLocation,
              installDir: installDir,
            });
            break;
        }
        break;
      case "macos":
        switch (sourceExtension) {
          case "zip":
            await invoke("unzip_macos", {
              fileLocation: fileLocation,
              installDir: installDir,
            });
            break;
          case "bz2":
            await invoke("untarbz2_macos", {
              fileLocation: fileLocation,
              installDir: installDir,
            });
            break;
        }
        await invoke("set_permission", {
          executablePath: fullExecutablePath,
        });
        break;
    }

    return true;
  } catch (err) {
    console.log("Failed to installGame: ", err);
    return false;
  }
};

export const downloadAndInstallNewGame = async (game: IGame) => {
  try {
    console.log("downloadAndInstallNewGame");

    await downloadFileToAppDir(game);
    await installGame(game);
    await deleteDownloadFile(game);

    return true;
  } catch (err) {
    console.error("Failed to downloadAndInstallNewGame: ", err);
    return false;
  }
};

export const getDownloadLinkNewGame = async (game: IGame) => {
  try {
    const fullExecutablePath = await getFullExecutablePathNewGame(game);
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.external_url;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.external_url;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.external_url;
            break;
        }
        break;
    }
    if (fullExecutablePath && !res) {
      res = await getDownloadLinkFromMetaUri(game);
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadLinkNewGame: ", err);
    return "";
  }
};

export const getFullExecutablePathNewGame = async (game: IGame) => {
  try {
    const prefix: string = await appDataDir();
    const exePath: string = await getExecutablePathNewGame(game);
    const fullPath = prefix + `v${tymt_version}/games/${game.project_name}/` + exePath;
    console.log("getFullExecutablePathNewGame", fullPath);
    return fullPath;
  } catch (err) {
    console.log("Failed to getFullExecutablePathNewGame: ", err);
    return "";
  }
};

export const getExecutablePathNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.executable;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.executable;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.executable;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getExecutablePathNewGame: ", err);
    return "";
  }
};

export const getDownloadFileNameNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.name;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.name;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.name;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadFileNameNewGame: ", err);
    return "";
  }
};

export const getGameType = (game: IGame) => {
  try {
    const res = game?.projectMeta?.type;
    return res;
  } catch (err) {
    console.log("Failed to getGameType: ", err);
  }
};

export const getGameReleaseBrowser = (game: IGame) => {
  try {
    if (game?.projectMeta?.type !== "browser") {
      return null;
    }
    const res = game?.releaseMeta?.platforms?.web;
    return res;
  } catch (err) {
    console.log("Failed to getGameReleaseBrowser: ", err);
    return null;
  }
};

export const getGameReleaseNative = async (game: IGame) => {
  try {
    if (game?.projectMeta?.type !== "native") {
      return null;
    }
    let res: IGameReleaseNative;
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64;
            break;
        }
        break;
      case "windows":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64;
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.log("Failed to getGameOsCpu: ", err);
    return null;
  }
};

export const getDownloadSizeNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.downloadSize;
    return res;
  } catch (err) {
    console.error("Failed to getDownloadSizeNewGame: ", err);
    return "";
  }
};

export const getInstallSizeNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const gameReleaseNative = await getGameReleaseNative(game);
    res = gameReleaseNative?.installSize;
    return res;
  } catch (err) {
    console.error("Failed to getInstallSizeNewGame: ", err);
    return "";
  }
};

export const getSupportOSList = (game: IGame) => {
  try {
    let res: string[] = [];
    if (game?.releaseMeta?.platforms?.darwin_amd64 || game?.releaseMeta?.platforms?.darwin_arm64) {
      res = ["darwin", ...res];
    }
    if (game?.releaseMeta?.platforms?.linux_amd64 || game?.releaseMeta?.platforms?.linux_arm64) {
      res = ["linux", ...res];
    }
    if (game?.releaseMeta?.platforms?.windows_amd64 || game?.releaseMeta?.platforms?.windows_arm64) {
      res = ["windows", ...res];
    }
    return res;
  } catch (err) {
    console.log("Failed to getSupportOSList: ", err);
    return [];
  }
};

export const getDownloadFileFullPath = async (game: IGame) => {
  try {
    const fileName = await getDownloadFileNameNewGame(game);
    const res = `${await appDataDir()}${fileName}`;
    console.log("getDownloadFileFullPath", res);
    return res;
  } catch (err) {
    console.log("Failed to getDownloadFileFullPath: ", err);
    return "";
  }
};

export const getInstallDir = async (game: IGame) => {
  try {
    const res = `${await appDataDir()}v${tymt_version}/games/${game?.project_name}`;
    console.log("getInstallDir", res);
    return res;
  } catch (err) {
    console.log("Failed to getInstallDir: ", err);
    return "";
  }
};

export const getDownloadFileExtension = async (game: IGame) => {
  try {
    const fileName = await getDownloadFileNameNewGame(game);
    const parts = fileName.split(".");
    return parts.length > 1 ? parts.pop() || null : null;
  } catch (err) {
    console.log("Failed to getDownloadFileExtension: ", err);
    return "";
  }
};

export const getExecutableFileExtension = async (game: IGame) => {
  try {
    const url = await getExecutablePathNewGame(game);
    const parts = url.split(".");
    return parts.length > 1 ? parts.pop() || "" : "";
  } catch (err) {
    console.log("Failed to getExecutableFileExtension:", err);
    return "";
  }
};

export const deleteDownloadFile = async (game: IGame) => {
  try {
    const fullPath = await getDownloadFileFullPath(game);
    console.log("deleteDownloadFile", fullPath);

    await invoke("delete_file", {
      fileLocation: fullPath,
    });

    return true;
  } catch (err) {
    console.log("Failed to deleteDownloadFile: ", err);
    return false;
  }
};

export const getOsCpu = async () => {
  try {
    const platform = await type();
    const cpu = await arch();

    let resPlatform: string = "";
    let resCpu: string = "";

    switch (platform) {
      case "linux":
        resPlatform = "linux";
        break;
      case "windows":
        resPlatform = "windows";
        break;
      case "macos":
        resPlatform = "darwin";

        break;
    }

    switch (cpu) {
      case "arm":
        resCpu = "arm64";
        break;
      case "x86_64":
        resCpu = "amd64";
        break;
    }
    const res = `${resPlatform}_${resCpu}`;
    return res;
  } catch (err) {
    console.log("Failed to getOsCpu: ", err);
  }
};

export const fetchMetaUri = async (game) => {
  try {
    const metaUri = game?.releaseMeta?.meta_uri;
    const res1: any = await tauriFetch(metaUri, {
      method: "GET",
      connectTimeout: 30
    });
    const res = await res1.json().data;
    return res;
  } catch (err) {
    console.log("Failed to fetchMetaUri: ", err);
  }
};

export const getDownloadLinkFromMetaUri = async (game) => {
  try {
    const data = await fetchMetaUri(game);
    const osCpu = await getOsCpu();
    const res: string = data?.platforms[osCpu]?.external_url;
    return res;
  } catch (err) {
    console.log("Failed to getDownloadLinkFromMetaUri: ", err);
  }
};
