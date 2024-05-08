import { Box, Button, Grid } from "@mui/material";
import tymt from "../../assets/main/newlogo.png";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  setMountedFalse,
  setMountedTrue,
} from "../../features/chat/Chat-intercomSupportSlice";
import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";
import { notificationType } from "../../types/settingTypes";

const WalletD53Transaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notificationStore: notificationType = useSelector(selectNotification);

  useEffect(() => {
    dispatch(setMountedTrue());
    dispatch(
      setNotification({
        ...notificationStore,
        alert: false,
      })
    );

    return () => {
      dispatch(setMountedFalse());
      dispatch(
        setNotification({
          ...notificationStore,
          alert: true,
        })
      );
    };
  }, [dispatch]);

  return (
    <Grid container className="basic-container">
      <Grid item xs={12} container justifyContent={"center"}>
        <Box component="img" src={tymt} width="300" height="100px" />
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
