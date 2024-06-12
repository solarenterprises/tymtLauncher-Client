import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Box, Card, Stack, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import homeStyles from "../../styles/homeStyles";
import trendgame1 from "../../assets/main/gamelists/trendgame1.png";
import trendgame2 from "../../assets/main/gamelists/trendgame2.png";
import trendgame3 from "../../assets/main/gamelists/trendgame3.png";
import trendgame4 from "../../assets/main/gamelists/trendgame4.png";
import trendgame5 from "../../assets/main/gamelists/trendgame5.png";
import goldeneffect from "../../assets/main/goldeneffect.svg";
import chevronright from "../../assets/chevronright.svg";
import chevronleft from "../../assets/chevronleft.svg";

const TrendingList = [
  {
    name: "Wild Frontiers",
    url: trendgame1,
  },
  {
    name: "Lost in Time",
    url: trendgame2,
  },
  {
    name: "Ocean Depths Explorer",
    url: trendgame3,
  },
  {
    name: "Galatic Empires",
    url: trendgame4,
  },
  {
    name: "Robot War",
    url: trendgame5,
  },
];

const TrendingGames = () => {
  const { t } = useTranslation();
  const homeclasses = homeStyles();
  const swiperRef = useRef<any | null>(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const handleNextSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);
  const handlePrevSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (screenWidth >= 1324) {
      setSlidesPerView(4);
    } else if (screenWidth >= 1024) {
      setSlidesPerView(3);
    }
  }, [screenWidth]);

  return (
    <Grid item xs={12} container>
      <Card className={homeclasses.trending_card}>
        <img
          src={goldeneffect}
          style={{
            width: "100%",
            position: "absolute",
            left: "0",
            top: "0px",
            zIndex: -1,
          }}
          alt={"goldeneffect"}
          loading="lazy"
        />
        <Grid xs={12} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-8_trending-games")}
          </Box>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <Button className={homeclasses.trending_chevron_button} onClick={() => handlePrevSlide()}>
              <img src={chevronleft} />
            </Button>
            <Button className={homeclasses.trending_chevron_button} onClick={() => handleNextSlide()}>
              <img src={chevronright} />
            </Button>
          </Stack>
        </Grid>
        <Grid xs={12} sx={{ width: "100%", marginTop: "32px" }}>
          <Swiper
            ref={swiperRef}
            slidesPerView={slidesPerView}
            centeredSlides={false}
            initialSlide={0}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
            }}
            spaceBetween={"100px"}
            grabCursor={true}
            slidesOffsetBefore={100}
            pagination={{
              clickable: true,
            }}
            loop={true}
            modules={[Autoplay]}
          >
            {TrendingList.map((trendingame, index) => (
              <SwiperSlide key={index}>
                <Card key={index} className={homeclasses.trending_game_card}>
                  <img src={trendingame.url} width={"100%"} height={"280px"} style={{ borderRadius: "16px", zIndex: -1 }} loading="lazy" />
                  <Box
                    textTransform={"none"}
                    className={"fs-20-regular"}
                    color={"white"}
                    sx={{
                      marginTop: "10px",
                      marginLeft: "16px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      display: "-webkit-box",
                    }}
                  >
                    {trendingame.name}
                  </Box>
                </Card>
                <Box
                  className={"fs-144-bold"}
                  color={"black"}
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "-5%",
                    transform: "translate3d(-50%, -50%, 0)",
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextStrokeColor: "#F6E27A",
                    zIndex: 20,
                  }}
                >
                  {index + 1}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Card>
    </Grid>
  );
};

export default TrendingGames;
