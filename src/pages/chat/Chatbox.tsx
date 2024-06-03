import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Divider, Button, Stack } from "@mui/material";
import {
  ChatHistoryType,
  IContact,
  encryptionkeyStoreType,
  propsType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { chatType } from "../../types/settingTypes";
import { getAccount } from "../../features/account/AccountSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { selectEncryptionKeyStore } from "../../features/chat/Chat-encryptionkeySlice";
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
import InfiniteScroll from "react-infinite-scroll-component";
import {
  setMountedFalse,
  setMountedTrue,
} from "../../features/chat/Chat-intercomSupportSlice";
import { ThreeDots } from "react-loader-spinner";
import { Chatdecrypt } from "../../lib/api/ChatEncrypt";
import { useTranslation } from "react-i18next";
import { getCurrentPartner } from "../../features/chat/CurrentPartnerSlice";

const Chatbox = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const classes = ChatStyle();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [processedPages, setProcessedPages] = useState(new Set());

  const valueRef = useRef(value);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);
  const processedPagesRef = useRef(processedPages);

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
    processedPagesRef.current = processedPages;
  }, [processedPages]);

  const accountStore: accountType = useSelector(getAccount);
  const currentPartnerStore: IContact = useSelector(getCurrentPartner);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const chatStore: chatType = useSelector(selectChat);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );
  const currentKey =
    encryptionKeyStore.encryption_Keys[currentPartnerStore._id];

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
    if (currentPartnerStore._id && view === "chatbox") {
      setPage(1);
      setHasMore(true);
      dispatch(setChatHistory({ messages: [] }));
      setProcessedPages(new Set());
    }
  }, [currentPartnerStore, view]);

  const fetchMessages = async () => {
    try {
      if (accountStoreRef.current.uid && currentPartnerStoreRef.current._id) {
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
          console.log("Chatbox > socket.current.emit > get-messages-by-room");
        }
      }
      console.log("fetchMessages");
    } catch (err) {
      console.error("Failed to fetchMessages: ", err);
    }
  };

  // Fetch chat history of the first page
  useEffect(() => {
    if (socket.current && page === 1 && view === "chatbox") {
      fetchMessages();
    }
  }, [socket.current, page, view]);

  useEffect(() => {
    if (socket.current && view === "chatbox") {
      if (!socket.current.hasListeners("messages-by-room")) {
        socket.current.on("messages-by-room", async (result) => {
          console.log("Chatbox > socket.current.on > messages-by-room", result);
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
  }, [socket.current, view]);

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

  const decryptMessage = useCallback(
    (encryptedmessage: string) => {
      console.log("decryptMessage", currentKey);
      return Chatdecrypt(encryptedmessage, currentKey);
    },
    [currentKey]
  );

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
    if (scrollref.current && valueRef.current === "" && view === "chatbox")
      Scroll();
  }, [valueRef.current, view]);

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
            className={"scroll_bar_chatbox"}
            display={"flex"}
            flexDirection={"column"}
            ref={scrollref}
            id={"container"}
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
                        key={`${index}-${message.createdAt}`}
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
            keyperuser={currentKey}
          />
        </Box>
      )}
    </>
  );
};

export default Chatbox;
