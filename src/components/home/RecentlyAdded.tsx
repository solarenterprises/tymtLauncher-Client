import { Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BasicGameList } from "../../lib/game/BasicGameList";
import StoreGameCard from "../store/StoreGameCard";
import { IGame, IGameList } from "../../types/GameTypes";
import { useSelector } from "react-redux";
import { getGameList } from "../../features/store/GameListSlice";
import { useMemo } from "react";
import AnimatedComponent from "../AnimatedComponent";

const RecentlyAddedD53 = () => {
  const { t } = useTranslation();

  const gameListStore: IGameList = useSelector(getGameList);

  const activeGameList: IGame[] = useMemo(() => gameListStore?.games?.filter((one) => one?.visibilityState === "active"), [gameListStore]);
  const displayGameList: IGame[] = useMemo(() => [...BasicGameList, ...activeGameList], [activeGameList, BasicGameList]);

  return (
    <>
      <Grid item xs={12} container sx={{ position: "relative" }}>
        <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-10_recently-added")}
          </Box>
        </Grid>
        <Grid container sx={{ width: "100%", marginTop: "0px" }} spacing={"32px"}>
          {displayGameList?.map((game, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={game} isComing={false} />
              </AnimatedComponent>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RecentlyAddedD53;
