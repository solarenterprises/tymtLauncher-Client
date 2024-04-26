import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Popover,
} from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  ChatHistoryType,
  ChatMessageType,
  // askEncryptionKeyType,
  deliverEncryptionKeyType,
  propsType,
  scrollDownType,
  userType,
} from "../../types/chatTypes";
import { accountType, walletEnum } from "../../types/accountTypes";
import { chatType, notificationType } from "../../types/settingTypes";

import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { getAccount } from "../../features/account/AccountSlice";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import { getCustodial } from "../../features/account/CustodialSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import {
  getdownState,
  setdownState,
} from "../../features/chat/Chat-scrollDownSlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { addEncryptionKey, selectEncryptionKeyByUserId } from "../../features/chat/Chat-enryptionkeySlice";

import EmojiPicker, { SkinTones } from "emoji-picker-react";
import maximize from "../../assets/chat/maximize.svg";
import emotion from "../../assets/chat/emotion.svg";
import send from "../../assets/chat/chatframe.svg";
import backIcon from "../../assets/settings/back-icon.svg";
import ChatStyle from "../../styles/ChatStyles";
import Avatar from "../../components/home/Avatar";
import OrLinechat from "../../components/chat/Orlinechat";

import "firebase/database";

import React from "react";

import { socket_backend_url } from "../../configs";
import { io, Socket } from "socket.io-client";
import { AppDispatch } from "../../store";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroller";
// import { generateRandomString } from "../../features/chat/Chat-contactApi";
// import { selectEncryptionKeyByUserId } from "../../features/chat/Chat-enryptionkeySlice";
import { encrypt, decrypt } from "../../lib/api/Encrypt";
import { generateRandomString } from "../../features/chat/Chat-contactApi";

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

