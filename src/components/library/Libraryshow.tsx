import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BasicGameList } from "../../lib/game/BasicGameList";

import { Grid, Box, Stack } from "@mui/material";

import StoreGameCard from "../store/StoreGameCard";
import AnimatedComponent from "../AnimatedComponent";

import { isInstalled } from "../../lib/helper/DownloadHelper";

import NoGamePng from "../../assets/main/nogames.png";

import { IGame } from "../../types/GameTypes";

export interface IPropsLibraryShow {
  status: number;
}

const LibraryShow = ({ status }: IPropsLibraryShow) => {
  const { t } = useTranslation();

  const installedList: IGame[] = useMemo(() => BasicGameList?.filter(async (game) => await isInstalled(game)), [BasicGameList]);
  const uninstalledList: IGame[] = useMemo(
    () => BasicGameList?.filter((game) => !installedList?.some((one) => one?._id === game?._id)),
    [BasicGameList, installedList]
  );

  return (
    <>
      <Grid item xs={12}>
        {status === 0 && <Box className={"fs-40-bold white"}>{t("lib-1_your-games")}</Box>}
        {status === 1 && <Box className={"fs-40-bold white"}>{t("lib-2_wishlist")}</Box>}
        {status === 2 && <Box className={"fs-40-bold white"}>{t("lib-3_download")}</Box>}
        {status === 3 && <Box className={"fs-40-bold white"}>{t("lib-5_coming")}</Box>}
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"32px"}>
        {status === 0 &&
          installedList?.map((installedGame, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={installedGame} />
              </AnimatedComponent>
            </Grid>
          ))}
        {status === 0 && installedList?.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
        {status === 2 &&
          uninstalledList?.map((uninstalledGame, index) => (
            <Grid item key={index}>
              <AnimatedComponent>
                <StoreGameCard game={uninstalledGame} />
              </AnimatedComponent>
            </Grid>
          ))}
        {status === 2 && uninstalledList?.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={NoGamePng} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default LibraryShow;
