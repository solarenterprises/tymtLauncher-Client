import { Box, Grid, Stack } from "@mui/material";
import Avatar from "../home/Avatar";
import { ICurrentChatroomMember } from "../../features/chat/CurrentChatroomMembersSlice";

export interface IPropsGroupMemberListItem {
  member: ICurrentChatroomMember;
  index: number;
}

const GroupMemberListItem = ({ member, index }: IPropsGroupMemberListItem) => {
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
        <Avatar onlineStatus={member.onlineStatus} userid={member._id} size={40} status={member.notificationStatus} />
        <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
          <Box>
            <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
              <Box className={"fs-16 white"}>{member.nickName}</Box>
              <Box className={"fs-12-light gray"}>{member.sxpAddress}</Box>
            </Stack>
          </Box>

          {/* <Box
            className={"unread-dot fs-10-light"}
            sx={{
              display: numberOfUnreadMessages > 0 ? "block" : "none",
            }}
          >
            {numberOfUnreadMessages}
          </Box> */}
        </Stack>
      </Grid>
    </Box>
  );
};

export default GroupMemberListItem;