const Chatbox = ({ view, setView }: propsType) => {
  const account: accountType = useSelector(getAccount);
  const currentpartner: userType = useSelector(selectPartner);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const scrollstate: scrollDownType = useSelector(getdownState);
  const notificationStore: notificationType = useSelector(selectNotification);
  const data: chatType = useSelector(selectChat);
  const shouldScrollDown = scrollstate.down;
  const userStore =
    account.wallet === walletEnum.noncustodial
      ? useSelector(getNonCustodial)
      : useSelector(getCustodial);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const classes = ChatStyle();
  const [value, setValue] = useState<string>("");
  const [EmojiLibraryOpen, setIsEmojiLibraryOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [decryptedMessages, setDecryptedMessages] = useState<ChatMessageType[]>(
    []
  );
  const [keyperuser, setKeyperUser] = useState<string>("");
  const userid: string = currentpartner._id;
  const existkey: string = useSelector((state) =>
    selectEncryptionKeyByUserId(state, userid)
  );

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

  // When currentpartner is changed ask encryption key to partner

  useEffect(() => {
    if (existkey) {
      setKeyperUser(existkey);
    } else {
      const key = generateRandomString(32);
      const deliverydata: deliverEncryptionKeyType = {
        sender_id: account.uid,
        recipient_id: currentpartner._id,
        key: key,
      };
      socket.emit("deliver-encryption-key", JSON.stringify(deliverydata));
      dispatch(addEncryptionKey({ userid, key }));
    }
  }, [currentpartner._id, existkey]);

  const sendMessage = async () => {
    try {
      if (value.trim() !== "") {
        const encryptedvalue = await encrypt(value, keyperuser);
        const message = {
          sender_id: account.uid,
          recipient_id: currentpartner._id,
          room_id: `room_${account.uid}_${currentpartner._id}`,
          message: encryptedvalue,
          createdAt: Date.now(),
        };
        socket.emit("post-message", JSON.stringify(message));
        const data = {
          alertType: "chat",
          note: {
            sender: `${account.uid}`,
            message: encryptedvalue,
          },
          receivers: [currentpartner._id],
        };
        socket.emit("post-alert", JSON.stringify(data));
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

  const handleEnter = async (e: any) => {
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
      if (existkey) {
        await sendMessage();
      } // Handle sending the message
      setValue(""); // Reset input field
      dispatch(setdownState({ down: !shouldScrollDown }));
    }
  };

  // When the scrolling up, this function fetches one page of history for each loading.

  const fetchMessages = _.debounce(async () => {
    if (!hasMore) return;

    const query = {
      sender_id: account.uid,
      recipient_id: currentpartner._id,
      pagination: { page: page, pageSize: 7 },
    };
    socket.emit("get-messages-by-room", JSON.stringify(query));
    socket.on("messages-by-room", async (result) => {
      if (result && result.data.length > 0) {
        if (data.message === "anyone" || data.message === "friend") {
          dispatch(
            setChatHistory({
              messages: [...chatHistoryStore.messages, ...result.data],
            })
          );
          setPage(page + 1);
        }
      } else {
        setHasMore(false);
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

  function useChatScroll(
    shouldScrollDown: boolean,
    currentpartnerid: string,
    view: string
  ) {
    const scrollRef = useRef<HTMLDivElement>();
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [shouldScrollDown, currentpartnerid, view]);
    return scrollRef;
  }

  const scrollRef = useChatScroll(shouldScrollDown, currentpartner._id, view);

  useEffect(() => {
    const decryptMessages = async () => {
      const decryptedMessages = await Promise.all(
        chatHistoryStore.messages.map(async (message) => {
          const messagetodecrypt: string = message?.message;

          const decryptedMessage: string = await decrypt(
            messagetodecrypt,
            keyperuser
          );
          return {
            ...message,
            message: decryptedMessage,
          };
        })
      );
      setDecryptedMessages(decryptedMessages);
    };

    decryptMessages();
  }, [chatHistoryStore.messages]);

  return (
    <>
      {view === "chatbox" && (
        <Box className={classes.chatbox_container}>
          {/* Header section */}
          <Box
            sx={{
              width: "100%",
              position: "relative",
            }}
          >
            <Stack flexDirection={"row"} alignItems={"center"}>
              <Button className={classes.common_btn}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setView("chatmain")}
                >
                  <img src={backIcon} />
                </Box>
              </Button>
              <Stack alignItems={"center"} flexDirection={"row"}>
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
              </Stack>
            </Stack>
            <Button
              className={"common-btn"}
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
              }}
              onClick={() => navigate("/chat")}
            >
              <Box className={"center-align"}>
                <img src={maximize} />
              </Box>
            </Button>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
                marginTop: "24px",
                marginBottom: "5px",
              }}
            />
          </Box>

          {/* Message inbox */}

          <Box
            className={classes.scroll_bar_chatbox}
            display={"flex"}
            flexDirection={"column"}
            ref={scrollRef}
          >
            <Box sx={{ width: "100%", flex: "1 1 auto" }}></Box>
            <InfiniteScroll
              pageStart={page}
              loadMore={fetchMessages}
              hasMore={hasMore}
              isReverse={true}
              useWindow={false}
            >
              {[...decryptedMessages].reverse()?.map((message, index) => {
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

                  return !isSameDay(previousMessageDate, currentMessageDate);
                };

                const timeline = isFirstMessageOfDay()
                  ? formatDateDifference(message.createdAt)
                  : null;
                return (
                  <>
                    {/* Existing Box for rendering the message */}
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
                        {new Date(message.createdAt).toLocaleString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Box>
                    </Box>
                  </>
                );
              })}
            </InfiniteScroll>
          </Box>

          {/* Input field section */}
          <Box sx={{ marginTop: "5px" }}>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
                marginTop: "0px",
                marginBottom: "15px",
              }}
            />
            <ThemeProvider theme={theme}>
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
                  handleEnter(e);
                }}
              />
            </ThemeProvider>
            <Popover
              open={EmojiLibraryOpen}
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
      )}
    </>
  );
};

export default Chatbox;
