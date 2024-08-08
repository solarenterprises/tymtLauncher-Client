import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SwipeableViews from "react-swipeable-views";
import { debounce } from "lodash";

import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { Box, Divider, Stack, TextField, InputAdornment, Grid, Button, Tabs, Tab } from "@mui/material";

import UserListItem from "../../components/chat/UserListItem";
import NewGroupButton from "../../components/chat/NewGroupButton";
import GroupListItem from "../../components/chat/GroupListItem";
import DMListItem from "../../components/chat/DMListItem";

// import { getAlertList } from "../../features/alert/AlertListSlice";
import { searchUsers } from "../../features/chat/ContactListApi";
import { getFriendList } from "../../features/chat/FriendListSlice";
import { getChatroomList } from "../../features/chat/ChatroomListSlice";
import { getBlockList } from "../../features/chat/BlockListSlice";

import { searchGroups } from "../../features/chat/ChatroomListApi";

import ChatStyle from "../../styles/ChatStyles";
import searchlg from "../../assets/searchlg.svg";
import settingicon from "../../assets/chat/settings.svg";
import nocontact from "../../assets/chat/nocontact.png";

import { IContactList, propsType, userType } from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
// import { IAlertList } from "../../types/alertTypes";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";

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
  const { t } = useTranslation();
  const classes = ChatStyle();
  const otheme = useTheme();

  const [value, setValue] = useState<string>("");
  const [searchedGroupList, setSearchedGroupList] = useState<IChatroom[]>([]);
  const [searchedUserList, setSearchedUserList] = useState<userType[]>([]);
  const [tab, setTab] = useState<number>(0);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const friendListStore: IContactList = useSelector(getFriendList);
  const blockListStore: IContactList = useSelector(getBlockList);
  const DMList: IChatroom[] = chatroomListStore.chatrooms.filter((element) => !element.room_name);
  const groupList: IChatroom[] = chatroomListStore.chatrooms.filter((element) => element.room_name);
  const accountStore: accountType = useSelector(getAccount);
  // const alertListStore: IAlertList = useSelector(getAlertList);

  const accountStoreRef = useRef(accountStore);
  const friendListStoreRef = useRef(friendListStore);
  const blockListStoreRef = useRef(blockListStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    friendListStoreRef.current = friendListStore;
  }, [friendListStore]);
  useEffect(() => {
    blockListStoreRef.current = blockListStore;
  }, [blockListStore]);

  const debouncedFilterUsers = debounce(async (value: string) => {
    if (value) {
      tab === 0 ? setSearchedGroupList(await searchGroups(value)) : setSearchedUserList(await searchUsers(value));
    }
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
                    placeholder={tab === 0 ? t("cha-50_search-group") : t("cha-3_you-search-user")}
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
                      }
                      filterUsers(e.target.value);
                    }}
                  />
                </ThemeProvider>
                <Button
                  className={"setting-back-button"}
                  onClick={() => {
                    setView("chatsetting");
                  }}
                >
                  <Box component={"img"} src={settingicon}></Box>
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
            </ThemeProvider>
            <SwipeableViews axis={otheme.direction === "rtl" ? "x-reverse" : "x"} index={tab} onChangeIndex={handleChangeIndex} width={"100%"}>
              <TabPanel value={tab} index={0} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  <NewGroupButton roomMode={false} />
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
                      {(!value ? groupList : searchedGroupList)?.map((group, index) => {
                        return <GroupListItem group={group} index={index} setView={setView} key={`${index}-${Date.now()}`} />;
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
                          return <DMListItem DM={DM} index={index} setView={setView} key={`${index}-${Date.now()}`} />;
                        })}
                      {value &&
                        searchedUserList.map((user, index) => {
                          return <UserListItem user={user} index={index} setView={setView} page={"DM"} key={`${index}-${Date.now()}`} />;
                        })}
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={tab} index={2} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  {friendListStore?.contacts?.length === 0 && !value ? (
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
                      {(!value ? friendListStore?.contacts : searchedUserList)?.map((user, index) => {
                        return <UserListItem user={user} index={index} setView={setView} page={value ? "DM" : "friend"} key={`${index}-${Date.now()}`} />;
                      })}
                    </>
                  )}
                </Box>
              </TabPanel>
              <TabPanel value={tab} index={3} dir={otheme.direction}>
                <Box className={classes.scroll_bar}>
                  {blockListStore?.contacts?.length === 0 && !value ? (
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
                      {(!value ? blockListStore?.contacts : searchedUserList)?.map((user, index) => {
                        return <UserListItem user={user} index={index} setView={setView} page={value ? "DM" : "block"} key={`${index}-${Date.now()}`} />;
                      })}
                    </>
                  )}
                </Box>
              </TabPanel>
            </SwipeableViews>
          </Box>
        </>
      )}
    </>
  );
};

export default Chatmain;
