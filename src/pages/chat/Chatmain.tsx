import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Divider, Stack, TextField, InputAdornment, Grid, Button, Tabs, Tab } from "@mui/material";
import { debounce } from "lodash";
import ChatStyle from "../../styles/ChatStyles";
import searchlg from "../../assets/searchlg.svg";
import settingicon from "../../assets/chat/settings.svg";
import nocontact from "../../assets/chat/nocontact.png";
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
import RequestModal from "../../components/chat/RequestModal";
import { useSocket } from "../../providers/SocketProvider";
import { IAlert, IContactList, propsType, selecteduserType, userType } from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { getSelectedUser } from "../../features/chat/Chat-selecteduserSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { IAlertList } from "../../types/alertTypes";
import FRcontextmenu from "../../components/chat/FRcontextmenu";
import Userlist from "../../components/chat/Userlist";
import { createContactAsync, deleteContactAsync, getContactList } from "../../features/chat/ContactListSlice";
import { AppDispatch } from "../../store";
import { getAlertList } from "../../features/alert/AlertListSlice";
import { searchUsers } from "../../features/chat/ContactListApi";
import { createFriendAsync, deleteFriendAsync, getFriendList } from "../../features/chat/FriendListSlice";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import { deleteBlockAsync, getBlockList } from "../../features/chat/BlockListSlice";

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
  const otheme = useTheme();

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
  const [tab, setTab] = useState<number>(0);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const dispatch = useDispatch<AppDispatch>();
  const contactListStore: IContactList = useSelector(getContactList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const selectedUserToDeleteStore: selecteduserType = useSelector(getSelectedUser);
  const accountStore: accountType = useSelector(getAccount);
  const alertListStore: IAlertList = useSelector(getAlertList);

  const selectedUserToDeleteStoreRef = useRef(selectedUserToDeleteStore);
  const accountStoreRef = useRef(accountStore);
  const friendListStoreRef = useRef(friendListStore);
  const blockListStoreRef = useRef(blockListStore);

  useEffect(() => {
    selectedUserToDeleteStoreRef.current = selectedUserToDeleteStore;
  }, [selectedUserToDeleteStore]);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    friendListStoreRef.current = friendListStore;
  }, [friendListStore]);
  useEffect(() => {
    blockListStoreRef.current = blockListStore;
  }, [blockListStore]);

  const deleteSelectedUser = async () => {
    try {
      dispatch(deleteFriendAsync(selectedUserToDeleteStoreRef.current.id)).then(() => {
        dispatch(deleteContactAsync(selectedUserToDeleteStoreRef.current.id)).then(() => {
          dispatch(deleteBlockAsync(selectedUserToDeleteStoreRef.current.id));
        });
      });
      console.log("deleteSelectedUser");
    } catch (err) {
      console.error("Failed to deleteSelectedUser: ", err);
    }
    setOpenDeleteModal(false);
  };

  const sendFriendRequest = async () => {
    try {
      if (friendListStoreRef.current.contacts.find((element) => element._id === selectedUserToDeleteStoreRef.current.id)) {
        console.log("sendFriendRequest: Already in the friend list!");
        return;
      }
      const data: IAlert = {
        alertType: "friend-request",
        note: {
          sender: `${accountStoreRef.current.uid}`,
          status: "pending",
        },
        receivers: [selectedUserToDeleteStoreRef.current.id],
      };
      socket.current.emit("post-alert", JSON.stringify(data));
      dispatch(deleteBlockAsync(selectedUserToDeleteStoreRef.current.id)).then(() => {
        dispatch(createContactAsync(selectedUserToDeleteStoreRef.current.id)).then(() => {
          dispatch(createFriendAsync(selectedUserToDeleteStoreRef.current.id));
        });
      });
      console.log("sendFriendRequest");
    } catch (err) {
      console.error("Failed to sendFriendRequest: ", err);
    }
    setOpenRequestModal(false);
  };

  const debouncedFilterUsers = debounce(async (value: string) => {
    setSearchedresult(await searchUsers(value));
  }, 1000);

  const filterUsers = (value: string) => {
    debouncedFilterUsers(value);
  };

  useEffect(() => {
    if (view === "chatmain" && !value) {
      filterUsers(value);
    }
  }, [value, view]);

  const handleTabChange = (_event: React.SyntheticEvent, index: number) => {
    setTab(index);
  };

  const handleChangeIndex = (index: number) => {
    setTab(index);
  };

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
        {value === index && children}
      </div>
    );
  }

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
              <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} marginTop={"30px"}>
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
                              <path d="M17 7L7 17M7 7L17 17" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
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
            <ThemeProvider theme={theme}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab
                  label={
                    <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                      {t("cha-36_contact")}
                    </Box>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                      {t("cha-37_friend")}
                    </Box>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                      {t("cha-38_block")}
                    </Box>
                  }
                  {...a11yProps(2)}
                />
              </Tabs>
            </ThemeProvider>
            <SwipeableViews axis={otheme.direction === "rtl" ? "x-reverse" : "x"} index={tab} onChangeIndex={handleChangeIndex} width={"100%"}>
              <TabPanel value={tab} index={0} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  {contactListStore?.contacts?.length === 0 && value === "" ? (
                    <>
                      <Grid container sx={{ justifyContent: "center" }}>
                        <img src={nocontact} style={{ marginTop: "40%", display: "block" }}></img>
                      </Grid>
                      <Box className={"fs-20-regular white"} textAlign={"center"}>
                        {t("cha-2_you-havenot-friends")}
                      </Box>
                    </>
                  ) : (
                    <>
                      {(value === "" ? contactListStore?.contacts : searchedresult)?.map((user, index) => {
                        const count =
                          value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
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
                      })}
                      {showContextMenu && (
                        <FRcontextmenu
                          tab={tab}
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
                      <BlockModal block={tab !== 2} openBlockModal={openBlockModal} setOpenBlockModal={setOpenBlockModal} roommode={false} />
                      <DeleteModal
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        deleteSelectedUser={deleteSelectedUser}
                        roommode={false}
                      />
                      <RequestModal
                        openRequestModal={openRequestModal}
                        setOpenRequestModal={setOpenRequestModal}
                        sendFriendRequest={sendFriendRequest}
                        roommode={false}
                      />
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={tab} index={1} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  {friendListStore?.contacts?.length === 0 && value === "" ? (
                    <>
                      <Grid container sx={{ justifyContent: "center" }}>
                        <img src={nocontact} style={{ marginTop: "40%", display: "block" }}></img>
                      </Grid>
                      <Box className={"fs-20-regular white"} textAlign={"center"}>
                        {t("cha-2_you-havenot-friends")}
                      </Box>
                    </>
                  ) : (
                    <>
                      {(value === "" ? friendListStore?.contacts : searchedresult)?.map((user, index) => {
                        const count =
                          value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
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
                      })}
                      {showContextMenu && (
                        <FRcontextmenu
                          tab={tab}
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
                      <BlockModal block={tab !== 2} openBlockModal={openBlockModal} setOpenBlockModal={setOpenBlockModal} roommode={false} />
                      <DeleteModal
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        deleteSelectedUser={deleteSelectedUser}
                        roommode={false}
                      />
                      <RequestModal
                        openRequestModal={openRequestModal}
                        setOpenRequestModal={setOpenRequestModal}
                        sendFriendRequest={sendFriendRequest}
                        roommode={false}
                      />
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={tab} index={2} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  {blockListStore?.contacts?.length === 0 && value === "" ? (
                    <>
                      <Grid container sx={{ justifyContent: "center" }}>
                        <img src={nocontact} style={{ marginTop: "40%", display: "block" }}></img>
                      </Grid>
                      <Box className={"fs-20-regular white"} textAlign={"center"}>
                        {t("cha-2_you-havenot-friends")}
                      </Box>
                    </>
                  ) : (
                    <>
                      {(value === "" ? blockListStore?.contacts : searchedresult)?.map((user, index) => {
                        const count =
                          value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
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
                      })}
                      {showContextMenu && (
                        <FRcontextmenu
                          tab={tab}
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
                      <BlockModal block={tab !== 2} openBlockModal={openBlockModal} setOpenBlockModal={setOpenBlockModal} roommode={false} />
                      <DeleteModal
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        deleteSelectedUser={deleteSelectedUser}
                        roommode={false}
                      />
                      <RequestModal
                        openRequestModal={openRequestModal}
                        setOpenRequestModal={setOpenRequestModal}
                        sendFriendRequest={sendFriendRequest}
                        roommode={false}
                      />
                    </>
                  )}
                </Box>
              </TabPanel>
            </SwipeableViews>
            {/* userlist section */}
          </Box>
        </>
      )}
    </>
  );
};

export default Chatmain;
