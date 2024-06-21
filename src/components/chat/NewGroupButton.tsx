import { Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewGroupButton = () => {
  return (
    <>
      <Grid
        item
        xs={12}
        container
        sx={{
          overflowX: "hidden",
          height: "64px",
          flexDirection: "row",
          justifyContent: "left",
          alignItems: "center",
          padding: "12px 5px 12px 5px",
        }}
      >
        <Button
          sx={{
            transition: "all 0.3s ease", // Transition property
            minWidth: "40px",
            minHeight: "40px",
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            border: "1px solid #EF4444",
            backgroundColor: "transparent",
            "&:hover": {
              borderRadius: "10px",
              border: "1px solid #EF4444",
              backgroundColor: "#EF4444",
            },
          }}
        >
          <AddIcon
            sx={{
              transition: "all 0.3s ease", // Transition property
              width: "20px",
              height: "20px",
              padding: "10px",
              color: "#EF4444",
              "&:hover": {
                color: "#071616",
              },
            }}
          />
        </Button>
      </Grid>
    </>
  );
};

export default NewGroupButton;
