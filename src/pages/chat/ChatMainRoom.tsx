import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { debounce } from "lodash";

import { Box, Grid, Stack, Button, Divider, InputAdornment, TextField, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useSocket } from "../../providers/SocketProvider";
import GroupListItem from "../../components/chat/GroupListItem";
import UserListItem from "../../components/chat/UserListItem";
import DMListItem from "../../components/chat/DMListItem";
import BlockModal from "../../components/chat/BlockModal";
import DeleteModal from "../../components/chat/DeleteModal";
import RequestModal from "../../components/chat/RequestModal";
import NewGroupButton from "../../components/chat/NewGroupButton";
import FRcontextmenu from "../../components/chat/FRcontextmenu";

import ChatStyle from "../../styles/ChatStyles";

import { IAlert, IContactList, propsType, userType } from "../../types/chatTypes";
import { getSelectedUser } from "../../features/chat/Chat-selecteduserSlice";

import { AppDispatch } from "../../store";
import { createContactAsync, deleteContactAsync } from "../../features/chat/ContactListSlice";
import { getAlertList } from "../../features/alert/AlertListSlice";
import { createFriendAsync, deleteFriendAsync, getFriendList } from "../../features/chat/FriendListSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { deleteBlockAsync, getBlockList } from "../../features/chat/BlockListSlice";
import { getChatroomList } from "../../features/chat/ChatroomListSlice";
import { searchUsers } from "../../features/chat/ContactListApi";
import { searchGroups } from "../../features/chat/ChatroomListApi";

import { accountType } from "../../types/accountTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { selecteduserType } from "../../types/chatTypes";
import { IAlertList } from "../../types/alertTypes";

import nocontact from "../../assets/chat/nocontact.png";
import settingicon from "../../assets/chat/settings.svg";
import searchlg from "../../assets/searchlg.svg";

