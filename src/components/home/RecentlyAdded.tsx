import { Grid, Box, Card, Chip, Stack, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import recently1 from "../../assets/main/gamelists/Recently1.png";
import recently2 from "../../assets/main/gamelists/Recently2.png";
import recently3 from "../../assets/main/gamelists/Recently3.png";
import recently4 from "../../assets/main/gamelists/Recently4.png";
import chevronright from "../../assets/chevronright.svg";
import chevronleft from "../../assets/chevronleft.svg";
import solar from "../../assets/chains/solar.svg";
import homeStyles from "../../styles/homeStyles";

const RecentList = [
  {
    name: "Whispering Woods",
    url: recently1,
  },
  {
    name: "Speed Demons",
    url: recently2,
  },
  {
    name: "Ancient Legends",
    url: recently3,
  },
  {
    name: "Urban Mayhem",
    url: recently4,
  },
  {
    name: "Solar Legends",
    url: recently4,
  },
];

const RecentlyAdded = () => {
  const { t } = useTranslation();
  const classes = homeStyles();
  const swiperRef = useRef<any | null>(null);
  const handleNextSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slideNext();
  }, []);
  const handlePrevSlide = useCallback(() => {
    if (!swiperRef.current) return;
    swiperRef.current.swiper.slidePrev();
  }, []);

  const [screenWidth, setScreenWidth] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

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
    <Grid item xs={12} container sx={{ position: "relative", marginTop: "80px" }}>
      <Grid xs={12} container sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
          {t("hom-10_recently-added")}
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
          {RecentList.map((recent) => (
            <SwiperSlide key={recent.name}>
              <Card className={classes.card_freegame_container}>
                <img src={recent.url} width={"100%"} height={"204px"} style={{ borderRadius: "16px" }} />
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
                    {recent.name}
                  </Box>
                  <Chip label={t("hom-18_action")} className={classes.card_genre_label} />
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <img src={solar} width={"20px"} height={"20px"} />
                    <Grid>
                      <Box className={"fs-16-regular"} color={"white"}>
                        1200.00
                      </Box>
                    </Grid>
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

export default RecentlyAdded;
