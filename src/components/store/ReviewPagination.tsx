import { Pagination } from "@mui/material";

export interface IPropsReviewPagination {
  totalPage: number;
  page: number;
  handlePageChange: (_, __) => void;
}

const ReviewPagination = ({ totalPage, page, handlePageChange }: IPropsReviewPagination) => {
  return (
    <Pagination
      count={totalPage}
      page={page}
      onChange={handlePageChange}
      shape="rounded"
      sx={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        "& .MuiPaginationItem-root": {
          borderRadius: "6px",
          fontFamily: "Cobe",
          color: "#AFAFAF",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          color: "white",
          backgroundColor: "#232B2C",
        },
      }}
    />
  );
};

export default ReviewPagination;
