import { useMemo } from "react";
import { useSelector } from "react-redux";

import { Grid } from "@mui/material";

import StoreGameCard from "./StoreGameCard";
import AnimatedComponent from "../AnimatedComponent";

import { getGameList } from "../../features/store/GameListSlice";
import { getComingGameList } from "../../features/store/ComingGameListSlice";

import { IGame, IGameList } from "../../types/GameTypes";

import { filterByGenre, filterByPlatform, filterByRank } from "../../lib/helper/FilterHelper";

export interface IPropsStoreGameItems {
  platform?: string;
  genre?: string;
  releaseDate?: string;
  rank?: string;
}

const StoreGameItems = ({ platform, genre, rank }: IPropsStoreGameItems) => {
  const gameListStore: IGameList = useSelector(getGameList);
  const comingGameListStore: IGameList = useSelector(getComingGameList);

  const allGames: IGame[] = useMemo(() => [...gameListStore?.games, ...comingGameListStore?.games], [gameListStore, comingGameListStore]);

  const resultGames: IGame[] = useMemo(() => {
    let data = [...allGames];
    if (platform) data = filterByPlatform(data, platform);
    if (genre) data = filterByGenre(data, genre);
    // if (releaseDate) data = filterByReleaseDate(data, releaseDate);
    if (rank) data = filterByRank(data, rank);
    return data;
  }, [allGames, platform, genre, rank]);

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

export default StoreGameItems;
