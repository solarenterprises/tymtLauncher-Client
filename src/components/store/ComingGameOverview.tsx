import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";

import { Grid, Stack, Box, Button } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { getComingGameList } from "../../features/store/ComingGameListSlice";

import Overview from "./Overview";
import Review from "./Review";
import SwitchBtnGameview from "./SwitchButton";
import AnimatedComponent from "../AnimatedComponent";

import { getViewmode } from "../../features/store/Gameview";

import { platformEnum, platformIconMap } from "../../types/GameTypes";

import storeStyles from "../../styles/StoreStyles";
import { viewType } from "../../types/storeTypes";
import { IGameList } from "../../types/GameTypes";

import gradient1 from "../../assets/main/gradient-gameoverview.svg";
import GameOverViewPlatform from "./GameOverViewPlatform";
import GameOverViewSystemRequirement from "./GameOverViewSystemRequirement";
import GameOverViewReleaseName from "./GameOverViewReleaseName";
import GameOverViewTags from "./GameOverViewTags";
import GameOverViewShortDescription from "./GameOverViewShortDescription";
import GameOverViewFollow from "./GameOverViewFollow";

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
            <Grid item xs={8} flexDirection={"row"} justifyContent={"space-between"} display={"flex"} paddingRight={"20px"}>
              <Stack flexDirection={"row"} alignItems={"center"}>
                {/* <Box
                  component={"img"}
                  height={game?.name === "Veloren" ? "55px" : "84px"}
                  src={game?.logo}
                  sx={{
                    borderRadius: "16px",
                  }}
                /> */}
                <Box className="m-10">
                  <Box className={"fs-40-bold white"}>{game?.title}</Box>
                </Box>
              </Stack>
              {/* <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <img src={solar} width={"24px"} />
                <Box className={"fs-20-regular white"}>0.0</Box>
                <Box className={classes.chip_free}>{t("hom-15_free")}</Box>
              </Stack> */}
            </Grid>
            <Grid item xs={4} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} paddingLeft={"10px"}>
              <Grid item xs={9}>
                <Button className={"red-button-Gameoverview"} fullWidth onClick={async () => {}}>
                  {t("hom-20_install-game")}
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button className="button_navbar_common" onClick={async () => {}}>
                  <DeleteOutlineRoundedIcon
                    sx={{
                      color: "white",
                    }}
                  />
                </Button>
              </Grid>
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
                <Swiper spaceBetween={15} slidesPerView={"auto"} loop={false}>
                  {game?.projectMeta?.gallery?.map((image, index) => (
                    <SwiperSlide style={{ width: "150px" }}>
                      <img
                        key={`${gameid}-${index}`}
                        src={image.src}
                        width={`150px`}
                        height={`120px`}
                        onClick={() => {
                          setImage(image.src);
                          setCurrentImageIndex(index);
                        }}
                        style={{
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          opacity: currentImageIndex === index ? 1 : 0.7,
                          border: currentImageIndex === index ? "2px solid #52e1f2" : "none",
                          borderRadius: "16px",
                          marginRight: "10px",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>

              <Grid item xs={12} marginTop={"32px"}>
                <Box>
                  <SwitchBtnGameview />
                </Box>
                {/* {viewmode.mode === "overview" && (
                  <AnimatedComponent threshold={0}>
                    <Overview />
                  </AnimatedComponent>
                )}
                {viewmode.mode === "review" && (
                  <AnimatedComponent threshold={0}>
                    <Review />
                  </AnimatedComponent>
                )} */}
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
