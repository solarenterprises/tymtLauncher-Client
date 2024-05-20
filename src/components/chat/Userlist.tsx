import { Box, Grid, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../home/Avatar";
import {
  createContact,
  getaccessToken,
  receiveContactlist,
} from "../../features/chat/Chat-contactApi";
import { setUserList } from "../../features/chat/Chat-userlistSlice";
import {
  propsUserlistType,
  selecteduserType,
  userType,
} from "../../types/chatTypes";
import { multiWalletType } from "../../types/walletTypes";
import { nonCustodialType } from "../../types/accountTypes";
import {
  getSelectedUser,
  setSelectedUsertoDelete,
} from "../../features/chat/Chat-selecteduserSlice";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import {
  selectPartner,
  setCurrentChatPartner,
} from "../../features/chat/Chat-currentPartnerSlice";

const Userlist = ({
  user,
  index,
  numberofunreadmessages,
  setShowContextMenu,
  setContextMenuPosition,
  setView,
}: propsUserlistType) => {
  const selectedusertoDelete: selecteduserType = useSelector(getSelectedUser);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const userdata: userType[] = useSelector(selectPartner);
  const dispatch = useDispatch();
  const handleContextMenu = (e: any, id: string) => {
    e.preventDefault();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    // const mouseX = e.pageX;
    // const mouseY = e.pageY;
    setShowContextMenu(true);
    setContextMenuPosition({ x: mouseX, y: mouseY });
    e.stopPropagation();
    dispatch(setSelectedUsertoDelete({ ...selectedusertoDelete, id: id }));
    const handleClickOutsideContextMenu = (event) => {
      if (
        !event.target.closest(".context_menu_block") &&
        !event.target.closest(".context_menu_delete")
      ) {
        setShowContextMenu(false);
        document.removeEventListener("click", handleClickOutsideContextMenu);
      }
    };

    document.addEventListener("click", handleClickOutsideContextMenu);
    return false;
  };

  const updateContact = async (_id) => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await createContact(_id, accessToken);
    const contacts: userType[] = await receiveContactlist(accessToken);
    dispatch(setUserList(contacts));
  };

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
        onContextMenu={(e) => handleContextMenu(e, user._id)}
        onClick={() => {
          dispatch(
            setCurrentChatPartner({
              ...userdata,
              _id: user._id,
              nickName: user.nickName,
              avatar: user.avatar,
              lang: user.lang,
              sxpAddress: user.sxpAddress,
              onlineStatus: user.onlineStatus,
              notificationStatus: user.notificationStatus,
            })
          );
          setView("chatbox");
          updateContact(user._id);
        }}
      >
        <Avatar
          onlineStatus={user.onlineStatus}
          userid={user._id}
          size={40}
          status={user.notificationStatus}
        />
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          display={"flex"}
          sx={{ marginLeft: "25px", width: "320px" }}
        >
          <Box>
            <Stack
              direction={"column"}
              justifyContent={"flex-start"}
              spacing={1}
            >
              <Box className={"fs-16 white"}>{user?.nickName}</Box>
              <Box className={"fs-12-light gray"}>{user?.sxpAddress}</Box>
            </Stack>
          </Box>

          <Box
            className={"unread-dot fs-10-light"}
            sx={{
              display: numberofunreadmessages > 0 ? "block" : "none",
            }}
          >
            {numberofunreadmessages}
          </Box>
        </Stack>
      </Grid>
    </Box>
  );
};

export default Userlist;
