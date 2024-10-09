import { Stack, Box } from "@mui/material";

import TimerIcon from "../../assets/wallet/timer-icon.svg";

import { IFeedback } from "../../types/ReviewAPITypes";
import { formatDateAsMMDDYYYY } from "../../lib/helper";
import ReviewRating from "./ReviewRating";
import UserAvatar from "./UserAvatar";
import { t } from "i18next";

export interface IPropsFeedbackCard {
  feedback: IFeedback;
}

const FeedbackCard = ({ feedback }: IPropsFeedbackCard) => {
  return (
    <>
      <Stack
        gap={"12px"}
        sx={{
          padding: "16px 24px",
          border: "1px solid #FFFFFF1A",
          borderRadius: "16px",
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
            <UserAvatar userId={feedback?.author?._id} size={40} />
            <Box className={"fs-h4 white"}>{feedback?.author?.nickName ?? t("ga-34_anonymous")}</Box>
          </Stack>
          <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
            <Box component={"img"} src={TimerIcon} width={"12px"} height={"12px"} />
            <Box className={"fs-12-regular light"}>{formatDateAsMMDDYYYY(feedback?.createdAt)}</Box>
          </Stack>
        </Stack>
        <Stack direction={"row"} gap={"16px"} alignItems={"center"}>
          <Box className={"fs-h4 white"}>{feedback?.title}</Box>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <ReviewRating value={feedback?.star} />
            <Box className={"fs-h5 white"}>{feedback?.star}</Box>
          </Stack>
        </Stack>
        <Box className={"fs-14-regular white"}>{feedback?.feedback}</Box>
      </Stack>
    </>
  );
};

export default FeedbackCard;
