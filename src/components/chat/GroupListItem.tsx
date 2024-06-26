import { Box, Grid, Stack } from "@mui/material";
import { IChatroom } from "../../types/ChatroomAPITypes";
import GroupAvatar from "./GroupAvatar";

export interface IPropsGroupListItem {
  group: IChatroom;
  index: number;
}

const GroupListItem = ({ group, index }: IPropsGroupListItem) => {
  return (
    <Box key={`${index}-${new Date().toISOString()}`}>
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
          cursor: "pointer",
          "&:hover": {
            borderRadius: "5px",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            backgroundColor: "#FFFFFF1A",
          },
          "&:active": {
            backgroundColor: "#52E1F21A",
          },
        }}
      >
        <GroupAvatar size={40} url={""} />
        <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
          <Box>
            <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
              <Box className={"fs-16 white"}>{group.room_name}</Box>
              <Box className={"fs-12-light gray"}>{group.participants.length}</Box>
            </Stack>
          </Box>

          {/* <Box
            className={"unread-dot fs-10-light"}
            sx={{
              display: numberofunreadmessages > 0 ? "block" : "none",
            }}
          >
            {numberofunreadmessages}
          </Box> */}
        </Stack>
      </Grid>
    </Box>
  );
};

export default GroupListItem;