const ChatMainRoom = ({ view, setView }: propsType) => {
  const classes = ChatStyle();

  const { t } = useTranslation();
  const { socket } = useSocket();
  const otheme = useTheme();

  const dispatch = useDispatch<AppDispatch>();
  const selectedUserToDeleteStore: selecteduserType = useSelector(getSelectedUser);
  const alertListStore: IAlertList = useSelector(getAlertList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const accountStore: accountType = useSelector(getAccount);
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);

  const DMList: IChatroom[] = chatroomListStore.chatrooms.filter((element) => !element.room_name);
  const groupList: IChatroom[] = chatroomListStore.chatrooms.filter((element) => element.room_name);

  const [searchedGroupList, setSearchedGroupList] = useState<IChatroom[]>([]);
  const [searchedUserList, setSearchedUserList] = useState<userType[]>([]);
  const [value, setValue] = useState<string>("");

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

  const [tab, setTab] = useState<number>(0);

  const debouncedFilterUsers = debounce(async (value: string) => {
    tab === 0 ? setSearchedGroupList(await searchGroups(value)) : setSearchedUserList(await searchUsers(value));
  }, 1000);

  const filterUsers = (value) => {
    debouncedFilterUsers(value);
  };

  const deleteSelectedUser = useCallback(async () => {
    try {
      dispatch(deleteFriendAsync(selectedUserToDeleteStore.id)).then(() => {
        dispatch(deleteContactAsync(selectedUserToDeleteStore.id));
      });
      console.log("deleteSelectedUser");
    } catch (err) {
      console.error("Failed to deleteSelectedUser: ", err);
    }
    setOpenDeleteModal(false);
  }, [selectedUserToDeleteStore]);

  const sendFriendRequest = useCallback(async () => {
    try {
      if (friendListStore.contacts.find((element) => element._id === selectedUserToDeleteStore.id)) {
        console.log("sendFriendRequest: Already in the friend list!");
        return;
      }
      const data: IAlert = {
        alertType: "friend-request",
        note: {
          sender: `${accountStore.uid}`,
          status: "pending",
        },
        receivers: [selectedUserToDeleteStore.id],
      };
      socket.current.emit("post-alert", JSON.stringify(data));
      dispatch(deleteBlockAsync(selectedUserToDeleteStore.id)).then(() => {
        dispatch(createContactAsync(selectedUserToDeleteStore.id)).then(() => {
          dispatch(createFriendAsync(selectedUserToDeleteStore.id));
        });
      });
      console.log("sendFriendRequest");
    } catch (err) {
      console.error("Failed to sendFriendRequest: ", err);
    }
    setOpenRequestModal(false);
  }, [friendListStore, selectedUserToDeleteStore, accountStore]);

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
      {view === "chatMainRoom" && (
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
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} marginTop={"30px"}>
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
                  setValue(e.target.value);
                  if (!e.target.value) {
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
          <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="inherit" variant="fullWidth" aria-label="full width tabs example">
            <Tab
              label={
                <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                  {t("cha-41_group")}
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                  {t("cha-36_contact")}
                </Box>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                  {t("cha-37_friend")}
                </Box>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Box className={"fs-14-regular white t-center"} sx={{ textTransform: "none" }}>
                  {t("cha-38_block")}
                </Box>
              }
              {...a11yProps(3)}
            />
          </Tabs>
          <SwipeableViews axis={otheme.direction === "rtl" ? "x-reverse" : "x"} index={tab} onChangeIndex={handleChangeIndex} width={"100%"}>
            <TabPanel value={tab} index={0} dir={otheme.direction}>
              <Box className={classes.scroll_bar}>
                <NewGroupButton />
                {groupList?.length === 0 && !value ? (
                  <>
                    <Grid container sx={{ justifyContent: "center" }}>
                      <img src={nocontact} style={{ marginTop: "40%", display: "block" }}></img>
                    </Grid>
                    <Box className={"fs-20-regular white"} textAlign={"center"}>
                      {t("cha-42_you-havenot-groups")}
                    </Box>
                  </>
                ) : (
                  <>
                    {(value === "" ? groupList : searchedGroupList)?.map((group, index) => {
                      // const count =
                      //   value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === group._id && alert.alertType === "chat").length : 0;
                      // const numberofunreadmessages = count;

                      return <GroupListItem group={group} index={index} />;
                    })}
                  </>
                )}
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={1} dir={otheme.direction}>
              <Box className={classes.scroll_bar}>
                {DMList?.length === 0 && !value ? (
                  <>
                    <Grid container sx={{ justifyContent: "center" }}>
                      <img src={nocontact} style={{ marginTop: "40%", display: "block" }} />
                    </Grid>
                    <Box className={"fs-20-regular white"} textAlign={"center"}>
                      {t("cha-43_you-havenot-contacts")}
                    </Box>
                  </>
                ) : (
                  <>
                    {!value &&
                      DMList.map((DM, index) => {
                        return <DMListItem DM={DM} index={index} numberOfUnreadMessages={0} />;
                      })}
                    {value &&
                      searchedUserList.map((user, index) => {
                        return (
                          <UserListItem
                            user={user}
                            index={index}
                            numberofunreadmessages={0}
                            setShowContextMenu={setShowContextMenu}
                            setContextMenuPosition={setContextMenuPosition}
                          />
                        );
                      })}
                  </>
                )}
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={2} dir={otheme.direction}>
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
                    {(value === "" ? friendListStore?.contacts : searchedUserList)?.map((user, index) => {
                      const count =
                        value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
                      const numberofunreadmessages = count;
                      return (
                        <UserListItem
                          user={user}
                          index={index}
                          numberofunreadmessages={numberofunreadmessages}
                          setShowContextMenu={setShowContextMenu}
                          setContextMenuPosition={setContextMenuPosition}
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
            <TabPanel value={tab} index={3} dir={otheme.direction}>
              <Box className={classes.scroll_bar}>
                {blockListStore?.contacts?.length === 0 && value === "" ? (
                  <>
                    <Grid container sx={{ justifyContent: "center" }}>
                      <img src={nocontact} style={{ marginTop: "40%", display: "block" }}></img>
                    </Grid>
                    <Box className={"fs-20-regular white"} textAlign={"center"}>
                      {t("cha-44_you-havenot-blocks")}
                    </Box>
                  </>
                ) : (
                  <>
                    {(value === "" ? blockListStore?.contacts : searchedUserList)?.map((user, index) => {
                      const count =
                        value === "" ? alertListStore.unread?.filter((alert) => alert.note.sender === user._id && alert.alertType === "chat").length : 0;
                      const numberofunreadmessages = count;

                      return (
                        <UserListItem
                          user={user}
                          index={index}
                          numberofunreadmessages={numberofunreadmessages}
                          setShowContextMenu={setShowContextMenu}
                          setContextMenuPosition={setContextMenuPosition}
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
        </Box>
      )}
    </>
  );
};

export default ChatMainRoom;
