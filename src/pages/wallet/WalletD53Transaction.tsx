import { Box, Button, Grid } from "@mui/material";
import tymt from "../../assets/main/newlogo.png";
import { invoke } from "@tauri-apps/api/tauri";

const WalletD53Transaction = () => {
  return (
    <Grid container className="basic-container">
      <Grid item xs={12} container justifyContent={"center"}>
        <Box component="img" src={tymt} width="400px" height="300px" />
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          onClick={async () => {
            await invoke("hide_transaction_window");
          }}
          className="red-button"
          sx={{
            mt: "8px",
          }}
        >
          <Box className={"fs-16-regular white"}>{"Approve"}</Box>
        </Button>
      </Grid>
    </Grid>
  );
};

export default WalletD53Transaction;
