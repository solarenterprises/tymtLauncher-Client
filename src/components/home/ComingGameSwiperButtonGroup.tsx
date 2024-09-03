import { Stack, Box, IconButton } from "@mui/material";
import swiperLeftButton from "../../assets/store/swiper-left-button.svg";
import swiperRightButton from "../../assets/store/swiper-right-button.svg";

export interface IPropsComingGameSwiperButtonGroup {
  handleNextSlide: () => void;
  handlePrevSlide: () => void;
}

const ComingGameSwiperButtonGroup = ({ handleNextSlide, handlePrevSlide }: IPropsComingGameSwiperButtonGroup) => {
  return (
    <>
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: "40px",
          right: "32px",
          width: "64px",
          height: "24px",
        }}
      >
        <IconButton
          sx={{
            padding: "0px",
          }}
          onClick={handlePrevSlide}
        >
          <Box component={"img"} src={swiperLeftButton} width={"24px"} height={"24px"} />
        </IconButton>
        <IconButton
          sx={{
            padding: "0px",
          }}
          onClick={handleNextSlide}
        >
          <Box component={"img"} src={swiperRightButton} width={"24px"} height={"24px"} />
        </IconButton>
      </Stack>
    </>
  );
};

export default ComingGameSwiperButtonGroup;
