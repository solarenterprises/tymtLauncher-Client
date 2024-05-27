import { exists /*, readDir */, readTextFile } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { type } from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";
import Games from "../game/Game";
import { local_server_port, tymt_version } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../Storage";

export async function downloadAppImageLinux(url: string, targetDir: string) {
  return invoke("download_appimage_linux", {
    url: url,
    target: targetDir,
  });
}

export async function downloadAndUnzipLinux(
  url: string,
  targetDir: string,
  exe: string
) {
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
  });
}

export async function downloadAndUnzipMacOS(
  url: string,
  targetDir: string,
  exe: string
) {
  return invoke("download_and_unzip_macos", {
    url: url,
    target: targetDir,
    exeLocation: exe,
  });
}

export async function downloadAndUntarbz2MacOS(
  url: string,
  targetDir: string,
  exe: string
) {
  return invoke("download_and_untarbz2_macos", {
    url: url,
    target: targetDir,
    exeLocation: exe,
  });
}

export async function downloadAndInstallAppImage(
  url: string,
  targetFile: string
) {
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

export async function downloadGame(game_key: string) {
  let platform = await type();
  let game = Games[game_key];
  let url = "";
  switch (platform) {
    case "Linux":
      url = game.executables.linux.url;
      break;
    case "Darwin":
      url = game.executables.macos.url;
      break;
    case "Windows_NT":
      url = game.executables.windows64.url;
      break;
  }
  if (url === "") {
    return false;
  }
  switch (platform) {
    case "Linux":
      switch (game.executables.linux.type) {
        case "zip":
          await downloadAndUnzipLinux(
            url,
            `/v${tymt_version}/games/${game_key}`,
            game.executables.linux.exePath
          );
          break;
        case "appimage":
          await downloadAppImageLinux(
            url,
            `/v${tymt_version}/games/${game_key}`
          );
          break;
      }
      break;
    case "Darwin":
      switch (game.executables.macos.type) {
        case "zip":
          await downloadAndUnzipMacOS(
            url,
            `/v${tymt_version}/games/${game_key}`,
            game.executables.macos.exePath
          );
          break;
        case "tar.bz2":
          await downloadAndUntarbz2MacOS(
            url,
            `/v${tymt_version}/games/${game_key}`,
            game.executables.macos.exePath
          );
          break;
      }
      break;
    case "Windows_NT":
      await downloadAndUnzipWindows(url, `/v${tymt_version}/games/${game_key}`);
      break;
  }
  return true;
}

export async function isInstalled(game_key: string) {
  // try {
  //   await readDir(`${await appDataDir()}v${tymt_version}/games/${game_key}`);
  //   return true;
  // } catch (error) {
  //   return false;
  // }
  console.log(game_key);
  return true;
}

export async function runGame(game_key: string, serverIp?: string) {
  try {
    // const dataDir = await appDataDir();
    let exePath = "";
    const platform = await type();
    switch (platform) {
      case "Linux":
        exePath = Games[game_key].executables.linux.exePath;
        break;
      case "Darwin":
        exePath = Games[game_key].executables.macos.exePath;
        break;
      case "Windows_NT":
        exePath = Games[game_key].executables.windows64.exePath;
        break;
    }
    // let url = dataDir + `v${tymt_version}/games/${game_key}` + exePath;
    console.log("exePath", exePath);
    let url = "";
    const filePath: string = "D:/tymt.config.txt";
    url = await readTextFile(filePath);
    console.log("url", url);
    if (!(await exists(url))) {
      return false;
    }
    if (game_key === "district53") {
      const d53_ip: string = serverIp;
      if (!d53_ip) {
        return false;
      }
      const d53_server = d53_ip.split(":")[0];
      const d53_port = d53_ip.split(":")[1];
      const saltTokenStore: ISaltToken = JSON.parse(
        tymtStorage.get(`saltToken`)
      );
      const token = saltTokenStore.token;
      const launcherUrl = `http://localhost:${local_server_port}`;
      switch (platform) {
        case "Linux":
          switch (Games[game_key].executables.linux.type) {
            case "appimage":
              url += ` --appimage-extract-and-run --address ${d53_server} --port ${d53_port} --launcher_url ${launcherUrl} --token ${token} --go`;
              break;
            case "zip":
              break;
          }
          break;
        case "Windows_NT":
          url += ` --address ${d53_server} --port ${d53_port} --launcher_url ${launcherUrl} --token ${token} --go`;
          break;
        case "Darwin":
          break;
      }
    } else {
      switch (platform) {
        case "Linux":
          break;
        case "Darwin":
          await runAppMacOS(url);
          return true;
        case "Windows_NT":
          break;
      }
    }
    await runUrl(url);
    return true;
  } catch (err) {
    console.log(err);
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
