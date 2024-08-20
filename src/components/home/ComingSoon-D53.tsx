import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { Grid, Box } from "@mui/material";
import foxhead from "../../assets/main/foxhead-comingsoon.png";

import ComingGameCard from "./ComingGameCard";
import ComingGameSwiperButtonGroup from "./ComingGameSwiperButtonGroup";

import { getComingGameList } from "../../features/store/ComingGameListSlice";

import { IGameList } from "../../types/GameTypes";

import ellipse from "../../assets/main/ellipse.svg";

const ComingSoonD53 = () => {
  const { t } = useTranslation();
  const comingGameList: IGameList = useSelector(getComingGameList);

  const swiperRef = useRef<any | null>(null);

  const handleNextSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);

  const handlePrevSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!swiperRef.current) return;

      const totalSlides = swiperRef.current.swiper.slides.length;
      const nextIndex = swiperRef.current.swiper.activeIndex + 3;

      if (nextIndex >= totalSlides) {
        swiperRef.current.swiper.slideTo(0);
      } else {
        swiperRef.current.swiper.slideTo(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [swiperRef.current]);

  return (
    <Grid item xs={12} container sx={{ marginTop: "80px" }}>
      <Box className="card_coming_container">
        <img
          src={ellipse}
          style={{
            width: "100%",
            position: "absolute",
            left: "0",
            bottom: "0px",
            zIndex: -1,
          }}
        />
        <Grid xs={12} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-40-bold"} color={"white"} textTransform={"none"}>
            {t("hom-11_coming-soon")}
          </Box>
        </Grid>
        {comingGameList.games.length === 0 ? (
          <>
            <Box sx={{ justifyContent: "center", display: "flex", marginTop: "32px" }}>
              <img src={foxhead} width={"220px"} />
            </Box>
            <Box className={"fs-24-regular white"} textAlign={"center"} marginBottom={"30px"}>
              {t("hom-19_more-games")}
            </Box>
          </>
        ) : (
          <>
            <Swiper
              ref={swiperRef}
              spaceBetween={15}
              slidesPerView={"auto"}
              loop={false}
              style={{
                marginTop: "32px",
              }}
            >
              {comingGameList.games.map((game) => (
                <SwiperSlide style={{ width: "300px" }}>
                  <ComingGameCard key={game._id} game={game} />
                </SwiperSlide>
              ))}
            </Swiper>
            <ComingGameSwiperButtonGroup handleNextSlide={handleNextSlide} handlePrevSlide={handlePrevSlide} />
          </>
        )}
      </Box>
    </Grid>
  );
};

export default ComingSoonD53;
