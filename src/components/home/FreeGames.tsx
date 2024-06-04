import { Grid, Box, Card, Chip, Stack, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import postercard1 from "../../assets/main/gamelists/postercard1.png";
import postercard2 from "../../assets/main/gamelists/postercard2.png";
import postercard3 from "../../assets/main/gamelists/postercard3.png";
import postercard4 from "../../assets/main/gamelists/postercard4.png";
import chevronright from "../../assets/chevronright.svg";
import chevronleft from "../../assets/chevronleft.svg";
import solar from "../../assets/chains/solar.svg";
import homeStyles from "../../styles/homeStyles";

const FreegameList = [
  {
    name: "Starlight Odyssey",
    url: postercard1,
  },
  {
    name: "Neon Racer 3000",
    url: postercard2,
  },
  {
    name: "Shadow Tactics",
    url: postercard3,
  },
  {
    name: "Mystic Quests:Legends",
    url: postercard4,
  },
  {
    name: "Mystic Quests:Legends",
    url: postercard4,
  },
];

const FreeGames = () => {
  const { t } = useTranslation();
  const classes = homeStyles();
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
    <Grid item xs={12} container sx={{ position: "relative", overflow: "hidden", marginTop: "80px" }}>
      <Grid xs={12} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
          {t("hom-9_free-games")}
        </Box>
        <Stack flexDirection={"row"} alignItems={"center"}>
          <Button className={classes.trending_chevron_button} onClick={() => handlePrevSlide()}>
            <img src={chevronleft} />
          </Button>
          <Button className={classes.trending_chevron_button} onClick={() => handleNextSlide()}>
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
          spaceBetween={"100px"}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          // modules={[Pagination]}
          className="mySwiper"
        >
          {FreegameList.map((freegame) => (
            <SwiperSlide key={freegame.name}>
              <Card className={classes.card_freegame_container}>
                <img src={freegame.url} width={"100%"} height={"204px"} style={{ borderRadius: "16px" }} loading="lazy" />
                <Stack
                  flexDirection={"column"}
                  sx={{
                    marginTop: "20px",
                    marginLeft: "16px",
                    alignItems: "flex-start",
                  }}
                  spacing={2}
                >
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
                    {freegame.name}
                  </Box>
                  <Chip label={t("hom-18_action")} className={classes.card_genre_label} />
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <img src={solar} width={"20px"} height={"20px"} />
                    <Grid>
                      <Box className={"fs-16-regular"} color={"white"}>
                        0.0
                      </Box>
                    </Grid>
                    <Box
                      className={"fs-12-regular white"}
                      sx={{
                        display: "flex",
                        padding: "4px",
                        justifyContent: "left",
                        borderRadius: "10px",
                        alignItems: "center",
                        background: "rgba(0, 128, 0, 0.40)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                      }}
                    >
                      {t("hom-15_free")}
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
};

export default FreeGames;
