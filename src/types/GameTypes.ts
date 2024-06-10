import windows from "../assets/main/windows.png";
import mac from "../assets/main/mac.svg";
import linux from "../assets/main/linux.svg";

export enum platformEnum {
  "windows",
  "mac",
  "linux",
}

export const platformIconMap: Map<number, string> = new Map([
  [platformEnum.windows, windows],
  [platformEnum.mac, mac],
  [platformEnum.linux, linux],
]);
