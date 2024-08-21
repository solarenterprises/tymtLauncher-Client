import { IGame } from "../../types/GameTypes";

export const filterByPlatform = (games: IGame[], platform: string) => {
  let data = games;
  if (platform === "Windows") {
  } else if (platform === "macOS") {
    data = data.filter((game) => game?.projectMeta?.wine_support?.mac);
  } else if (platform === "Linux") {
    data = data.filter((game) => game?.projectMeta?.wine_support?.linux);
  }
  return data;
};
