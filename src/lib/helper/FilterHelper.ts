import { FilterOptionNames } from "../../consts/FilterOptionNames";
import { IGame } from "../../types/GameTypes";

export const filterByPlatform = (games: IGame[], platform: string) => {
  try {
    let data = games;
    if (platform === "Windows") {
    } else if (platform === "macOS") {
      data = data.filter((game) => game?.projectMeta?.wine_support?.mac);
    } else if (platform === "Linux") {
      data = data.filter((game) => game?.projectMeta?.wine_support?.linux);
    }
    return data;
  } catch (err) {
    console.error("Failed to filterByPlatform: ", err);
    return games;
  }
};

export const filterByGenre = (games: IGame[], genre: string) => {
  try {
    let data = games;
    data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === genre));
    return data;
  } catch (err) {
    console.error("Failed to filterByGenre: ", err);
    return games;
  }
};

export const filterByRank = (games: IGame[], rank: string) => {
  try {
    let data = games;
    if (rank === FilterOptionNames.RANK_ALL) {
    } else if (rank === FilterOptionNames.RANK_10) {
      data = data.filter((game) => game.rank <= 10);
    } else if (rank === FilterOptionNames.RANK_50) {
      data = data.filter((game) => game.rank <= 50);
    } else if (rank === FilterOptionNames.RANK_100) {
      data = data.filter((game) => game.rank <= 100);
    }
    return data;
  } catch (err) {
    console.error("Failed to filterByRank: ", err);
    return games;
  }
};
