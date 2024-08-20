import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Grid, Stack, Box, Button } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { getComingGameList } from "../../features/store/ComingGameListSlice";

import SwitchBtnGameview from "./SwitchButton";
import AnimatedComponent from "../AnimatedComponent";

import storeStyles from "../../styles/StoreStyles";
import { IGameList } from "../../types/GameTypes";

import gradient1 from "../../assets/main/gradient-gameoverview.svg";
import GameOverViewPlatform from "./GameOverViewPlatform";
import GameOverViewSystemRequirement from "./GameOverViewSystemRequirement";
import GameOverViewReleaseName from "./GameOverViewReleaseName";
import GameOverViewTags from "./GameOverViewTags";
import GameOverViewShortDescription from "./GameOverViewShortDescription";
import GameOverViewFollow from "./GameOverViewFollow";
import GameOverViewSwiper from "./GameOverViewSwiper";

const ComingGameOverview = () => {
  const { t } = useTranslation();
  const { gameid } = useParams();

  const [image, setImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  //   const viewmode: viewType = useSelector(getViewmode);
  const comingGameListStore: IGameList = useSelector(getComingGameList);

  const game = useMemo(() => comingGameListStore?.games?.find((game) => game?._id === gameid), [comingGameListStore]);

  const classes = storeStyles();

  return (
    <>
      <Grid item xs={12} container className={classes.gameoverview_container}>
        <AnimatedComponent threshold={0}>
          <img src={gradient1} style={{ position: "absolute", right: 0, top: 0 }} />
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Grid item xs={12} flexDirection={"row"} justifyContent={"space-between"} display={"flex"} paddingRight={"20px"}>
              <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                <Box
                  component={"img"}
                  src={game.imageUrl}
                  width={"124px"}
                  height={"82px"}
                  sx={{
                    borderRadius: "16px",
                  }}
                />
                <Stack gap={"8px"}>
                  <Box className={"fs-40-bold white"}>{game?.title}</Box>
                  <Box
                    className={"fs-12-regular white"}
                    sx={{
                      borderRadius: "8px",
                      background: "rgba(255, 165, 0, 0.40)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      padding: "6px 2px",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "93px",
                    }}
                  >
                    COMING SOON
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
          <Grid item xs={12} container display={"flex"} justifyContent={"space-between"} marginTop={"32px"}>
            <Grid item paddingRight={"25px"} sx={{ width: "calc(100% - 320px)" }}>
              <Grid item xs={12}>
                <img
                  className="District53"
                  src={image}
                  width={"100%"}
                  style={{
                    aspectRatio: "1.78",
                    borderRadius: "16px",
                    opacity: 1,
                    flexShrink: 1,
                  }}
                  loading="lazy"
                />
              </Grid>
              <Grid
                xs={12}
                sx={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "left",
                  overflow: "hidden",
                }}
              >
                <GameOverViewSwiper game={game} currentImageIndex={currentImageIndex} setImage={setImage} setCurrentImageIndex={setCurrentImageIndex} />
              </Grid>

              <Grid item xs={12} marginTop={"32px"}>
                <Box>
                  <SwitchBtnGameview />
                </Box>
              </Grid>
            </Grid>
            <Grid item sx={{ width: "320px" }}>
              <GameOverViewShortDescription game={game} />
              <GameOverViewTags game={game} />
              <GameOverViewPlatform game={game} />
              <GameOverViewReleaseName game={game} />
              <GameOverViewSystemRequirement game={game} />
              <GameOverViewFollow game={game} />
            </Grid>
          </Grid>
        </AnimatedComponent>
      </Grid>
    </>
  );
};

export default ComingGameOverview;
