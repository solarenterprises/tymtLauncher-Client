import { FilterOptionNames } from "../../consts/FilterOptionNames";
import { IGame } from "../../types/GameTypes";

export const filterByPlatform = (games: IGame[], platform: string) => {
  try {
    let data = games;
    if (platform === "Windows") {
      data = data.filter((game) => game?.releaseMeta?.platforms?.windows_amd64 || game?.releaseMeta?.platforms?.windows_arm64);
    } else if (platform === "macOS") {
      data = data.filter((game) => game?.releaseMeta?.platforms?.darwin_amd64 || game?.releaseMeta?.platforms?.darwin_arm64);
    } else if (platform === "Linux") {
      data = data.filter((game) => game?.releaseMeta?.platforms?.linux_amd64 || game?.releaseMeta?.platforms?.linux_arm64);
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
    if (genre === FilterOptionNames.GENRE_ALL) {
    } else if (genre === FilterOptionNames.GENRE_ACTION) {
      data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === "Action"));
    } else if (genre === FilterOptionNames.GENRE_ADVENTURE) {
      data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === "Adventure"));
    } else if (genre === FilterOptionNames.GENRE_STRATEGY) {
      data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === "Strategy"));
    } else if (genre === FilterOptionNames.GENRE_ROLE_PLAYING) {
      data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === "Role-Playing"));
    } else if (genre === FilterOptionNames.GENRE_SIMULATION) {
      data = data.filter((game) => game.projectMeta.tags.some((tag) => tag === "Simulation"));
    }
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

export const filterByType = (games: IGame[], type: string) => {
  try {
    let data = games;
    if (type === FilterOptionNames.TYPE_ALL) {
    } else if (type === FilterOptionNames.TYPE_NATIVE) {
      data = data.filter((game) => game.projectMeta.type === "native");
    } else if (type === FilterOptionNames.TYPE_BROWSER) {
      data = data.filter((game) => game.projectMeta.type === "browser");
    }
    return data;
  } catch (err) {
    console.error("Failed to filterByType: ", err);
    return games;
  }
};

export const filterByKeyword = (games: IGame[], keyword: string) => {
  try {
    let data = games;
    data = data.filter((game) => game.title.toLowerCase().includes(keyword.toLowerCase()));
    return data;
  } catch (err) {
    console.error("Failed to filterByKeyword: ", err);
    return games;
  }
};
