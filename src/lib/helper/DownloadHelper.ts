import { readDir } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { type, arch } from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";

import tymtStorage from "../Storage";
import { District53 } from "../game/district 53/District53";

import { local_server_port, tymt_version } from "../../configs";

import { ISaltToken } from "../../types/accountTypes";
import { IGame } from "../../types/GameTypes";

export async function downloadAppImageLinux(url: string, targetDir: string) {
  return invoke("download_appimage_linux", {
    url: url,
    target: targetDir,
    authorization: `Basic ${btoa("dev:shine skype sherry occupant python cure urology phantom broadband overlying groin sensation")}`,
  });
}

export async function downloadAndUnzipLinux(url: string, targetDir: string, exe: string) {
  return invoke("download_and_unzip_linux", {
    url: url,
    target: targetDir,
    exeLocation: exe,
  });
}

export async function downloadAndUnzipWindows(url: string, targetDir: string) {
  return invoke("download_and_unzip_windows", {
    url: url,
    target: targetDir,
    authorization: `Basic ${btoa("dev:shine skype sherry occupant python cure urology phantom broadband overlying groin sensation")}`,
  });
}

export async function downloadAndUnzipMacOS(url: string, targetDir: string, exe: string) {
  return invoke("download_and_unzip_macos", {
    url: url,
    target: targetDir,
    exeLocation: exe,
    authorization: `Basic ${btoa("dev:shine skype sherry occupant python cure urology phantom broadband overlying groin sensation")}`,
  });
}

export async function downloadAndUntarbz2MacOS(url: string, targetDir: string, exe: string) {
  return invoke("download_and_untarbz2_macos", {
    url: url,
    target: targetDir,
    exeLocation: exe,
  });
}

export async function downloadAndInstallAppImage(url: string, targetFile: string) {
  return invoke("download_and_install_appimage", {
    url: url,
    target: targetFile,
  });
}

export async function downloadFileLinux(url: string, targetFile: string) {
  return invoke("download_file", {
    url: url,
    target: targetFile,
  });
}

export async function runLinux(url: string) {
  return invoke("run_linux", {
    url: url,
  });
}

export async function runWindows(url: string) {
  return invoke("run_exe", {
    url: url,
  });
}

export async function runMacOS(url: string) {
  return invoke("run_macos", {
    url: url,
  });
}

export async function runAppMacOS(url: string) {
  return invoke("run_app_macos", {
    url: url,
  });
}

export async function runUrl(url: string) {
  return invoke("run_exe", {
    url: url,
  });
}

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

export const runNewGame = async (game: IGame, args: string[]) => {
  try {
    const executablePath = await getExecutablePathNewGame(game);
    console.log("executablePath: ", executablePath);
    if (!executablePath) return false;
    const fullExecutablePath = `${await appDataDir()}v${tymt_version}/games/${game.project_name}/${executablePath}`;
    console.log("fullExecutablePath: ", fullExecutablePath);
    if (!fullExecutablePath) return false;
    await runUrlArgs(fullExecutablePath, args);
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
      case "Linux":
        args = [`--appimage-extract-and-run`, `--launcher_url`, launcherUrl, `--token`, token];
        break;

      case "Windows_NT":
        args = [`--launcher_url`, launcherUrl, `--token`, token];
        break;
      case "Darwin":
        args = [`--launcher_url`, launcherUrl, `--token`, token];
        break;
    }
    if (autoMode) args.push(`--address`, d53_server, `--port`, d53_port, `--go`);

    switch (platform) {
      case "Linux":
        await runUrlArgs(fullExePath, args);
        break;
      case "Windows_NT":
        await runUrlArgs(fullExePath, args);
        break;
      case "Darwin":
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

    if ((await getDownloadFileExtension(game))?.toLocaleLowerCase() === "zip") {
      await invoke("unzip_windows", {
        fileLocation: fileLocation,
        installDir: installDir,
      });
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
    let res: string = "";
    if (game.projectMeta.type === "browser") {
      return res;
    }
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "Linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.external_url;
            break;
        }
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.external_url;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.external_url;
            break;
        }
        break;
      case "Darwin":
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
      case "Linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.executable;
            break;
        }
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.executable;
            break;
        }
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.executable;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.executable;
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
      case "Linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.name;
            break;
        }
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.name;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.name;
            break;
        }
        break;
      case "Darwin":
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

export const getDownloadSizeNewGame = async (game: IGame) => {
  try {
    let res: string = "";
    if (game?.projectMeta?.type === "browser") {
      return res;
    }
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "Linux":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.linux_arm64?.downloadSize;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.linux_amd64?.downloadSize;
            break;
        }
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.windows_arm64?.downloadSize;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.downloadSize;
            break;
        }
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            res = game?.releaseMeta?.platforms?.darwin_arm64?.downloadSize;
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.darwin_amd64?.downloadSize;
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadSizeNewGame: ", err);
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
    console.log("getSourceFileLocation");
    const fileName = await getDownloadFileNameNewGame(game);
    const res = `${await appDataDir()}${fileName}`;
    return res;
  } catch (err) {
    console.log("Failed to getSourceFileLocation: ", err);
    return "";
  }
};

export const getInstallDir = async (game: IGame) => {
  try {
    console.log("getInstallDir");
    const res = `${await appDataDir()}v${tymt_version}/games/${game?.project_name}`;
    return res;
  } catch (err) {
    console.log("Failed to getInstallDir: ", err);
    return "";
  }
};

export const getDownloadFileExtension = async (game: IGame) => {
  try {
    const url = await getDownloadLinkNewGame(game);
    const parts = url.split(".");
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
    return parts.length > 1 ? parts.pop() || null : null;
  } catch (err) {
    console.log("Failed to getExecutableFileExtension:", err);
    return "";
  }
};

export const deleteDownloadFile = async (game: IGame) => {
  try {
    const fullPath = await getDownloadFileFullPath(game);

    await invoke("delete_file", {
      fileLocation: fullPath,
    });

    return true;
  } catch (err) {
    console.log("Failed to deleteDownloadFile: ", err);
    return false;
  }
};
