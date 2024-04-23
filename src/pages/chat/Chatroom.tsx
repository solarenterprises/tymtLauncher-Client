import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  Box,
  Grid,
  Divider,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Popover,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import EmojiPicker, { SkinTones } from "emoji-picker-react";
import ChatStyle from "../../styles/ChatStyles";
import emotion from "../../assets/chat/emotion.svg";
import send from "../../assets/chat/chatframe.svg";
import x from "../../assets/chat/x.svg";
import Avatar from "../../components/home/Avatar";
import OrLinechat from "../../components/chat/Orlinechat";

import {
  userType,
  ChatHistoryType,
  scrollDownType,
} from "../../types/chatTypes";
import { chatType, notificationType } from "../../types/settingTypes";

import { accountType, walletEnum } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getCustodial } from "../../features/account/CustodialSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { getUserlist } from "../../features/chat/Chat-userlistSlice";
import {
  getdownState,
  setdownState,
} from "../../features/chat/Chat-scrollDownSlice";

import Chatindex from "../../pages/chat";
import ChatSettinginRoom from "./ChatsettinginRoom";
import ChatuserlistinRoom from "./ChatuserlistinRoom";
import ChatfriendinRoom from "./Chatsetting-friendinRoom";
import ChatMsginRoom from "./Chatsetting-MsginRoom";

/*** Firebase RDB reference ***/
// import React from "react";
// import {
//   ref,
//   child,
//   push,
//   set,
//   onValue,
//   serverTimestamp,
//   // off,
// } from "firebase/database";
// import { firebaseDB } from "../../firebase";

// const firebaseChatsSentRef = ref(firebaseDB, "/chats/sent");
// const firebaseChatsReceivedRef = ref(firebaseDB, "/chats/received");
// /*** Firebase RDB reference ***/

//Socket reference

import { socket_backend_url } from "../../configs";
import { io, Socket } from "socket.io-client";
import { AppDispatch } from "../../store";
import React from "react";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroller";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { selectChat } from "../../features/settings/ChatSlice";

