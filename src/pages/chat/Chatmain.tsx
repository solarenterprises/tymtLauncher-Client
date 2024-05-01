import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Divider,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  Button,
} from "@mui/material";
import { debounce } from "lodash";

import ChatStyle from "../../styles/ChatStyles";

import searchlg from "../../assets/searchlg.svg";
import settingicon from "../../assets/chat/settings.svg";
import nocontact from "../../assets/chat/nocontact.png";
import Avatar from "../../components/home/Avatar";
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
import RequestModal from "../../components/chat/RequestModal";

import { useSocket } from "../../providers/SocketProvider";
import { propsType, selecteduserType, userType } from "../../types/chatTypes";
import { accountType, nonCustodialType } from "../../types/accountTypes";
import {
  selectPartner,
  setCurrentChatPartner,
} from "../../features/chat/Chat-currentPartnerSlice";
import { multiWalletType } from "../../types/walletTypes";
import {
  getUserlist,
  setUserList,
} from "../../features/chat/Chat-userlistSlice";
import {
  createContact,
  deleteContact,
  getaccessToken,
  receiveContactlist,
  searchUsers,
} from "../../features/chat/Chat-contactApi";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import {
  getSelectedUser,
  setSelectedUsertoDelete,
} from "../../features/chat/Chat-selecteduserSlice";
import { setChatHistory } from "../../features/chat/Chat-historySlice";
import { getAccount } from "../../features/account/AccountSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5733",
    },
    secondary: {
      main: "#9e9e9e",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});



const Chatmain = ({ view, setView }: propsType) => {
  const classes = ChatStyle();
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const chatuserlist: userType[] = useSelector(getUserlist);
  const userdata: userType[] = useSelector(selectPartner);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const selectedusertoDelete: selecteduserType = useSelector(getSelectedUser);
  const account: accountType = useSelector(getAccount);
  const [searchedresult, setSearchedresult] = useState<userType[]>([]);
  const [isClickedBlock, setIsClickedBlock] = useState(false);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [isClickedRequest, setIsClickedRequest] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

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
    console.log("myid", account.uid);
    console.log("receiver",selectedusertoDelete.id)
  };

  const handleContextMenu = (e: any, id: string) => {
    e.preventDefault();
    const mouseX = e.clientX + window.scrollX;
    const mouseY = e.clientY + window.scrollY;
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
  };

  const debouncedFilterUsers = debounce(async (value: string) => {
    setSearchedresult(await searchUsers(value));
  }, 1000); // Adjust the delay time (in milliseconds) as needed

  const filterUsers = (value: string) => {
    debouncedFilterUsers(value);
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

  useEffect(() => {
    filterUsers(value);
  }, [value]);

  return (
    <>
      {view === "chatmain" && (
        <>
          <Box
            sx={{
              display: "flex",
              padding: "16px 8px 16px 16px",
              flexDirection: "column",
              margin: "10px",
            }}
          >
            {/* Search & Filter section */}
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
              {/* <Button
                className={"common-btn"}
                sx={{
                  position: "absolute",
                  marginRight: "8px",
                  top: 0,
                  right: 0,
                  cursor: "pointer",
                }}
              >
                <Box
                  className={"center-align"}
                  onClick={() => {
                    setView("chatsetting");
                  }}
                >
                  <img src={minimize} />
                </Box>
              </Button> */}
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                marginTop={"30px"}
              >
                <ThemeProvider theme={theme}>
                  <TextField
                    className={classes.search_bar}
                    color="secondary"
                    value={value}
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
                          {value !== "" && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => setValue("")}
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
                      if (setValue) {
                        setValue(e.target.value);
                        filterUsers(e.target.value);
                      }
                    }}
                  />
                </ThemeProvider>
                <Button className={"common-btn"}>
                  <Box
                    className={"center-align"}
                    onClick={() => {
                      setView("chatsetting");
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
            {/* userlist section */}
            <Box className={classes.scroll_bar}>
              {chatuserlist?.length === 0 && value === "" ? (
                <>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <img
                      src={nocontact}
                      style={{ marginTop: "40%", display: "block" }}
                    ></img>
                  </Grid>
                  <Box className={"fs-20-regular white"} textAlign={"center"}>
                    {t("cha-2_you-havenot-friends")}
                  </Box>
                </>
              ) : (
                <>
                  {(value === "" ? chatuserlist : searchedresult)?.map(
                    (user, index) => (
                      <Box key={index}>
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
                                <Box className={"fs-16 white"}>
                                  {user?.nickName}
                                </Box>
                                <Box className={"fs-12-light gray"}>
                                  {user?.sxpAddress}
                                </Box>
                              </Stack>
                            </Box>

                            <Box
                              className={"fs-16 white"}
                              sx={{ opacity: 0.3 }}
                            >
                              {user?.lang}
                            </Box>
                          </Stack>
                        </Grid>
                      </Box>
                    )
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
                          zIndex: 1000,
                        }}
                      >
                        {value === "" ? (
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
                              className={
                                "fs-16 white context_menu_friendrequest"
                              }
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
                    roommode={false}
                  />
                  <DeleteModal
                    openDeleteModal={openDeleteModal}
                    setOpenDeleteModal={setOpenDeleteModal}
                    deleteSelectedUser={deleteSelectedUser}
                    roommode={false}
                  />
                  <RequestModal
                    openRequestModal={openRequestModal}
                    setOpenRequestModal={setOpenRequestModal}
                    sendFriendRequest={sendRequest}
                    roommode={false}
                  />
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Chatmain;
