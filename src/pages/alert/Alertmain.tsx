import { Box, Button, Stack } from "@mui/material";
import unreaddot from "../../assets/alert/unreaddot.svg";
import AlertList from "../../components/alert/Alertlist";

const Alertmain = () => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "16px 8px 16px 16px",
        flexDirection: "column",
        margin: "10px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          paddingRight: "8px",
          position: "relative",
        }}
      >
        <Box className={"fs-24-bold white"} marginTop={"0px"}>
          Notifications
        </Box>
        <Stack
          marginTop={"24px"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack
            display={"flex"}
            direction={"row"}
            alignItems={"center"}
            gap={"8px"}
          >
            <Box className={"fs-18-regular gray"}>0</Box>
            <Box className={"fs-18-regular gray"}>Unread</Box>
            <img src={unreaddot} width={"8px"} height={"8px"} />
          </Stack>
          <Button className="modal_btn_left_fr" onClick={() => {}}>
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              Mark all as read
            </Box>
          </Button>
        </Stack>
        <Box sx={{ marginTop: "16px" }}>
          <AlertList
            status={"alert"}
            title={"Update"}
            detail={"New version of launcher is available"}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Alertmain;
