import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export interface IPropsReviewRating {
  value: number;
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
      }}
      {...other}
    />
  );
}

const ReviewRating = ({ value }: IPropsReviewRating) => {
  return <Rating name="hover-feedback" value={value} precision={0.5} readOnly IconContainerComponent={StyledStarIcon} />;
};

export default ReviewRating;
