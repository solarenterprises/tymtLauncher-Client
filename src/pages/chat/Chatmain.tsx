import { useEffect, useRef, useState } from "react";
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
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
import RequestModal from "../../components/chat/RequestModal";
import { useSocket } from "../../providers/SocketProvider";
import {
  alertType,
  propsType,
  selecteduserType,
  userType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import {
  getUserlist,
  setUserList,
} from "../../features/chat/Chat-userlistSlice";
import {
  createContact,
  deleteContact,
  receiveContactlist,
  searchUsers,
} from "../../features/chat/Chat-contactApi";
import { getSelectedUser } from "../../features/chat/Chat-selecteduserSlice";
import { setChatHistory } from "../../features/chat/Chat-historySlice";
import { getAccount } from "../../features/account/AccountSlice";
import { fetchUnreadAlerts } from "../../features/chat/Chat-alertApi";
import { alertbadgeType } from "../../types/alertTypes";
import { selectBadgeStatus } from "../../features/alert/AlertbadgeSlice";
import FRcontextmenu from "../../components/chat/FRcontextmenu";
import Userlist from "../../components/chat/Userlist";

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
  const { t } = useTranslation();

  const [value, setValue] = useState<string>("");
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
  const [unreadalerts, setUnreadAlerts] = useState<alertType[]>([]);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const dispatch = useDispatch();
  const chatUserListStore: userType[] = useSelector(getUserlist);
  const selectedUserToDeleteStore: selecteduserType =
    useSelector(getSelectedUser);
  const accountStore: accountType = useSelector(getAccount);
  const alertBadgeStore: alertbadgeType = useSelector(selectBadgeStatus);

  const selectedUserToDeleteStoreRef = useRef(selectedUserToDeleteStore);
  const accountStoreRef = useRef(accountStore);
  const alertBadgeStoreRef = useRef(alertBadgeStore);

  useEffect(() => {
    selectedUserToDeleteStoreRef.current = selectedUserToDeleteStore;
  }, [selectedUserToDeleteStore]);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    alertBadgeStoreRef.current = alertBadgeStore;
  }, [alertBadgeStore]);

  const deleteSelectedUser = async () => {
    await deleteContact(selectedUserToDeleteStoreRef.current.id);
    setOpenDeleteModal(false);
    const contacts: userType[] = await receiveContactlist();
    dispatch(setUserList(contacts));
    dispatch(setChatHistory({ messages: [] }));
  };

  const sendRequest = async () => {
    const data = {
      alertType: "friend-request",
      note: {
        sender: `${accountStoreRef.current.uid}`,
        status: "pending",
      },
      receivers: [selectedUserToDeleteStoreRef.current.id],
    };
    socket.current.emit("post-alert", JSON.stringify(data));
    setOpenRequestModal(false);
    await updateContact(selectedUserToDeleteStoreRef.current.id);
  };

  const debouncedFilterUsers = debounce(async (value: string) => {
    setSearchedresult(await searchUsers(value));
  }, 1000); // Adjust the delay time (in milliseconds) as needed

  const filterUsers = (value: string) => {
    debouncedFilterUsers(value);
  };

  const updateContact = async (_id) => {
    await createContact(_id);
    const contacts: userType[] = await receiveContactlist();
    dispatch(setUserList(contacts));
  };

  useEffect(() => {
    if (view === "chatmain") {
      if (!value) {
        receiveContactlist()
          .then((contacts) => dispatch(setUserList(contacts)))
          .catch((err) => console.error("Failed to receiveContactlist: ", err));
      } else {
        filterUsers(value);
      }
    }
  }, [value, view]);

  // read the unread chat alerts and mark the number of unread messages
  const getUnreadAlerts = async () => {
    const unreadalerts: alertType[] = await fetchUnreadAlerts(
      accountStoreRef.current.uid
    );
    setUnreadAlerts(unreadalerts);
  };

  useEffect(() => {
    if (view === "chatmain") {
      getUnreadAlerts();
    }
  }, [alertBadgeStore, view]);

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
              {chatUserListStore?.length === 0 && value === "" ? (
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
                  {(value === "" ? chatUserListStore : searchedresult)?.map(
                    (user, index) => {
                      const count =
                        value === ""
                          ? unreadalerts?.filter(
                              (alert) =>
                                alert.note.sender === user._id &&
                                alert.alertType === "chat"
                            ).length
                          : 0;
                      const numberofunreadmessages = count;

                      return (
                        <Userlist
                          user={user}
                          index={index}
                          numberofunreadmessages={numberofunreadmessages}
                          setShowContextMenu={setShowContextMenu}
                          setContextMenuPosition={setContextMenuPosition}
                          setView={setView}
                        />
                      );
                    }
                  )}
                  {showContextMenu && (
                    <FRcontextmenu
                      value={value}
                      isClickedBlock={isClickedBlock}
                      isClickedDelete={isClickedDelete}
                      isClickedRequest={isClickedRequest}
                      setIsClickedBlock={setIsClickedBlock}
                      setOpenBlockModal={setOpenBlockModal}
                      setShowContextMenu={setShowContextMenu}
                      setIsClickedDelete={setIsClickedDelete}
                      setOpenDeleteModal={setOpenDeleteModal}
                      setOpenRequestModal={setOpenRequestModal}
                      setIsClickedRequest={setIsClickedRequest}
                      contextMenuPosition={contextMenuPosition}
                    />
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
