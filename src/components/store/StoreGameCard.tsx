import { useNavigate } from "react-router-dom";

import { Box, Stack } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";

import { IGame } from "../../types/GameTypes";

import solar from "../../assets/chains/solar.svg";

export interface IPropsStoreGameCard {
  game: IGame;
  isComing?: boolean;
}

const StoreGameCard = ({ game, isComing }: IPropsStoreGameCard) => {
  const navigate = useNavigate();

  return (
    <div className="store-game-card">
      <div className="store-game-card2">
        <Box
          sx={{
            width: "276px",
            height: "300px",
            flexShrink: "0",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            background: "rgba(255, 255, 255, 0.02)",
            backgroundBlendMode: "luminosity",
            backdropFilter: "blur(50px)",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "all 0.3s ease",
            position: "relative",
            "&:hover": {
              backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.1))",
              border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.1))",
            },
            "&:active": {
              background: "var(--bg-stroke-icon-button-bg-active-30, rgba(128, 128, 128, 0.3))",
            },
          }}
          onClick={() => {
            navigate(`/coming/${game._id}`);
          }}
        >
          {isComing && (
            <Box
              className={"fs-12-regular white"}
              sx={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "linear-gradient(to right, rgb(196, 176, 102), rgb(125, 108, 49))",
                borderRadius: "50ch",
                padding: "4px",
              }}
            >
              COMING SOON
            </Box>
          )}
          <Box
            component={"img"}
            src={game?.imageUrl}
            width={"100%"}
            height={"165px"}
            sx={{
              borderRadius: "16px",
              objectFit: "cover",
            }}
          />

          <Stack padding="16px" gap={"16px"}>
            <Box className="fs-20-regular white">{game.title}</Box>

            <Swiper
              spaceBetween={"4px"}
              slidesPerView={"auto"}
              loop={false}
              style={{
                width: "100%",
              }}
            >
              {game?.projectMeta?.tags?.map((tag, index) => (
                <SwiperSlide style={{ width: "auto" }}>
                  <Box key={index} className="fs-14-regular white card_genre_label">
                    {tag}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box component={"img"} width={"20px"} height={"20px"} src={solar} />
              <Box className={"fs-16-regular white"}>0.0</Box>
            </Stack>
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default StoreGameCard;
