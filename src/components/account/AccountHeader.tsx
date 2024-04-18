import { Box, Grid } from "@mui/material";

interface props {
  title?: string;
  text?: string;
}

const AccountHeader = ({ title, text }: props) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          className={"fs-h1 white"}
          sx={{
            leadingTrim: "both",
            textEdge: "cap"
          }}
        >
          {title}
        </Box>
      </Grid>
      {text && (
        <Grid item xs={12} mt={"24px"}>
          <Box className={"fs-18-light light"}>{text}</Box>
        </Grid>
      )}
    </Grid>
  );
};

export default AccountHeader;
