import { Grid, Box, Card, Stack, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import "swiper/css";

import coming1 from "../../assets/main/gamelists/coming1.png";
import coming2 from "../../assets/main/gamelists/coming2.png";
import coming3 from "../../assets/main/gamelists/coming3.png";
import coming4 from "../../assets/main/gamelists/coming4.png";
import chevronright from "../../assets/chevronright.svg";
import chevronleft from "../../assets/chevronleft.svg";
import ellipse from "../../assets/main/ellipse.svg";
import homeStyles from "../../styles/homeStyles";

const ComingList = [
  {
    name: "Forbidden Island",
    url: coming1,
  },
  {
    name: "Lost in Time",
    url: coming2,
  },
  {
    name: "Ocean Depths Explorer",
    url: coming3,
  },
  {
    name: "Galatic Empires",
    url: coming4,
  },
  {
    name: "Galatic Empires",
    url: coming4,
  },
];

const ComingSoon = () => {
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
    <Grid item xs={12} container sx={{ marginTop: "80px" }}>
      <Card className={classes.card_coming_container}>
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
        <Grid
          xs={12}
          container
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-11_coming-soon")}
          </Box>
          <Stack flexDirection={"row"} alignItems={"center"}>
            <Button
              className={classes.trending_chevron_button}
              onClick={() => handlePrevSlide()}
            >
              <img src={chevronleft} />
            </Button>
            <Button
              onClick={() => handleNextSlide()}
              className={classes.trending_chevron_button}
            >
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
            spaceBetween={"200px"}
            grabCursor={true}
            pagination={{
              clickable: true,
            }}
            className="mySwiper"
          >
            {ComingList.map((list) => (
              <SwiperSlide key={list.name}>
                <Card className={classes.card_coming_slide}>
                  <img
                    src={list.url}
                    width={"100%"}
                    height={"165px"}
                    style={{ borderRadius: "16px" }}
                    loading="lazy"
                  />
                  <Box
                    textTransform={"none"}
                    className={"fs-20-regular white"}
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
                    {list.name}
                  </Box>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      </Card>
    </Grid>
  );
};

export default ComingSoon;
