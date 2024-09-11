import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export interface IPropsReviewRating {
  value: number;
}

// const labels: { [index: number]: string } = {
//   0.5: "0/1",
//   1: "1",
//   1.5: "1/2",
//   2: "2",
//   2.5: "2/3",
//   3: "3",
//   3.5: "3/4",
//   4: "4",
//   4.5: "4/5",
//   5: "5",
// };

// function getLabelText(value: number) {
//   return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
// }

function StyledStarIcon(props) {
  const { value, ...other } = props;
  return (
    <StarIcon
      sx={{
        color: "white",
        "& .MuiRating-iconEmpty": {
          borderColor: "1px solid white",
        },
        // "& .MuiRating-icon": {
        //   borderRadius: "50%",
        // },
      }}
      {...other}
    />
  );
}

const ReviewRating = ({ value }: IPropsReviewRating) => {
  return <Rating name="hover-feedback" value={value} precision={0.5} readOnly IconContainerComponent={StyledStarIcon} />;
};

export default ReviewRating;
