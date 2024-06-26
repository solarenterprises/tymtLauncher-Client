import { Box, Grid, Stack } from "@mui/material";
import Avatar from "../home/Avatar";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { accountType } from "../../types/accountTypes";
import { useSelector } from "react-redux";
import { getAccount } from "../../features/account/AccountSlice";
import { IContactList } from "../../types/chatTypes";
import { getContactList } from "../../features/chat/ContactListSlice";

export interface IPropsDMListItem {
  DM: IChatroom;
  index: number;
  numberOfUnreadMessages: number;
}

const DMListItem = ({ DM, index, numberOfUnreadMessages }: IPropsDMListItem) => {
  const accountStore: accountType = useSelector(getAccount);
  const contactListStore: IContactList = useSelector(getContactList);
  const partnerId = DM.participants.find((element) => element.userId !== accountStore.uid)?.userId ?? "";
  const user = contactListStore.contacts.find((element) => element._id === partnerId);

  return (
    user && (
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
          <Avatar onlineStatus={user.onlineStatus} userid={user._id} size={40} status={user.notificationStatus} />
          <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} display={"flex"} sx={{ marginLeft: "25px", width: "320px" }}>
            <Box>
              <Stack direction={"column"} justifyContent={"flex-start"} spacing={1}>
                <Box className={"fs-16 white"}>{user?.nickName}</Box>
                <Box className={"fs-12-light gray"}>{user?.sxpAddress}</Box>
              </Stack>
            </Box>

            <Box
              className={"unread-dot fs-10-light"}
              sx={{
                display: numberOfUnreadMessages > 0 ? "block" : "none",
              }}
            >
              {numberOfUnreadMessages}
            </Box>
          </Stack>
        </Grid>
      </Box>
    )
  );
};

export default DMListItem;
