import { useDispatch } from "react-redux";
import { Box, Grid, Stack } from "@mui/material";
import GroupAvatar from "./GroupAvatar";
import { AppDispatch } from "../../store";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";

export interface IPropsGroupListItem {
  group: IChatroom;
  index: number;
  setView: (_: string) => void;
}

const GroupListItem = ({ group, index, setView }: IPropsGroupListItem) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleGroupListItemClick = () => {
    try {
      dispatch(setCurrentChatroom(group));
      dispatch(fetchCurrentChatroomMembersAsync(group._id));
      setView("chatGroupMemberList");
      console.log("handleGroupListItemClick");
    } catch (err) {
      console.error("Failed to handleGroupListItemClick: ", err);
    }
  };

  return (
    <Box key={`${index}-${new Date().toISOString()}`} onClick={handleGroupListItemClick}>
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
              <Box className={"fs-12-light gray"}>{`${group.participants.length} Joined`}</Box>
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
