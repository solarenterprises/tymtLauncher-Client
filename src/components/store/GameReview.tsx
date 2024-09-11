import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Stack } from "@mui/material";

import ComingModal from "../modals/ComingModal";
import FeedbackCard from "./FeedbackCard";

import ReviewAPI from "../../lib/api/ReviewAPI";

import noreviews from "../../assets/main/noreviews.png";

import storeStyles from "../../styles/StoreStyles";

import { IGame } from "../../types/GameTypes";
import { IResFetchReviewsByGameId } from "../../types/ReviewAPITypes";
import ReviewRating from "./ReviewRating";
import ReviewPagination from "./ReviewPagination";

export interface IPropsGameReview {
  game: IGame;
}

const GameReview = ({ game }: IPropsGameReview) => {
  const classes = storeStyles();

  const { t } = useTranslation();

  const [view, setView] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [reviewData, setReviewData] = useState<IResFetchReviewsByGameId>(null);

  const averageStar = useMemo(() => reviewData?.averageStar, [reviewData?.averageStar]);
  const feedbackList = useMemo(() => reviewData?.feedbacks, [reviewData?.feedbacks]);
  const totalPage = useMemo(
    () => Math.ceil(reviewData?.total / parseInt(reviewData?.pageSize)),
    [Math.ceil(reviewData?.total / parseInt(reviewData?.pageSize))]
  );

  const fetchReviewData = async (currentPage: number) => {
    try {
      const data = await ReviewAPI.fetchReviewsByGameId(game?._id, currentPage, 5);
      setReviewData(data?.data);
    } catch (err) {
      console.log("Failed to fetchReviewData: ", err);
    }
  };

  const handlePageChange = (_event, value) => {
    setPage(value);
    fetchReviewData(value);
  };

  useEffect(() => {
    fetchReviewData(1);
  }, []);

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"}>
        <Box className={"fs-40-bold white"}>
          {t("ga-11_review")}
          {feedbackList?.length > 0 && (
            <Box
              sx={{
                width: 200,
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <ReviewRating value={averageStar} />
              <Box className={"fs-18-bold white"} marginLeft={"5px"}>
                {averageStar}
              </Box>
            </Box>
          )}
        </Box>
        <Button className={classes.modal_btn_left} onClick={() => setView(true)}>
          <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
            {t("ga-26_leave-review")}
          </Box>
        </Button>
      </Stack>
      {feedbackList?.length === 0 && (
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
      )}
      {feedbackList?.length > 0 && (
        <>
          <Stack gap={"24px"} mt={"24px"}>
            {feedbackList?.map((one, index) => (
              <FeedbackCard feedback={one} key={`${index}-${one?._id}`} />
            ))}
          </Stack>
          <ReviewPagination totalPage={totalPage} page={page} handlePageChange={handlePageChange} />
        </>
      )}
      <ComingModal open={view} setOpen={setView} />
    </>
  );
};

export default GameReview;
