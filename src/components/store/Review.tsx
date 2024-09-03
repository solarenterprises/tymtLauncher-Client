import { Box, Rating, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import storeStyles from "../../styles/StoreStyles";
import ComingModal from "../ComingModal";
import { useState } from "react";
import noreviews from "../../assets/main/noreviews.png";

const labels: { [index: string]: string } = {
  0.5: "0/1",
  1: "1",
  1.5: "1/2",
  2: "2",
  2.5: "2/3",
  3: "3",
  3.5: "3/4",
  4: "4",
  4.5: "4/5",
  5: "5",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

function StyledStarIcon(props) {
  const { value, ...other } = props;
  return (
    <StarIcon
      sx={{
        color: "white",
        "& .MuiRating-iconEmpty": {
          borderColor: "1px solid white",
        },
        "& .MuiRating-icon": {
          borderRadius: "50%",
        },
      }}
      {...other}
    />
  );
}

const Review = () => {
  const classes = storeStyles();
  const { t } = useTranslation();
  const [view, setView] = useState(false);
  return (
    <>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"}>
        <Box className={"fs-40-bold white"} marginTop={"24px"}>
          {t("ga-11_review")}
          <Box
            sx={{
              width: 200,
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <Rating name="hover-feedback" value={5} precision={0.5} readOnly getLabelText={getLabelText} IconContainerComponent={StyledStarIcon} />
            <Box className={"fs-18-bold white"} marginLeft={"5px"}>
              {labels[5]}
            </Box>
          </Box>
        </Box>
        <Button className={classes.modal_btn_left} onClick={() => setView(true)}>
          <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
            {t("ga-26_leave-review")}
          </Box>
        </Button>
      </Stack>
      <Box
        sx={{
          justifyContent: "center",
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <img src={noreviews} width={"300px"} height={"300px"} />
        </Box>
        <Box className={"fs-20-regular white"} textAlign={"center"} marginTop={"24px"}>
          {t("ga-27_no-review")}
        </Box>
      </Box>
      <ComingModal open={view} setOpen={setView} />
    </>
  );
};

export default Review;
