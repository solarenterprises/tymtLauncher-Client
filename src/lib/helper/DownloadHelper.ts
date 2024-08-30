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
    console.error("Failed to isInstalled: ", err);
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

export const downloadNewGame = async (game: IGame) => {
  try {
    let url: string = await getDownloadLinkNewGame(game);
    let executablePath: string = await getExecutablePathNewGame(game);
    let fileName: string = await getDownloadFileNameNewGame(game);
    let gameId: string = game?.project_name;

    console.log("downloadNewGame: ", gameId, url, executablePath, fileName);

    if (!url || !executablePath || !fileName || !gameId) {
      return false;
    }
    await downloadAndUnzipNewGame(gameId, url, executablePath, fileName);
    return true;
  } catch (err) {
    console.error("Failed to downloadGame: ", err);
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
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.external_url;
            break;
        }
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadLinkNewGame: ", err);
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
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.name;
            break;
        }
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadFileNameNewGame: ", err);
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
        break;
      case "Windows_NT":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            res = game?.releaseMeta?.platforms?.windows_amd64?.downloadSize;
            break;
        }
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            break;
          case "x86_64":
            break;
        }
        break;
    }
    return res;
  } catch (err) {
    console.error("Failed to getDownloadSizeNewGame: ", err);
  }
};

export const downloadAndUnzipNewGame = async (game_id: string, url: string, executable_path: string, file_name: string) => {
  try {
    const platform = await type();
    switch (platform) {
      case "Linux":
        break;
      case "Windows_NT":
        await downloadAndUnzipNewGameWindows(`/v${tymt_version}/games/${game_id}`, url, executable_path, file_name);
        break;
      case "Darwin":
        break;
    }
  } catch (err) {
    console.error("Failed to downloadAndUnzipNewGame: ", err);
  }
};

export const downloadAndUnzipNewGameWindows = async (install_path: string, url: string, executable_path: string, file_name: string) => {
  try {
    return invoke("download_and_unzip_new_game_windows", {
      installPath: install_path,
      url: url,
      executablePath: executable_path,
      fileName: file_name,
    });
  } catch (err) {
    console.error("Failed to downloadAndUnzipNewGameWindows: ", err);
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
