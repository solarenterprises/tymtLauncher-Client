import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Box, Grid, Divider, Button, Stack } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatStyle from "../../styles/ChatStyles";
import x from "../../assets/chat/x.svg";
import Avatar from "../../components/home/Avatar";
import OrLinechat from "../../components/chat/Orlinechat";
import {
  userType,
  ChatHistoryType,
  deliverEncryptionKeyType,
  encryptionkeyStoreType,
} from "../../types/chatTypes";
import { chatType, notificationType } from "../../types/settingTypes";
import {
  accountType,
  // , walletEnum
} from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { getUserlist } from "../../features/chat/Chat-userlistSlice";
import Chatindex from "../../pages/chat";
import ChatSettinginRoom from "./ChatsettinginRoom";
import ChatuserlistinRoom from "./ChatuserlistinRoom";
import ChatfriendinRoom from "./Chatsetting-friendinRoom";
import ChatMsginRoom from "./Chatsetting-MsginRoom";
import Chatinputfield from "../../components/chat/Chatinputfield";
import { useSocket } from "../../providers/SocketProvider";
import { AppDispatch } from "../../store";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import {
  addEncryptionKey,
  selectEncryptionKeyStore,
} from "../../features/chat/Chat-encryptionkeySlice";
import { generateRandomString } from "../../features/chat/Chat-contactApi";
import {
  setMountedFalse,
  setMountedTrue,
} from "../../features/chat/Chat-intercomSupportSlice";
import { ThreeDots } from "react-loader-spinner";
import { Chatdecrypt } from "../../lib/api/ChatEncrypt";
import { useTranslation } from "react-i18next";

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

  const [panel, setPanel] = useState("chatroom-chatuserlist");
  const [value, setValue] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [keyperuser, setKeyperUser] = useState<string>("");
  const [processedPages, setProcessedPages] = useState(new Set());
  const [screenexpanded, setScreenExpanded] = useState<boolean>(false);

  const valueRef = useRef(value);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);
  const keyperuserRef = useRef(keyperuser);
  const processedPagesRef = useRef(processedPages);
  const showChatRef = useRef(showChat);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);
  useEffect(() => {
    keyperuserRef.current = keyperuser;
  }, [keyperuser]);
  useEffect(() => {
    processedPagesRef.current = processedPages;
  }, [processedPages]);
  useEffect(() => {
    showChatRef.current = showChat;
  }, [showChat]);

  const chatStore: chatType = useSelector(selectChat);
  const currentPartnerStore: userType = useSelector(selectPartner);
  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const chatUserListStore: userType[] = useSelector(getUserlist);
  const notificationStore: notificationType = useSelector(selectNotification);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  const chatStoreRef = useRef(chatStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const accountStoreRef = useRef(accountStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const chatUserListStoreRef = useRef(chatUserListStore);
  const notificationStoreRef = useRef(notificationStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);

  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);
  useEffect(() => {
    currentPartnerStoreRef.current = currentPartnerStore;
  }, [currentPartnerStore]);
  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    chatUserListStoreRef.current = chatUserListStore;
  }, [chatUserListStore]);
  useEffect(() => {
    notificationStoreRef.current = notificationStore;
  }, [notificationStore]);
  useEffect(() => {
    encryptionKeyStoreRef.current = encryptionKeyStore;
  }, [encryptionKeyStore]);

  // When currentpartner is changed ask encryption key to partner

  useEffect(() => {
    const existkey =
      encryptionKeyStoreRef.current.encryption_Keys[
        currentPartnerStoreRef.current._id
      ];
    if (existkey) {
      setKeyperUser(existkey);
    } else {
      const key = generateRandomString(32);
      setKeyperUser(key);
      const deliverydata: deliverEncryptionKeyType = {
        sender_id: accountStoreRef.current.uid,
        recipient_id: currentPartnerStoreRef.current._id,
        key: key,
      };
      socket.current.emit(
        "deliver-encryption-key",
        JSON.stringify(deliverydata)
      );
      dispatch(
        addEncryptionKey({
          userId: currentPartnerStoreRef.current._id,
          encryptionKey: key,
        })
      );
    }
  }, [currentPartnerStoreRef.current._id, socket]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    dispatch(setChatHistory({ messages: [] }));
    setProcessedPages(new Set());
  }, [currentPartnerStoreRef.current._id]);

  const fetchMessages = async () => {
    if (!hasMoreRef.current) return;
    const query = {
      room_user_ids: [
        accountStoreRef.current.uid,
        currentPartnerStoreRef.current._id,
      ],
      pagination: { page: pageRef.current, pageSize: 20 },
    };
    if (!processedPagesRef.current.has(pageRef.current)) {
      setProcessedPages(
        new Set(processedPagesRef.current.add(pageRef.current))
      );
      socket.current.emit("get-messages-by-room", JSON.stringify(query));
      console.log("Chatroom > socket.current.emit > get-messages-by-room");
    }
  };

  // Fetch chat history of the first page
  useEffect(() => {
    if (socket.current) {
      fetchMessages();
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      if (!socket.current.hasListeners("messages-by-room")) {
        socket.current.on("messages-by-room", async (result) => {
          console.log(
            "Chatroom > socket.current.on > messages-by-room",
            result
          );
          if (result && result.data.length > 0) {
            if (
              chatStoreRef.current.message === "anyone" ||
              chatStoreRef.current.message === "friend"
            ) {
              if (pageRef.current === 1) {
                dispatch(
                  setChatHistory({
                    messages: [...result.data],
                  })
                );
              } else if (pageRef.current > 1) {
                dispatch(
                  setChatHistory({
                    messages: [
                      ...chatHistoryStoreRef.current.messages,
                      ...result.data,
                    ],
                  })
                );
              }
              setPage((prev) => {
                return prev + 1;
              });
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
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
    } else if (
      messageDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)
    ) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", options);
    }
  };

  const decryptMessage = (encryptedmessage: string) => {
    return Chatdecrypt(encryptedmessage, keyperuserRef.current);
  };

  // Set mounted to true when chatroom is mounted
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
    const { offsetHeight, scrollHeight, scrollTop } =
      scrollref.current as HTMLDivElement;
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
          {/* // Userlist inbox */}
          <Box className={classes.userlist_container}>
            <ChatSettinginRoom view={panel} setView={setPanel} />
            <ChatuserlistinRoom view={panel} setView={setPanel} />
            <ChatfriendinRoom view={panel} setView={setPanel} />
            <ChatMsginRoom view={panel} setView={setPanel} />
          </Box>
          {/* chatroom inbox */}
          <Box
            sx={{
              borderLeft:
                "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
              width: "calc(100% - 450px)",
              height: "100%",
            }}
          >
            <Box
              className={classes.inbox_container}
              display={"flex"}
              flexDirection={"column"}
            >
              {/* Header section */}
              <Box
                sx={{
                  width: "100%",
                  paddingRight: "8px",
                  position: "relative",
                }}
              >
                <Stack
                  flexDirection={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Stack alignItems={"center"} flexDirection={"row"}>
                    {chatUserListStore[0] && (
                      <>
                        <Avatar
                          onlineStatus={currentPartnerStore.onlineStatus}
                          userid={currentPartnerStore._id}
                          size={50}
                          status={currentPartnerStore.notificationStatus}
                        />
                        <Stack
                          marginLeft={"16px"}
                          justifyContent={"flex-start"}
                          direction={"column"}
                          spacing={1}
                        >
                          <Box className={"fs-18-bold white"}>
                            {currentPartnerStore.nickName}
                          </Box>
                          <Box className={"fs-12-regular gray"}>
                            {currentPartnerStore.sxpAddress}
                          </Box>
                        </Stack>
                      </>
                    )}
                    {!chatUserListStore[0] && <></>}
                  </Stack>
                  <Stack alignItems={"center"} flexDirection={"row"}>
                    <Button
                      className={"common-btn"}
                      sx={{ cursor: "pointer", marginLeft: "10px" }}
                      onClick={() => navigate(-1)}
                    >
                      <Box className={"center-align"}>
                        <img src={x} />
                      </Box>
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

              {/* Message inbox */}
              <Box
                className={"scroll_bar_chatbox"}
                ref={scrollref}
                display={"flex"}
                flexDirection={"column"}
              >
                <Box sx={{ width: "100%", flex: "1 1 auto" }}></Box>

                <InfiniteScroll
                  style={{
                    minHeight: "100%",
                  }}
                  dataLength={chatHistoryStore.messages.length} //This is important field to render the next data
                  next={fetchMessages}
                  hasMore={hasMore}
                  loader={
                    <Box className={"fs-14-regular white t-center"}>
                      {t("cha-32_loading")}
                    </Box>
                  }
                  // endMessage={
                  //   <Box className={"fs-14-regular white t-center"}>
                  //     {t("cha-33_you-seen-all")}
                  //   </Box>
                  // }
                  // below props only if you need pull down functionality
                  refreshFunction={fetchMessages}
                  pullDownToRefresh
                  pullDownToRefreshThreshold={50}
                  pullDownToRefreshContent={
                    <Box className={"fs-14-regular white t-center"}>
                      &#8595; {t("cha-34_pull-down")}
                    </Box>
                  }
                  releaseToRefreshContent={
                    <Box className={"fs-14-regular white t-center"}>
                      &#8593; {t("cha-35_release-to-refresh")}
                    </Box>
                  }
                >
                  {[...chatHistoryStore.messages]
                    .reverse()
                    ?.map((message, index) => {
                      const isSameDay = (date1, date2) => {
                        return (
                          date1.getFullYear() === date2.getFullYear() &&
                          date1.getMonth() === date2.getMonth() &&
                          date1.getDate() === date2.getDate()
                        );
                      };

                      const isFirstMessageOfDay = () => {
                        if (index === 0) return true;

                        const previousMessageDate = new Date(
                          [...chatHistoryStore.messages].reverse()[
                            index - 1
                          ]?.createdAt
                        );
                        const currentMessageDate = new Date(message.createdAt);

                        return !isSameDay(
                          previousMessageDate,
                          currentMessageDate
                        );
                      };

                      const timeline = isFirstMessageOfDay()
                        ? formatDateDifference(message.createdAt)
                        : null;

                      const isSameSender = (id1, id2) => {
                        return id1 === id2;
                      };

                      const detectLastMessageofStack = () => {
                        const nextMessageSender = [
                          ...chatHistoryStore.messages,
                        ].reverse()[index + 1]?.sender_id;
                        const currentMessageSender = [
                          ...chatHistoryStore.messages,
                        ].reverse()[index]?.sender_id;

                        return !isSameSender(
                          nextMessageSender,
                          currentMessageSender
                        );
                      };

                      const isLastMessageofStack = detectLastMessageofStack();
                      const decryptedmessage = decryptMessage(message.message);

                      return (
                        <>
                          <Box
                            className={"bubblecontainer"}
                            key={`${
                              message.sender_id
                            }-${index}-${new Date().toISOString()}`}
                          >
                            {timeline &&
                              decryptedmessage !==
                                "Unable to decode message #tymt114#" && (
                                <OrLinechat timeline={timeline} />
                              )}
                            <Stack
                              flexDirection={"row"}
                              alignItems={"flex-end"}
                              marginTop={"10px"}
                              gap={"15px"}
                              justifyContent={
                                !screenexpanded
                                  ? message.sender_id === accountStore.uid
                                    ? "flex-end"
                                    : "flex-start"
                                  : "flex-start"
                              }
                            >
                              {message.sender_id === accountStore.uid && (
                                <>
                                  {screenexpanded && isLastMessageofStack && (
                                    <Avatar
                                      onlineStatus={true}
                                      userid={accountStore.uid}
                                      size={40}
                                      status={
                                        !notificationStore.alert
                                          ? "donotdisturb"
                                          : "online"
                                      }
                                    />
                                  )}
                                  {screenexpanded && !isLastMessageofStack && (
                                    <div
                                      style={{ width: "40px", height: "40px" }}
                                    />
                                  )}
                                  <Box
                                    className={
                                      isLastMessageofStack && screenexpanded
                                        ? "fs-14-regular white bubble-lastmessage-expanded"
                                        : isLastMessageofStack &&
                                          !screenexpanded
                                        ? "fs-14-regular white bubble-lastmessage-unexpanded"
                                        : "fs-14-regular white bubble"
                                    }
                                  >
                                    {decryptedmessage !==
                                    "Unable to decode message #tymt114#" ? (
                                      <>
                                        {decryptedmessage
                                          .split("\n")
                                          .map((line) => (
                                            <React.Fragment>
                                              {line}
                                              <br />
                                            </React.Fragment>
                                          ))}
                                        <Box
                                          className={
                                            "fs-14-light timestamp-inbubble"
                                          }
                                          sx={{ alignSelf: "flex-end" }}
                                          color={"rgba(11, 11, 11, 0.7)"}
                                        >
                                          {new Date(
                                            message.createdAt
                                          ).toLocaleString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </Box>
                                      </>
                                    ) : (
                                      <>
                                        <ThreeDots
                                          height="23px"
                                          width={"40px"}
                                          radius={4}
                                          color={`white`}
                                        />
                                      </>
                                    )}
                                  </Box>
                                </>
                              )}
                              {message.sender_id !== accountStore.uid && (
                                <>
                                  {screenexpanded && isLastMessageofStack && (
                                    <Avatar
                                      onlineStatus={
                                        currentPartnerStore.onlineStatus
                                      }
                                      userid={currentPartnerStore._id}
                                      size={40}
                                      status={
                                        currentPartnerStore.notificationStatus
                                      }
                                    />
                                  )}
                                  {screenexpanded && !isLastMessageofStack && (
                                    <div
                                      style={{ width: "40px", height: "40px" }}
                                    />
                                  )}
                                  <Box
                                    className={
                                      isLastMessageofStack
                                        ? "fs-14-regular white bubble-partner-lastmessage"
                                        : "fs-14-regular white bubble-partner"
                                    }
                                  >
                                    {decryptedmessage !==
                                    "Unable to decode message #tymt114#" ? (
                                      <>
                                        {decryptedmessage
                                          .split("\n")
                                          .map((line) => (
                                            <React.Fragment>
                                              {line}
                                              <br />
                                            </React.Fragment>
                                          ))}
                                        <Box
                                          className={
                                            "fs-14-light timestamp-inbubble"
                                          }
                                          sx={{ alignSelf: "flex-end" }}
                                          color={"rgba(11, 11, 11, 0.7)"}
                                        >
                                          {new Date(
                                            message.createdAt
                                          ).toLocaleString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </Box>
                                      </>
                                    ) : (
                                      <>
                                        <ThreeDots
                                          height="23px"
                                          width={"40px"}
                                          radius={4}
                                          color={`white`}
                                        />
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
              {/* Input field section */}
              <Chatinputfield
                value={value}
                setValue={setValue}
                keyperuser={keyperuser}
              />
            </Box>
          </Box>
          <Chatindex viewChat={showChat} setViewChat={setShowChat} />
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Chatroom;
