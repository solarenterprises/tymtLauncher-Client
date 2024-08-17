import { exists, readDir } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";
import { type, arch } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";
import Games, { PlatformFile, PlatformFileForOS } from "../game/Game";
import { local_server_port, production_version, tymt_version } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";
import path from "path";

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

export async function downloadGame(game_key: string) {
  try {
    let platform = type();
    let cpu = arch();
    let game = Games[game_key];
    let url = "";
    switch (platform) {
      case "linux":
        url = production_version === "prod" ? game.executables.linux?.prod?.url ?? "" : game.executables.linux?.dev?.url ?? "";
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            url = production_version === "prod" ? game.executables.macosArm?.prod?.url ?? "" : game.executables.macosArm?.dev?.url ?? "";
            break;
          case "x86_64":
            url = production_version === "prod" ? game.executables.macosIntel?.prod?.url ?? "" : game.executables.macosIntel?.dev?.url ?? "";
            break;
        }
        break;
      case "windows":
        url = production_version === "prod" ? game.executables.windows64?.prod?.url ?? "" : game.executables.windows64?.dev?.url ?? "";
        break;
    }
    if (!url) {
      return false;
    }
    console.log("downloadGame: ", url);
    switch (platform) {
      case "linux":
        switch (production_version === "prod" ? game.executables.linux?.prod?.type ?? "" : game.executables.linux.dev?.type ?? "") {
          case "zip":
            await downloadAndUnzipLinux(
              url,
              `/v${tymt_version}/games/${game_key}`,
              production_version === "prod" ? game.executables.linux?.prod?.exePath ?? "" : game.executables.linux.dev?.exePath ?? ""
            );
            break;
          case "appimage":
            await downloadAppImageLinux(url, `/v${tymt_version}/games/${game_key}`);
            break;
        }
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            switch (production_version === "prod" ? game.executables.macosArm?.prod?.type ?? "" : game.executables.macosArm?.dev?.type ?? "") {
              case "zip":
                await downloadAndUnzipMacOS(
                  url,
                  `/v${tymt_version}/games/${game_key}`,
                  production_version === "prod" ? game.executables.macosArm?.prod?.exePath ?? "" : game.executables.macosArm?.dev?.exePath ?? ""
                );
                break;
              case "tar.bz2":
                await downloadAndUntarbz2MacOS(
                  url,
                  `/v${tymt_version}/games/${game_key}`,
                  production_version === "prod" ? game.executables.macosArm?.prod?.exePath ?? "" : game.executables.macosArm?.dev?.exePath ?? ""
                );
                break;
            }
            break;
          case "x86_64":
            switch (production_version === "prod" ? game.executables.macosIntel?.prod?.type ?? "" : game.executables.macosIntel?.dev?.type ?? "") {
              case "zip":
                await downloadAndUnzipMacOS(
                  url,
                  `/v${tymt_version}/games/${game_key}`,
                  production_version === "prod" ? game.executables.macosIntel?.prod?.exePath ?? "" : game.executables.macosIntel?.dev?.exePath ?? ""
                );
                break;
              case "tar.bz2":
                await downloadAndUntarbz2MacOS(
                  url,
                  `/v${tymt_version}/games/${game_key}`,
                  production_version === "prod" ? game.executables.macosIntel?.prod?.exePath ?? "" : game.executables.macosIntel?.dev?.exePath ?? ""
                );
                break;
            }
            break;
        }
        break;
      case "windows":
        await downloadAndUnzipWindows(url, `/v${tymt_version}/games/${game_key}`);
        break;
    }
    return true;
  } catch (err) {
    console.error("Failed to downloadGame: ", err);
    return false;
  }
}

export async function isInstalled(game_key: string) {
  try {
    await readDir(`${await appDataDir()}/v${tymt_version}/games/${game_key}`);
    return true;
  } catch (err) {
    console.error("Failed to isInstalled: ", err);
    return false;
  }
}

