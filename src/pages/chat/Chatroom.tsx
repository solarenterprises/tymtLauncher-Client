import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loader-spinner";
import _ from "lodash";

import { Box, Grid, Divider, Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ChatStyle from "../../styles/ChatStyles";
import x from "../../assets/chat/x.svg";
import Avatar from "../../components/home/Avatar";
import OrLinechat from "../../components/chat/Orlinechat";

import { AppDispatch } from "../../store";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { setMountedFalse, setMountedTrue } from "../../features/chat/IntercomSupportSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getChatHistory, setChatHistory } from "../../features/chat/ChatHistorySlice";
import { getContactList } from "../../features/chat/ContactListSlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { ISKeyList, getSKeyList } from "../../features/chat/SKeyListSlice";
import { ICurrentChatroomMembers, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";

import { useSocket } from "../../providers/SocketProvider";
import GroupAvatar from "../../components/chat/GroupAvatar";
import ChatGroupMemberListRoom from "./ChatGroupMemberListRoom";
import ChatSettinginRoom from "./ChatsettinginRoom";
import ChatMainRoom from "./ChatMainRoom";
import ChatMsginRoom from "./Chatsetting-MsginRoom";
import Chatinputfield from "../../components/chat/Chatinputfield";
import ChatGroupEditRoom from "./ChatGroupEditRoom";
import EditIcon from "@mui/icons-material/Edit";

import { Chatdecrypt } from "../../lib/api/ChatEncrypt";
import { addChatHistory } from "../../lib/api/JSONHelper";

import { ChatHistoryType, IContactList } from "../../types/chatTypes";
import { chatType, notificationType } from "../../types/settingTypes";
import { accountType } from "../../types/accountTypes";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { IChatroom } from "../../types/ChatroomAPITypes";

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
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);

  const sKey = sKeyListStore.sKeys.find((element) => element.roomId === currentChatroomStore?._id)?.sKey;
  const isDM = currentChatroomStore?.room_name ? false : true;
  const currentPartner = isDM ? currentChatroomMembersStore.members.find((member) => member._id !== accountStore.uid) : null;
  const displayChatroomName = currentChatroomStore?.room_name ? currentChatroomStore?.room_name : currentPartner?.nickName;
  const displayChatroomSubName = currentChatroomStore?.room_name ? `${currentChatroomStore?.participants?.length ?? 0} Joined` : currentPartner?.sxpAddress;

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

  const formatDateDifference = (date) => {
    const today: any = new Date(Date.now());
    const yesterday: any = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const options = { month: "long", day: "numeric" };

    const messageDate: any = new Date(date);

    if (messageDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return "Today";
    } else if (messageDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", options);
    }
  };

  const decryptMessage = useCallback(
    (encryptedmessage: string) => {
      if (currentChatroomStore?.isPrivate ?? false) {
        return Chatdecrypt(encryptedmessage, sKey);
      }
      return encryptedmessage;
    },
    [sKey, currentChatroomStore]
  );

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
                    {!isDM && <GroupAvatar size={40} url={currentChatroomStore.room_image} />}
                    <Stack marginLeft={"16px"} justifyContent={"flex-start"} direction={"column"} spacing={1}>
                      <Box className={"fs-18-bold white"}>{displayChatroomName}</Box>
                      <Box className={"fs-12-regular gray"}>{displayChatroomSubName}</Box>
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

              <Box className={"scroll_bar_chatbox"} ref={scrollref} display={"flex"} flexDirection={"column"}>
                <Box sx={{ width: "100%", flex: "1 1 auto" }} />
                <InfiniteScroll
                  style={{
                    minHeight: "50px",
                  }}
                  dataLength={chatHistoryStore.messages.length} //This is important field to render the next data
                  next={fetchMessages}
                  hasMore={true}
                  loader={<Box className={"fs-14-regular white t-center"}>{t("cha-32_loading")}</Box>}
                  // endMessage={
                  //   <Box className={"fs-14-regular white t-center"}>
                  //     {t("cha-33_you-seen-all")}
                  //   </Box>
                  // }
                  // below props only if you need pull down functionality
                  refreshFunction={fetchMessages}
                  pullDownToRefresh
                  pullDownToRefreshThreshold={50}
                  pullDownToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8595; {t("cha-34_pull-down")}</Box>}
                  releaseToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8593; {t("cha-35_release-to-refresh")}</Box>}
                >
                  {[...chatHistoryStore.messages].reverse()?.map((message, index) => {
                    const isSameDay = (date1, date2) => {
                      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
                    };

                    const isFirstMessageOfDay = () => {
                      if (index === 0) return true;

                      const previousMessageDate = new Date([...chatHistoryStore.messages].reverse()[index - 1]?.createdAt);
                      const currentMessageDate = new Date(message.createdAt);

                      return !isSameDay(previousMessageDate, currentMessageDate);
                    };

                    const timeline = isFirstMessageOfDay() ? formatDateDifference(message.createdAt) : null;

                    const isSameSender = (id1, id2) => {
                      return id1 === id2;
                    };

                    const detectLastMessageofStack = () => {
                      const nextMessageSender = [...chatHistoryStore.messages].reverse()[index + 1]?.sender_id;
                      const currentMessageSender = [...chatHistoryStore.messages].reverse()[index]?.sender_id;

                      return !isSameSender(nextMessageSender, currentMessageSender);
                    };

                    const isLastMessageofStack = detectLastMessageofStack();
                    const decryptedmessage = decryptMessage(message.message);

                    return (
                      <>
                        <Box className={"bubblecontainer"} key={`${message.sender_id}-${index}-${new Date().toISOString()}`}>
                          {timeline && decryptedmessage !== undefined && <OrLinechat timeline={timeline} />}
                          <Stack
                            flexDirection={"row"}
                            alignItems={"flex-end"}
                            marginTop={"10px"}
                            gap={"15px"}
                            justifyContent={!screenexpanded ? (message.sender_id === accountStore.uid ? "flex-end" : "flex-start") : "flex-start"}
                          >
                            {message.sender_id === accountStore.uid && (
                              <>
                                {screenexpanded && isLastMessageofStack && (
                                  <Avatar
                                    onlineStatus={true}
                                    url={accountStore.avatar}
                                    size={40}
                                    status={!notificationStore.alert ? "donotdisturb" : "online"}
                                  />
                                )}
                                {screenexpanded && !isLastMessageofStack && <div style={{ width: "40px", height: "40px" }} />}
                                <Box
                                  className={
                                    isLastMessageofStack && screenexpanded
                                      ? "fs-14-regular white bubble-lastmessage-expanded"
                                      : isLastMessageofStack && !screenexpanded
                                      ? "fs-14-regular white bubble-lastmessage-unexpanded"
                                      : "fs-14-regular white bubble"
                                  }
                                >
                                  {decryptedmessage !== undefined ? (
                                    <>
                                      {decryptedmessage.split("\n").map((line) => (
                                        <React.Fragment>
                                          {line}
                                          <br />
                                        </React.Fragment>
                                      ))}
                                      <Box className={"fs-14-light timestamp-inbubble"} sx={{ alignSelf: "flex-end" }} color={"rgba(11, 11, 11, 0.7)"}>
                                        {new Date(message.createdAt).toLocaleString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <ThreeDots height="23px" width={"40px"} radius={4} color={`white`} />
                                    </>
                                  )}
                                </Box>
                              </>
                            )}
                            {message.sender_id !== accountStore.uid && (
                              <>
                                {screenexpanded && isLastMessageofStack && (
                                  <Avatar
                                    onlineStatus={activeUserListStore.users.some((user) => user === message.sender_id)}
                                    userid={message.sender_id}
                                    size={40}
                                    status={currentChatroomMembersStore.members.find((member) => member._id === message._id)?.notificationStatus}
                                  />
                                )}
                                {screenexpanded && !isLastMessageofStack && <div style={{ width: "40px", height: "40px" }} />}
                                <Box className={isLastMessageofStack ? "fs-14-regular white bubble-partner-lastmessage" : "fs-14-regular white bubble-partner"}>
                                  {decryptedmessage !== undefined ? (
                                    <>
                                      {decryptedmessage.split("\n").map((line) => (
                                        <React.Fragment>
                                          {line}
                                          <br />
                                        </React.Fragment>
                                      ))}
                                      <Box className={"fs-14-light timestamp-inbubble"} sx={{ alignSelf: "flex-end" }} color={"rgba(11, 11, 11, 0.7)"}>
                                        {new Date(message.createdAt).toLocaleString("en-US", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </Box>
                                    </>
                                  ) : (
                                    <>
                                      <ThreeDots height="23px" width={"40px"} radius={4} color={`white`} />
                                    </>
                                  )}
                                </Box>
                              </>
                            )}
                          </Stack>
                        </Box>
                      </>
                    );
                  })}
                </InfiniteScroll>
              </Box>
              <Chatinputfield value={value} setValue={setValue} />
            </Box>
          </Box>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Chatroom;