const socket: Socket = io(socket_backend_url as string);

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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const classes = ChatStyle();
  const data: chatType = useSelector(selectChat);
  const currentpartner: userType = useSelector(selectPartner);
  const account: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const scrollstate: scrollDownType = useSelector(getdownState);
  const notificationStore: notificationType = useSelector(selectNotification);
  const shouldScrollDown = scrollstate.down;
  const userStore =
    account.wallet === walletEnum.noncustodial
      ? useSelector(getNonCustodial)
      : useSelector(getCustodial);
  const { t } = useTranslation();
  const [panel, setPanel] = useState("chatroom-chatuserlist");
  const [value, setValue] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isEmojiLibraryOpen, setIsEmojiLibraryOpen] = useState(false);

  const setChat = useCallback(
    (viewChat: boolean) => {
      setShowChat(viewChat);
    },
    [showChat]
  );

  /// InputTextfield Emoji Type

  const handleEmojiClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setIsEmojiLibraryOpen(true);
  };

  const handleCloseEmojiLibrary = () => {
    setIsEmojiLibraryOpen(false);
  };

  const handleEmojiSelect = (emoji: any) => {
    setValue(value + emoji.emoji);
  };

  ///// send message to firebase RDB

  const sendMessage = async () => {
    try {
      if (value.trim() !== "") {
        const message = {
          sender_id: account.uid,
          recipient_id: currentpartner._id,
          room_id: `room_${account.uid}_${currentpartner._id}`,
          message: value,
          createdAt: Date.now(),
        };

        socket.emit("post-message", JSON.stringify(message));
        const updatedHistory = [message, ...chatHistoryStore.messages];
        dispatch(
          setChatHistory({
            messages: updatedHistory,
          })
        );
        setValue("");
      }
    } catch (err: any) {}
  };

  // actually enter the input and send the message

  const handleEnterinRoom = async (e: any) => {
    if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
      e.preventDefault(); // Prevent the default action to avoid form submission

      const cursorPosition = e.target.selectionStart;
      const beforeText = value.substring(0, cursorPosition);
      const afterText = value.substring(cursorPosition);
      setValue(`${beforeText}\n${afterText}`);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      await sendMessage(); // Handle sending the message
      setValue(""); // Reset input field
      dispatch(setdownState({ down: !shouldScrollDown }));
    }
  };

  const fetchMessages = _.debounce(async () => {
    if (!hasMore) return;

    const query = {
      sender_id: account.uid,
      recipient_id: currentpartner._id,
      pagination: { page: page, pageSize: 7 },
    };

    // Emit the event to fetch messages
    socket.emit("get-messages-by-room", JSON.stringify(query));

    // Listen for the new messages from the server
    socket.on("messages-by-room", async (result) => {
      if (result && result.data.length > 0) {
        (data.message === "anyone" || data.message === "friend") &&
          dispatch(
            setChatHistory({
              messages: [...chatHistoryStore.messages, ...result.data],
            })
          );
        setPage(page + 1);
      } else {
        setHasMore(false); // No more messages to load
      }
    });
  }, 1000);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    dispatch(setChatHistory({ messages: [] }));
  }, [currentpartner._id]);

  const formatDateDifference = (date) => {
    const today: any = new Date(Date.now());
    const yesterday: any = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const messageDate: any = new Date(date);
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (messageDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
      return "Today";
    } else if (
      messageDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)
    ) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else if (diffDays > 7 && diffDays <= 14) {
      return `1 Week ago`;
    } else if (diffDays > 14 && diffDays <= 21) {
      return `2 Weeks ago`;
    } else if (diffDays > 21 && diffDays <= 28) {
      return `3 Weeks ago`;
    } else {
      return `1 Month ago`;
    }
  };

  function useChatScroll(shouldScrollDown: boolean, currentpartnerid: string) {
    const scrollRef = useRef<HTMLDivElement>();
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [shouldScrollDown, currentpartnerid]);
    return scrollRef;
  }
  const scrollRef = useChatScroll(shouldScrollDown, currentpartner._id);

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
            <Box className={classes.inbox_container}>
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
                    {chatuserlist[0] && (
                      <>
                        <Avatar
                          onlineStatus={currentpartner.onlineStatus}
                          userid={currentpartner._id}
                          size={50}
                          status={currentpartner.notificationStatus}
                        />
                        <Stack
                          marginLeft={"16px"}
                          justifyContent={"flex-start"}
                          direction={"column"}
                          spacing={1}
                        >
                          <Box className={"fs-18-bold white"}>
                            {currentpartner.nickName}
                          </Box>
                          <Box className={"fs-12-regular gray"}>
                            {currentpartner.sxpAddress}
                          </Box>
                        </Stack>
                      </>
                    )}
                    {!chatuserlist[0] && <></>}
                  </Stack>
                  <Stack alignItems={"center"} flexDirection={"row"}>
                    {/* <Button
                      className={"common-btn"}
                      onClick={() => {
                        navigate(-1);
                        setTimeout(() => {
                          setShowChat(!showChat);
                        }, 2000);
                      }}
                    >
                      <Box className={"center-align"}>
                        <img
                          src={minimize}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                    </Button> */}
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
                    marginBottom: "22px",
                  }}
                />
              </Box>

              {/* Message inbox */}
              <Box
                className={classes.scroll_bar_chatbox}
                ref={scrollRef}
                display={"flex"}
                flexDirection={"column"}
              >
                <Box sx={{ width: "100%", flex: "1 1 auto" }}></Box>
                <InfiniteScroll
                  pageStart={page}
                  loadMore={fetchMessages}
                  hasMore={hasMore}
                  isReverse={true}
                  useWindow={false}
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

                      return (
                        <>
                          {/* Your existing Box component for rendering the message */}
                          <Box
                            key={`${
                              message.sender_id
                            }-${index}-${new Date().toISOString()}`}
                            sx={{
                              width: "100%",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              marginTop: "30px",
                            }}
                          >
                            {timeline && <OrLinechat timeline={timeline} />}
                            <Stack flexDirection={"row"} alignItems={"center"}>
                              {message.sender_id === account.uid && (
                                <>
                                  <Avatar
                                    onlineStatus={true}
                                    userid={account.uid}
                                    size={40}
                                    status={
                                      !notificationStore.alert
                                        ? "donotdisturb"
                                        : "online"
                                    }
                                  />
                                  <Box
                                    className={"fs-16 white"}
                                    sx={{ marginLeft: "16px" }}
                                  >
                                    {userStore.nickname}
                                  </Box>
                                </>
                              )}
                              {message.sender_id !== account.uid && (
                                <>
                                  <Avatar
                                    onlineStatus={currentpartner.onlineStatus}
                                    userid={currentpartner._id}
                                    size={40}
                                    status={currentpartner.notificationStatus}
                                  />
                                  <Stack>
                                    <Box
                                      className={"fs-16 white"}
                                      sx={{ marginLeft: "16px" }}
                                    >
                                      {currentpartner.nickName}
                                    </Box>
                                  </Stack>
                                </>
                              )}
                            </Stack>
                            <Box
                              className={"fs-14-regular white"}
                              sx={{
                                marginTop: "10px",
                                overflow: "hidden",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                WebkitBoxOrient: "vertical",
                                display: "-webkit-box",
                                zIndex: 50,
                              }}
                            >
                              {message.message.split("\n").map((line) => (
                                <React.Fragment>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                            </Box>
                            <Box
                              className={"fs-12-light"}
                              color={"gray"}
                              sx={{
                                marginTop: "10px",
                              }}
                            >
                              {new Date(message.createdAt).toLocaleString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </Box>
                          </Box>
                        </>
                      );
                    })}
                </InfiniteScroll>
              </Box>

              {/* Input field section */}
              <Box sx={{ marginTop: "5px", marginBottom: "0px" }}>
                <Divider
                  sx={{
                    backgroundColor: "#FFFFFF1A",
                    marginTop: "0px",
                    marginBottom: "15px",
                  }}
                />
                <TextField
                  className={classes.chat_input}
                  color="secondary"
                  value={value}
                  placeholder={t("cha-26_type-here")}
                  multiline
                  InputProps={{
                    inputComponent: TextareaAutosize,
                    startAdornment: (
                      <InputAdornment position="start">
                        <div style={{ width: 5 }} />{" "}
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="start">
                        <Button
                          className={classes.emoji_button}
                          onClick={handleEmojiClick}
                        >
                          <img
                            src={emotion}
                            style={{
                              cursor: "pointer",
                              display: "block",
                            }}
                          />
                        </Button>

                        <Button
                          className="send_button"
                          sx={{
                            display: value ? "block" : "none",
                          }}
                          onClick={sendMessage}
                        >
                          <Box className={"center-align"}>
                            <img src={send} />
                          </Box>
                        </Button>
                      </InputAdornment>
                    ),
                    style: { color: "#FFFFFF" },
                  }}
                  onChange={(e) => {
                    if (setValue) setValue(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    handleEnterinRoom(e);
                  }}
                />
                <Popover
                  open={isEmojiLibraryOpen}
                  onClose={handleCloseEmojiLibrary}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  anchorEl={anchorEl}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  slotProps={{
                    paper: {
                      style: {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    },
                  }}
                >
                  <EmojiPicker
                    className={classes.emojipicker}
                    onEmojiClick={handleEmojiSelect}
                    defaultSkinTone={SkinTones.LIGHT}
                    autoFocusSearch={true}
                  />
                </Popover>
              </Box>
            </Box>
          </Box>
          <Chatindex viewChat={showChat} setViewChat={setChat} />
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default Chatroom;
