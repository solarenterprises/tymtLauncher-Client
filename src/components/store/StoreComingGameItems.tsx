import { useMemo } from "react";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";

import StoreGameCard from "./StoreGameCard";
import AnimatedComponent from "../AnimatedComponent";

import { getComingGameList } from "../../features/store/ComingGameListSlice";

import { IGame, IGameList } from "../../types/GameTypes";

import { filterByGenre, filterByKeyword, filterByPlatform, filterByRank, filterByType } from "../../lib/helper/FilterHelper";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
  type?: string;
  keyword?: string;
}

const StoreComingGameItems = ({ platform, genre, rank, type, keyword }: IPropsStoreGameItems) => {
  const comingGameListStore: IGameList = useSelector(getComingGameList);

  const resultGames: IGame[] = useMemo(() => {
    let data = [...comingGameListStore?.games];
    if (platform) data = filterByPlatform(data, platform);
    if (genre) data = filterByGenre(data, genre);
    // if (releaseDate) data = filterByReleaseDate(data, releaseDate);
    if (rank) data = filterByRank(data, rank);
    if (type) data = filterByType(data, type);
    if (keyword) data = filterByKeyword(data, keyword);
    return data;
  }, [comingGameListStore, platform, genre, rank, type, keyword]);

  return (
    <Grid item xs={12} container spacing={"32px"} sx={{ width: "100%", marginTop: "0px" }}>
      {resultGames?.map((game, index) => (
        <Grid item>
          <AnimatedComponent>
            <StoreGameCard key={`${game?._id}-${index}`} game={game} isComing={comingGameListStore.games.some((element) => element._id === game._id)} />
          </AnimatedComponent>
        </Grid>
      ))}
    </Grid>
  );
};

export default StoreComingGameItems;