export async function runGame(game_key: string, serverIp?: string, autoMode?: boolean) {
  try {
    const dataDir = await appDataDir();
    let exePath = "";
    const platform = type();
    const cpu = arch();
    switch (platform) {
      case "linux":
        exePath =
          production_version === "prod" ? Games[game_key].executables.linux?.prod?.exePath ?? "" : Games[game_key].executables.linux?.dev?.exePath ?? "";
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            exePath =
              production_version === "prod"
                ? Games[game_key].executables.macosArm?.prod?.exePath ?? ""
                : Games[game_key].executables.macosArm?.dev?.exePath ?? "";
            break;
          case "x86_64":
            exePath =
              production_version === "prod"
                ? Games[game_key].executables.macosIntel?.prod?.exePath ?? ""
                : Games[game_key].executables.macosIntel?.dev?.exePath ?? "";
            break;
        }
        break;
      case "windows":
        exePath =
          production_version === "prod"
            ? Games[game_key].executables.windows64?.prod?.exePath ?? ""
            : Games[game_key].executables.windows64?.dev?.exePath ?? "";
        break;
    }
    let url = path.join(dataDir, `v${tymt_version}`, `games`, game_key, exePath);
    let args: string[] = [];
    if (!(await exists(url))) {
      console.error("Failed to runGame: url not existing");
      return false;
    }
    if (game_key === "district53") {
      const d53_ip: string = serverIp;
      if (!d53_ip) {
        return false;
      }
      const d53_server = d53_ip.split(":")[0];
      const d53_port = d53_ip.split(":")[1];
      const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
      const token = saltTokenStore.token;
      const launcherUrl = `http://localhost:${local_server_port}`;
      switch (platform) {
        case "linux":
          switch (production_version === "prod" ? Games[game_key].executables.linux?.prod?.type ?? "" : Games[game_key].executables.linux?.dev?.type ?? "") {
            case "appimage":
              args = [`--appimage-extract-and-run`, `--launcher_url`, launcherUrl, `--token`, token];
              break;
            case "zip":
              break;
          }
          break;
        case "windows":
          args = [`--launcher_url`, launcherUrl, `--token`, token];
          break;
        case "macos":
          args = [`--launcher_url`, launcherUrl, `--token`, token];
          break;
      }
      if (autoMode) args.push(`--address`, d53_server, `--port`, d53_port, `--go`);
    }
    console.log("runGame: ", url, args);
    switch (platform) {
      case "linux":
        await runUrlArgs(url, args);
        break;
      case "windows":
        await runUrlArgs(url, args);
        break;
      case "macos":
        await runUrlArgs("open", ["-a", url, "--args", ...args]);
        break;
    }
    return true;
  } catch (err) {
    console.error("Failed to runGame: ", err);
    return false;
  }
}

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

export async function getGameFile(game_key: string) {
  try {
    const game = Games[game_key];
    const platform = type();
    const cpu = arch();
    let gameFileForOs: PlatformFileForOS;
    let gameFile: PlatformFile;
    switch (platform) {
      case "linux":
        gameFileForOs = game.executables.linux;
        break;
      case "windows":
        gameFileForOs = game.executables.windows64;
        break;
      case "macos":
        switch (cpu) {
          case "arm":
            gameFileForOs = game.executables.macosArm;
            break;
          case "x86_64":
            gameFileForOs = game.executables.macosIntel;
            break;
        }
        break;
    }
    if (!gameFileForOs) {
      console.error("Failed to getGameFile: Not support this OS!");
      return null;
    }
    switch (production_version) {
      case "prod":
        gameFile = gameFileForOs.prod;
        break;
      case "dev":
        gameFile = gameFileForOs.dev;
        break;
    }
    if (!gameFile) {
      console.error("Failed to getGameFile: Not support!", production_version);
      return null;
    }
    return gameFile;
  } catch (err) {
    console.error("Failed to getGameFile: ", err);
    return null;
  }
}

export async function getGameFileSize(game_key: string) {
  try {
    const gameFile = await getGameFile(game_key);
    if (!gameFile) {
      console.error("Failed to getFileSize: No gameFile!");
      return null;
    }
    let gameFileSize = gameFile.size;
    if (!gameFileSize) {
      console.error("Failed to getFileSize: No gameFileSize!");
      return null;
    }
    return gameFileSize;
  } catch (err) {
    console.error("Failed to getFileSize: ", err);
    return null;
  }
}
