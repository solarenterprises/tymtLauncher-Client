import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Divider, Button, Stack } from "@mui/material";
import {
  ChatHistoryType,
  deliverEncryptionKeyType,
  encryptionkeyStoreType,
  propsType,
  userType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { chatType } from "../../types/settingTypes";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import { getAccount } from "../../features/account/AccountSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { selectChat } from "../../features/settings/ChatSlice";
import {
  addEncryptionKey,
  selectEncryptionKeyStore,
} from "../../features/chat/Chat-encryptionkeySlice";
import maximize from "../../assets/chat/maximize.svg";
import backIcon from "../../assets/settings/back-icon.svg";
import ChatStyle from "../../styles/ChatStyles";
import Avatar from "../../components/home/Avatar";
import OrLinechat from "../../components/chat/Orlinechat";
import Chatinputfield from "../../components/chat/Chatinputfield";
import "firebase/database";
import React from "react";
import { useSocket } from "../../providers/SocketProvider";
import { AppDispatch } from "../../store";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroller";
import { generateRandomString } from "../../features/chat/Chat-contactApi";
import {
  setMountedFalse,
  setMountedTrue,
} from "../../features/chat/Chat-intercomSupportSlice";
import { ThreeDots } from "react-loader-spinner";
import { Chatdecrypt } from "../../lib/api/ChatEncrypt";

const Chatbox = ({ view, setView }: propsType) => {
  const classes = ChatStyle();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [keyperuser, setKeyperUser] = useState<string>("");
  const [processedPages, setProcessedPages] = useState(new Set());

  const accountStore: accountType = useSelector(getAccount);
  const currentPartnerStore: userType = useSelector(selectPartner);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const chatStore: chatType = useSelector(selectChat);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  const accountStoreRef = useRef(accountStore);
  const currentPartnerStoreRef = useRef(currentPartnerStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const chatStoreRef = useRef(chatStore);
  const encryptionKeyStoreRef = useRef(encryptionKeyStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    currentPartnerStoreRef.current = currentPartnerStore;
  }, [currentPartnerStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);
  useEffect(() => {
    encryptionKeyStoreRef.current = encryptionKeyStore;
  }, [encryptionKeyStore]);

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
      socket.emit("deliver-encryption-key", JSON.stringify(deliverydata));
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
    if (!hasMore) return;
    const query = {
      room_user_ids: [
        accountStoreRef.current.uid,
        currentPartnerStoreRef.current._id,
      ],
      pagination: { page: page, pageSize: 20 },
    };
    if (!processedPages.has(page)) {
      // Add the current page number to the set of processed pages
      setProcessedPages(new Set(processedPages.add(page)));
      socket.emit("get-messages-by-room", JSON.stringify(query));
      console.log("Chatbox > socket.emit > get-messages-by-room");
    }
  };

  useEffect(() => {
    socket.on("messages-by-room", async (result) => {
      console.log("Chatbox > socket.on > messages-by-room", result);
      if (result && result.data.length > 0) {
        if (
          chatStoreRef.current.message === "anyone" ||
          chatStoreRef.current.message === "friend"
        ) {
          dispatch(
            setChatHistory({
              messages: [
                ...chatHistoryStoreRef.current.messages,
                ...result.data,
              ],
            })
          );
          setPage(page + 1);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    });
    return () => {
      socket.off("messages-by-room");
    };
  }, [socket]);

  const debouncedFetchMessages = _.debounce(fetchMessages, 3000);

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
    return Chatdecrypt(encryptedmessage, keyperuser);
  };

  // Set mounted to true when chatbox is mounted

  useEffect(() => {
    if (view === "chatbox") {
      dispatch(setMountedTrue());
    }
    return () => {
      dispatch(setMountedFalse());
    };
  }, [dispatch, view]);

  const scrollref = useRef<HTMLDivElement>(null);
  const Scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } =
      scrollref.current as HTMLDivElement;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      scrollref.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    if (scrollref.current && value === "") Scroll();
  }, [value]);

  useEffect(() => {
    if (scrollref.current && page < 3) {
      scrollref.current.scrollTop = scrollref.current.scrollHeight;
    }
  }, [debouncedFetchMessages, currentPartnerStoreRef.current._id, page]);

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
                <Box className={"backIcon"} onClick={() => setView("chatmain")}>
                  <img src={backIcon} />
                </Box>
              </Button>
              <Stack alignItems={"center"} flexDirection={"row"}>
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
              onClick={() => {
                navigate("/chat");
                setPage(1);
                setHasMore(true);
                dispatch(setChatHistory({ messages: [] }));
                setProcessedPages(new Set());
              }}
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
            // className={classes.scroll_bar_chatbox}
            className={"scroll_bar_chatbox"}
            display={"flex"}
            flexDirection={"column"}
            ref={scrollref}
            id={"container"}
          >
            <Box sx={{ width: "100%", flex: "1 1 auto" }}></Box>

            <InfiniteScroll
              // pageStart={page}
              // initialLoad={false}
              loadMore={debouncedFetchMessages}
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

                    return !isSameDay(previousMessageDate, currentMessageDate);
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
                      {/* Existing Box for rendering the message */}
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
                            message.sender_id === accountStore.uid
                              ? "flex-end"
                              : "flex-start"
                          }
                        >
                          {message.sender_id === accountStore.uid && (
                            <>
                              <Box
                                className={
                                  isLastMessageofStack
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
            <div id={"emptyblock"}></div>
          </Box>

          {/* Input field section */}
          <Chatinputfield
            value={value}
            setValue={setValue}
            keyperuser={keyperuser}
          />
        </Box>
      )}
    </>
  );
};

export default Chatbox;
