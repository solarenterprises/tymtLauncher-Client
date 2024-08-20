import { Swiper, SwiperSlide } from "swiper/react";

import { IGame } from "../../types/GameTypes";

export interface IPropsGameOverViewSwiper {
  game: IGame;
  currentImageIndex: number;
  setImage: (_: string) => void;
  setCurrentImageIndex: (_: number) => void;
}

const GameOverViewSwiper = ({ game, currentImageIndex, setImage, setCurrentImageIndex }: IPropsGameOverViewSwiper) => {
  return (
    <Swiper spaceBetween={15} slidesPerView={"auto"} loop={false}>
      {game?.projectMeta?.gallery?.map((image, index) => (
        <SwiperSlide style={{ width: "150px" }}>
          <img
            key={`${index}`}
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
  );
};

export default GameOverViewSwiper;
