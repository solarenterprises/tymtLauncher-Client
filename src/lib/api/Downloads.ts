import {
  exists,
  readDir,
  // readTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { type, arch } from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";
import Games, { PlatformFile, PlatformFileForOS } from "../game/Game";
import { local_server_port, production_version, tymt_version } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";
import path from "path";
import { Command } from "@tauri-apps/api/shell";
import { emit } from "@tauri-apps/api/event";

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
    let platform = await type();
    let cpu = await arch();
    let game = Games[game_key];
    let url = "";
    switch (platform) {
      case "Linux":
        url = production_version === "prod" ? game.executables.linux?.prod?.url ?? "" : game.executables.linux?.dev?.url ?? "";
        break;
      case "Darwin":
        switch (cpu) {
          case "arm":
            url = production_version === "prod" ? game.executables.macosArm?.prod?.url ?? "" : game.executables.macosArm?.dev?.url ?? "";
            break;
          case "x86_64":
            url = production_version === "prod" ? game.executables.macosIntel?.prod?.url ?? "" : game.executables.macosIntel?.dev?.url ?? "";
            break;
        }
        break;
      case "Windows_NT":
        url = production_version === "prod" ? game.executables.windows64?.prod?.url ?? "" : game.executables.windows64?.dev?.url ?? "";
        break;
    }
    if (!url) {
      return false;
    }
    console.log("downloadGame: ", url);
    switch (platform) {
      case "Linux":
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
      case "Darwin":
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
        // Install depencies for D53 on mac, temp solution
        if (game_key === "district53") {
          try {
            console.log("install_dependencies_for_d53_on_mac");
            emit("install_dependencies_for_d53_on_mac", true);
            const command = new Command("brew", [
              "install",
              "cmake",
              "freetype",
              "gettext",
              "gmp",
              "hiredis",
              "jpeg-turbo",
              "jsoncpp",
              "leveldb",
              "libogg",
              "libpng",
              "libvorbis",
              "luajit",
              "zstd",
              "gettext",
              "ffmpeg@6",
              "mysql-client",
            ]);

            command.on("close", (data) => {
              console.log(`command finished with code ${data.code} and signal ${data.signal}`);
              emit("install_dependencies_for_d53_on_mac", false);
            });

            command.stdout.on("data", (line) => {
              console.log(`stdout: ${line}`);
            });

            command.stderr.on("data", (line) => {
              console.error(`stderr: ${line}`);
            });

            await command.spawn();
            console.log("install_dependencies_for_d53_on_mac: Finished!");
          } catch (err) {
            console.error("Failed to install_dependencies_for_d53_on_mac: ", err);
            emit("install_dependencies_for_d53_on_mac", false);
          }
        }
        break;
      case "Windows_NT":
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
    await readDir(`${await appDataDir()}v${tymt_version}/games/${game_key}`);
    return true;
  } catch (err) {
    console.error("Failed to isInstalled: ", err);
    return false;
  }
}

export async function runGame(game_key: string, serverIp?: string) {
  try {
    const dataDir = await appDataDir();
    let exePath = "";
    const platform = await type();
    const cpu = await arch();
    switch (platform) {
      case "Linux":
        exePath =
          production_version === "prod" ? Games[game_key].executables.linux?.prod?.exePath ?? "" : Games[game_key].executables.linux?.dev?.exePath ?? "";
        break;
      case "Darwin":
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
      case "Windows_NT":
        exePath =
          production_version === "prod"
            ? Games[game_key].executables.windows64?.prod?.exePath ?? ""
            : Games[game_key].executables.windows64?.dev?.exePath ?? "";
        break;
    }
    let url = path.join(dataDir, `v${tymt_version}`, `games`, game_key, exePath);
    let args: string[];
    // const filePath: string = dataDir + `games.config.json`;
    // let configJson = JSON.parse(await readTextFile(filePath));
    // let url = configJson[game_key].path;
    if (!(await exists(url))) {
      console.error("Failed to runGame: url not existing");
      return false;
    }
    console.log("runGame: ", url, args);
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
        case "Linux":
          switch (production_version === "prod" ? Games[game_key].executables.linux?.prod?.type ?? "" : Games[game_key].executables.linux?.dev?.type ?? "") {
            case "appimage":
              args = [`--appimage-extract-and-run`, `--address`, d53_server, `--port`, d53_port, `--launcher_url`, launcherUrl, `--token`, token, `--go`];
              break;
            case "zip":
              break;
          }
          break;
        case "Windows_NT":
          args = [`--address`, d53_server, `--port`, d53_port, `--launcher_url`, launcherUrl, `--token`, token, `--go`];
          break;
        case "Darwin":
          args = [`--address`, d53_server, `--port`, d53_port, `--launcher_url`, launcherUrl, `--token`, token, `--go`];
          break;
      }
      await runUrlArgs(url, args);
    } else {
      switch (platform) {
        case "Linux":
          await runUrlArgs(url, args);
          break;
        case "Windows_NT":
          await runUrlArgs(url, args);
          break;
        case "Darwin":
          await runUrlArgs("open", [url, ...args]);
          break;
      }
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
    const platform = await type();
    const cpu = await arch();
    let gameFileForOs: PlatformFileForOS;
    let gameFile: PlatformFile;
    switch (platform) {
      case "Linux":
        gameFileForOs = game.executables.linux;
        break;
      case "Windows_NT":
        gameFileForOs = game.executables.windows64;
        break;
      case "Darwin":
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
