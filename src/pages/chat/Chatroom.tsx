import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash";

import Bubble from "../../components/chat/Bubble";

import { Box, Grid, Divider, Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ChatStyle from "../../styles/ChatStyles";
import x from "../../assets/chat/x.svg";
import Avatar from "../../components/home/Avatar";

import { AppDispatch } from "../../store";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { setMountedFalse, setMountedTrue } from "../../features/chat/IntercomSupportSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getChatHistory, setChatHistory } from "../../features/chat/ChatHistorySlice";
import { getContactList } from "../../features/chat/ContactListSlice";
import { fetchCurrentChatroomAsync, getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { ICurrentChatroomMembers, fetchCurrentChatroomMembersAsync, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";

import { useSocket } from "../../providers/SocketProvider";
import GroupAvatar from "../../components/chat/GroupAvatar";
import ChatGroupMemberListRoom from "./ChatGroupMemberListRoom";
import ChatSettinginRoom from "./ChatsettinginRoom";
import ChatMainRoom from "./ChatMainRoom";
import ChatMsginRoom from "./Chatsetting-MsginRoom";
import ChatInputField from "../../components/chat/Chatinputfield";
import ChatGroupEditRoom from "./ChatGroupEditRoom";
import EditIcon from "@mui/icons-material/Edit";

import { addChatHistory } from "../../lib/api/JSONHelper";

import { ChatHistoryType, IContactList } from "../../types/chatTypes";
import { chatType, notificationType } from "../../types/settingTypes";
import { accountType } from "../../types/accountTypes";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { fetchHistoricalChatroomMembersAsync } from "../../features/chat/HistoricalChatroomMembersSlice";

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

const Chatroom = () => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { chatroomId } = useParams();
  const classes = ChatStyle();

  const [panel, setPanel] = useState("chatMainRoom");
  const [value, setValue] = useState<string>("");
  const [screenexpanded, setScreenExpanded] = useState<boolean>(false);

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const chatStore: chatType = useSelector(selectChat);
  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const contactListStore: IContactList = useSelector(getContactList);
  const notificationStore: notificationType = useSelector(selectNotification);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);

  const isDM = useMemo(() => {
    return currentChatroomStore?.room_name ? false : true;
  }, [currentChatroomStore]);
  const isGlobal = useMemo(() => {
    return currentChatroomStore?.isGlobal;
  }, [currentChatroomStore]);
  const currentPartner = isDM ? currentChatroomMembersStore?.members?.find((member) => member._id !== accountStore.uid) : null;
  const displayChatroomName = !isDM ? currentChatroomStore?.room_name : currentPartner?.nickName;
  const displayChatroomSubName = isGlobal ? "Public channel" : !isDM ? `${currentChatroomStore?.participants?.length ?? 0} Joined` : currentPartner?.sxpAddress;

  const chatStoreRef = useRef(chatStore);
  const accountStoreRef = useRef(accountStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const contactListStoreRef = useRef(contactListStore);
  const notificationStoreRef = useRef(notificationStore);
  const currentChatroomStoreRef = useRef(currentChatroomStore);

  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    contactListStoreRef.current = contactListStore;
  }, [contactListStore]);
  useEffect(() => {
    notificationStoreRef.current = notificationStore;
  }, [notificationStore]);
  useEffect(() => {
    currentChatroomStoreRef.current = currentChatroomStore;
  }, [currentChatroomStore]);

  useEffect(() => {
    console.log("NOTICE: currentPartnerStore changed: ", currentChatroomStore?._id);
    if (currentChatroomStore?._id) {
      dispatch(setChatHistory({ messages: [] }));
    }
  }, [currentChatroomStore]);

  useEffect(() => {
    if (chatroomId) {
      console.log("chatroomId: ", chatroomId);
      dispatch(fetchCurrentChatroomAsync(chatroomId));
      dispatch(fetchCurrentChatroomMembersAsync(chatroomId));
      dispatch(fetchHistoricalChatroomMembersAsync(chatroomId));
    }
  }, [chatroomId]);

  const fetchMessages = async () => {
    try {
      if (accountStoreRef.current.uid && currentChatroomStoreRef?.current._id) {
        const query = {
          room_id: currentChatroomStoreRef?.current._id,
          pagination: { page: Math.floor(chatHistoryStoreRef.current.messages.length / 20) + 1, pageSize: 20 },
        };
        socket.current.emit("get-messages-by-room", JSON.stringify(query));
        console.log("Chatbox > socket.current.emit > get-messages-by-room");
      }
      console.log("fetchMessages");
    } catch (err) {
      console.error("Failed to fetchMessages: ", err);
    }
  };

  // Fetch chat history of the first page
  useEffect(() => {
    if (socket.current) {
      dispatch(setChatHistory({ messages: [] }));
      fetchMessages();
    }
  }, [socket.current, currentChatroomStore]);

  useEffect(() => {
    if (socket.current) {
      if (!socket.current.hasListeners("messages-by-room")) {
        socket.current.on("messages-by-room", async (result) => {
          console.log("Chatbox > socket.current.on > messages-by-room", result);
          if (result && result.data.length > 0) {
            if (chatStoreRef.current.message === "anyone" || chatStoreRef.current.message === "friend") {
              dispatch(
                setChatHistory({
                  messages: addChatHistory([...chatHistoryStoreRef.current.messages], [...result.data], 20),
                })
              );
            }
          }
        });
      }
    }

    return () => {
      if (socket.current && socket.current.hasListeners("messages-by-room")) {
        socket.current.off("messages-by-room");
      }
    };
  }, [socket.current]);

  useEffect(() => {
    dispatch(setMountedTrue());

    return () => {
      dispatch(setMountedFalse());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        setScreenExpanded(false);
      } else {
        setScreenExpanded(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollref = useRef<HTMLDivElement>(null);

  const Scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } = scrollref.current as HTMLDivElement;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      scrollref.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    if (scrollref.current && valueRef.current === "") Scroll();
  }, [valueRef.current]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid
          xs={12}
          sx={{
            position: "fixed",
            flexDirection: "row",
            display: "flex",
            height: "calc(100vh - 60px)",
          }}
        >
          {/* Left section */}
          <Box className={classes.userlist_container}>
            <ChatSettinginRoom view={panel} setView={setPanel} />
            <ChatMainRoom view={panel} setView={setPanel} />
            <ChatMsginRoom view={panel} setView={setPanel} />
            <ChatGroupMemberListRoom view={panel} setView={setPanel} />
            <ChatGroupEditRoom view={panel} setView={setPanel} />
          </Box>
          {/* Right section */}
          <Box
            sx={{
              borderLeft: "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
              width: "calc(100% - 450px)",
              height: "100%",
            }}
          >
            <Box className={classes.inbox_container} display={"flex"} flexDirection={"column"}>
              {/* Header section */}
              <Box
                sx={{
                  width: "100%",
                  paddingRight: "8px",
                  position: "relative",
                }}
              >
                <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Stack
                    alignItems={"center"}
                    flexDirection={"row"}
                    gap={"16px"}
                    sx={{
                      cursor: "pointer",
                      width: "500px",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#ffffff33",
                      },
                    }}
                    onClick={() => {
                      if (!isDM) setPanel("chatGroupMemberListRoom");
                    }}
                  >
                    {isDM && currentPartner && (
                      <Avatar
                        onlineStatus={activeUserListStore.users.some((user) => user === currentPartner._id)}
                        url={currentPartner.avatar}
                        size={40}
                        status={currentPartner.notificationStatus}
                      />
                    )}
                    {!isDM && <GroupAvatar size={40} url={currentChatroomStore?.room_image} />}
                    <Stack marginLeft={"16px"} justifyContent={"flex-start"} direction={"column"} spacing={1} width={"444px"}>
                      <Box
                        className={"fs-18-bold white"}
                        sx={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 1, overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {displayChatroomName}
                      </Box>
                      <Box
                        className={"fs-12-regular gray"}
                        sx={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 1, overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {displayChatroomSubName}
                      </Box>
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
                    <Button className={"setting-back-button"} onClick={() => setPanel("chatGroupEditRoom")}>
                      <EditIcon className="icon-button" />
                    </Button>
                    <Button className={"setting-back-button"} onClick={() => navigate("/home")}>
                      <Box component={"img"} src={x}></Box>
                    </Button>
                  </Stack>
                </Stack>

                <Divider
                  sx={{
                    backgroundColor: "#FFFFFF1A",
                    marginTop: "24px",
                  }}
                />
              </Box>

              <Box className={"scroll_bar_chatbox"} ref={scrollref} id={"scroll_container_room"}>
                {/* <Box sx={{ width: "100%", flex: "1 1 auto" }} /> */}
                <InfiniteScroll
                  style={{
                    minHeight: "50px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column-reverse",
                    overflow: "none",
                  }}
                  dataLength={chatHistoryStore.messages.length} //This is important field to render the next data
                  next={fetchMessages}
                  hasMore={true}
                  inverse={true}
                  loader={<Box className={"fs-14-regular white t-center"}>{t("cha-32_loading")}</Box>}
                  scrollableTarget={"scroll_container_room"}
                  // endMessage={
                  //   <Box className={"fs-14-regular white t-center"}>
                  //     {t("cha-33_you-seen-all")}
                  //   </Box>
                  // }
                  // below props only if you need pull down functionality
                  // refreshFunction={fetchMessages}
                  // pullDownToRefresh
                  // pullDownToRefreshThreshold={50}
                  // pullDownToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8595; {t("cha-34_pull-down")}</Box>}
                  // releaseToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8593; {t("cha-35_release-to-refresh")}</Box>}
                >
                  {chatHistoryStore.messages?.map((message, index) => (
                    <Bubble roomMode={true} screenExpanded={screenexpanded} message={message} index={index} isDM={isDM} />
                  ))}
                </InfiniteScroll>
              </Box>
              <ChatInputField value={value} setValue={setValue} />
            </Box>
          </Box>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Chatroom;
