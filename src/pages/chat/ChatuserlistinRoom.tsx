import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Stack,
  Button,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import nocontact from "../../assets/chat/nocontact.png";
import settingicon from "../../assets/chat/settings.svg";
import searchlg from "../../assets/searchlg.svg";
import Avatar from "../../components/home/Avatar";
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
import RequestModal from "../../components/chat/RequestModal";

import ChatStyle from "../../styles/ChatStyles";
import { useSocket } from "../../providers/SocketProvider";

import { getUserlist } from "../../features/chat/Chat-userlistSlice";
import { alertType, propsType, userType } from "../../types/chatTypes";
import { setCurrentChatPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { multiWalletType } from "../../types/walletTypes";
import { accountType, nonCustodialType } from "../../types/accountTypes";
import {
  getaccessToken,
  deleteContact,
  receiveContactlist,
} from "../../features/chat/Chat-contactApi";
import { setUserList } from "../../features/chat/Chat-userlistSlice";
import {
  getSelectedUser,
  setSelectedUsertoDelete,
} from "../../features/chat/Chat-selecteduserSlice";
import { createContact } from "../../features/chat/Chat-contactApi";
import { selecteduserType } from "../../types/chatTypes";
import { searchUsers } from "../../features/chat/Chat-contactApi";
import { setChatHistory } from "../../features/chat/Chat-historySlice";

import { debounce } from "lodash";
import { getAccount } from "../../features/account/AccountSlice";
import { fetchUnreadAlerts } from "../../features/chat/Chat-alertApi";
import { selectBadgeStatus } from "../../features/alert/AlertbadgeSlice";
import { alertbadgeType } from "../../types/alertTypes";

const ChatuserlistinRoom = ({ view, setView }: propsType) => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = ChatStyle();
  const chatuserlist: userType[] = useSelector(getUserlist);
  const currentpartner: userType = useSelector(selectPartner);
  const [searchedresult, setSearchedresult] = useState<userType[]>([]);
  const account: accountType = useSelector(getAccount);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const selectedusertoDelete: selecteduserType = useSelector(getSelectedUser);
  const alertbadge: alertbadgeType = useSelector(selectBadgeStatus);
  const [searchvalue, setSearchValue] = useState<string>("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isClickedBlock, setIsClickedBlock] = useState(false);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [isClickedRequest, setIsClickedRequest] = useState(false);

  /***Modals of Userlist ***/
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [unreadalerts, setUnreadAlerts] = useState<alertType[]>([]);

  const debouncedFilterUsers = debounce(async (value) => {
    setSearchedresult(await searchUsers(value));
  }, 1000);

  const filterUsers = (value) => {
    debouncedFilterUsers(value);
  };

  const deleteSelectedUser = async () => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await deleteContact(selectedusertoDelete.id, accessToken);
    setOpenDeleteModal(false);
    const contacts: userType[] = await receiveContactlist(accessToken);
    dispatch(setUserList(contacts));
    dispatch(setChatHistory({ messages: [] }));
    console.log("selectedusertoDelete", selectedusertoDelete.id);
    console.log("accessToken", accessToken);
  };

  const sendRequest = async () => {
    const data = {
      alertType: "friend-request",
      note: {
        sender: `${account.uid}`,
        status: "pending",
      },
      receivers: [selectedusertoDelete.id],
    };
    socket.emit("post-alert", JSON.stringify(data));
    setOpenRequestModal(false);
    await updateContact(selectedusertoDelete.id);
  };

  /***Modals of Userlist ***/

  const handleContextMenu = (e: any, id: string) => {
    e.preventDefault(); // Prevent default browser context menu
    setShowContextMenu(!showContextMenu);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
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

  // read the unread chat alerts and mark the number of unread messages
  const getUnreadAlerts = async () => {
    const unreadalerts: alertType[] = await fetchUnreadAlerts(account.uid);
    setUnreadAlerts(unreadalerts);
  };

  useEffect(() => {
    getUnreadAlerts();
  }, [alertbadge]);

  return (
    <>
      {view === "chatroom-chatuserlist" && (
        <Box
          sx={{
            display: "flex",
            padding: "16px 8px 16px 8px",
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
              {t("cha-1_chat")}
            </Box>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              marginTop={"30px"}
            >
              <TextField
                className={classes.search_bar}
                color="secondary"
                value={searchvalue}
                placeholder={t("cha-3_you-search-user")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={searchlg} />
                    </InputAdornment>
                  ),
                  style: { color: "#FFFFFF" },
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchvalue !== "" && (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => setSearchValue("")}
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            d="M17 7L7 17M7 7L17 17"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  if (setSearchValue) {
                    setSearchValue(e.target.value);
                    filterUsers(e.target.value);
                  }
                }}
              />
              <Button className={"common-btn"}>
                <Box
                  className={"center-align"}
                  onClick={() => {
                    setView("chatroom-chatsetting");
                  }}
                >
                  <img src={settingicon} style={{ cursor: "pointer" }} />
                </Box>
              </Button>
            </Stack>
          </Box>
          <Divider
            sx={{
              backgroundColor: "#FFFFFF1A",
              marginTop: "24px",
              marginBottom: "22px",
            }}
          />
          <Box className={classes.userlist_container}>
            {chatuserlist?.length === 0 && searchvalue === "" ? (
              <>
                <Grid container sx={{ justifyContent: "center" }}>
                  <img
                    src={nocontact}
                    style={{
                      marginTop: "40%",
                      display: "block",
                      marginRight: "10%",
                    }}
                  ></img>
                </Grid>
                <Box
                  className={"fs-20-regular white"}
                  textAlign={"center"}
                  marginRight={"10%"}
                >
                  {t("cha-2_you-havenot-friends")}
                </Box>
              </>
            ) : (
              <>
                {(searchvalue === "" ? chatuserlist : searchedresult)?.map(
                  (user, index) => {
                    const count =
                      searchvalue === ""
                        ? unreadalerts.filter(
                            (alert) =>
                              alert.note.sender === user._id &&
                              alert.alertType === "chat"
                          ).length
                        : 0;
                    const numberofunreadmessages = count;
                    return (
                      <Box key={index}>
                        <Grid
                          container
                          sx={{
                            height: "64px",
                            flexDirection: "row",
                            justifyContent: "left",
                            alignItems: "center",
                            padding: "12px 5px 12px 5px",
                            borderRadius: "5px",
                            backgroundColor:
                              user._id === currentpartner._id
                                ? "#52E1F21A"
                                : "transparent",
                            cursor: "pointer",
                            "&:hover": {
                              borderRadius: "5px",
                              borderTopRightRadius: "5px",
                              borderBottomRightRadius: "5px",
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
                                ...currentpartner,
                                _id: user._id,
                                nickName: user.nickName,
                                avatar: user.avatar,
                                lang: user.lang,
                                sxpAddress: user.sxpAddress,
                                onlineStatus: user.onlineStatus,
                                notificationStatus: user.notificationStatus,
                              })
                            );
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
                                <Box className={"fs-16 white"}>
                                  {user?.nickName}
                                </Box>
                                <Box className={"fs-12-light gray"}>
                                  {user?.sxpAddress}
                                </Box>
                              </Stack>
                            </Box>

                            <Box
                              className={"unread-dot fs-10-light"}
                              sx={{
                                display:
                                  numberofunreadmessages > 0 ? "block" : "none",
                              }}
                            >
                              {numberofunreadmessages}
                            </Box>
                          </Stack>
                        </Grid>
                      </Box>
                    );
                  }
                )}
                {showContextMenu && (
                  <>
                    <Box
                      sx={{
                        position: "fixed",
                        top: contextMenuPosition.y,
                        left: contextMenuPosition.x,
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      {searchvalue === "" ? (
                        <>
                          <Box
                            className={"fs-16 white context_menu_block"}
                            textAlign={"left"}
                            sx={{
                              backdropFilter: "blur(10px)",
                            }}
                            onClick={() => {
                              setIsClickedBlock(!isClickedBlock),
                                setOpenBlockModal(true),
                                setShowContextMenu(false);
                            }}
                          >
                            {t("cha-4_block")}
                          </Box>

                          <Box
                            className={"fs-16 white context_menu_delete"}
                            textAlign={"left"}
                            sx={{
                              backdropFilter: "blur(10px)",
                            }}
                            onClick={() => {
                              setIsClickedDelete(!isClickedDelete),
                                setOpenDeleteModal(true),
                                setShowContextMenu(false);
                            }}
                          >
                            {t("cha-5_delete-chat")}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box
                            className={"fs-16 white context_menu_friendrequest"}
                            textAlign={"center"}
                            sx={{
                              backdropFilter: "blur(10px)",
                            }}
                            onClick={() => {
                              setIsClickedRequest(!isClickedRequest),
                                setOpenRequestModal(true),
                                setShowContextMenu(false);
                            }}
                          >
                            {t("cha-20_send-request")}
                          </Box>
                        </>
                      )}
                    </Box>
                  </>
                )}
                <BlockModal
                  openBlockModal={openBlockModal}
                  setOpenBlockModal={setOpenBlockModal}
                  roommode={true}
                />
                <DeleteModal
                  openDeleteModal={openDeleteModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                  deleteSelectedUser={deleteSelectedUser}
                  roommode={true}
                />
                <RequestModal
                  openRequestModal={openRequestModal}
                  setOpenRequestModal={setOpenRequestModal}
                  sendFriendRequest={sendRequest}
                  roommode={true}
                />
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatuserlistinRoom;
