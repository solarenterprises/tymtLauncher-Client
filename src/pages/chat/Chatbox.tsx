import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ThreeDots } from "react-loader-spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash";
import "firebase/database";

import { Box, Divider, Button, Stack } from "@mui/material";

import { Chatdecrypt } from "../../lib/api/ChatEncrypt";
import { addChatHistory } from "../../lib/api/JSONHelper";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { getChatHistory, setChatHistory } from "../../features/chat/Chat-historySlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { setMountedFalse, setMountedTrue } from "../../features/chat/Chat-intercomSupportSlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { ICurrentChatroomMembers, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";
import { ISKeyList, getSKeyList } from "../../features/chat/SKeyListSlice";

import { useSocket } from "../../providers/SocketProvider";
import OrLinechat from "../../components/chat/Orlinechat";
import Chatinputfield from "../../components/chat/Chatinputfield";
import GroupAvatar from "../../components/chat/GroupAvatar";
import Avatar from "../../components/home/Avatar";

import { ChatHistoryType, propsType } from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { chatType } from "../../types/settingTypes";
import { IChatroom } from "../../types/ChatroomAPITypes";

import maximize from "../../assets/chat/maximize.svg";
import backIcon from "../../assets/settings/back-icon.svg";
import ChatStyle from "../../styles/ChatStyles";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";

const Chatbox = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const classes = ChatStyle();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [value, setValue] = useState<string>("");

  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const accountStore: accountType = useSelector(getAccount);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const chatStore: chatType = useSelector(selectChat);
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);

  const sKey = sKeyListStore.sKeys.find((element) => element.roomId === currentChatroomStore?._id)?.sKey;
  const isDM = currentChatroomStore?.room_name ? false : true;
  const currentPartner = isDM ? currentChatroomMembersStore.members.find((member) => member._id !== accountStore.uid) : null;
  const displayChatroomName = currentChatroomStore?.room_name ? currentChatroomStore?.room_name : currentPartner?.nickName;
  const displayChatroomSubName = currentChatroomStore?.room_name ? `${currentChatroomStore?.participants?.length ?? 0} Joined` : currentPartner?.sxpAddress;

  const accountStoreRef = useRef(accountStore);
  const currentChatroomStoreRef = useRef(currentChatroomStore);
  const chatHistoryStoreRef = useRef(chatHistoryStore);
  const chatStoreRef = useRef(chatStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    currentChatroomStoreRef.current = currentChatroomStore;
  }, [currentChatroomStore]);
  useEffect(() => {
    chatHistoryStoreRef.current = chatHistoryStore;
  }, [chatHistoryStore]);
  useEffect(() => {
    chatStoreRef.current = chatStore;
  }, [chatStore]);

  const fetchMessages = async () => {
    try {
      if (accountStoreRef.current.uid && currentChatroomStoreRef?.current._id) {
        const query = {
          room_id: currentChatroomStoreRef.current?._id,
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
    if (socket.current && view === "chatbox") {
      dispatch(setChatHistory({ messages: [] }));
      fetchMessages();
    }
  }, [socket.current, view]);

  useEffect(() => {
    if (socket.current && view === "chatbox") {
      if (!socket.current.hasListeners("messages-by-room")) {
        socket.current.on("messages-by-room", async (result) => {
          console.log("Chatbox > socket.current.on > messages-by-room", result);
          if (result && result.data.length > 0) {
            if (chatStoreRef.current.message === "anyone" || chatStoreRef.current.message === "friend") {
              dispatch(
                setChatHistory({
                  messages: addChatHistory([...chatHistoryStoreRef.current.messages], [...result.data]),
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
    const { offsetHeight, scrollHeight, scrollTop } = scrollref.current as HTMLDivElement;
    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      scrollref.current?.scrollTo(0, scrollHeight);
    }
  };

  useEffect(() => {
    if (scrollref.current && valueRef.current === "" && view === "chatbox") Scroll();
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
                {isDM && currentPartner && (
                  <Avatar
                    onlineStatus={activeUserListStore.users.some((user) => user === currentPartner._id)}
                    userid={currentPartner._id}
                    size={40}
                    status={currentPartner.notificationStatus}
                  />
                )}
                {!isDM && <GroupAvatar size={40} url={""} onClick={() => setView("chatGroupMemberList")} />}
                <Stack marginLeft={"16px"} justifyContent={"flex-start"} direction={"column"} spacing={1}>
                  <Box className={"fs-18-bold white"}>{displayChatroomName}</Box>
                  <Box className={"fs-12-regular gray"}>{displayChatroomSubName}</Box>
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
                dispatch(setChatHistory({ messages: [] }));
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
          <Box className={"scroll_bar_chatbox"} display={"flex"} flexDirection={"column"} ref={scrollref} id={"container"}>
            <Box sx={{ width: "100%", flex: "1 1 auto" }}></Box>

            <InfiniteScroll
              style={{
                minHeight: "100%",
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
                    {/* Existing Box for rendering the message */}
                    <Box className={"bubblecontainer"} key={`${index}-${message.createdAt}`}>
                      {timeline && decryptedmessage !== "Unable to decode message #tymt114#" && <OrLinechat timeline={timeline} />}
                      <Stack
                        flexDirection={"row"}
                        alignItems={"flex-end"}
                        marginTop={"10px"}
                        gap={"15px"}
                        justifyContent={message.sender_id === accountStore.uid ? "flex-end" : "flex-start"}
                      >
                        {message.sender_id === accountStore.uid && (
                          <>
                            <Box className={isLastMessageofStack ? "fs-14-regular white bubble-lastmessage-unexpanded" : "fs-14-regular white bubble"}>
                              {decryptedmessage !== "Unable to decode message #tymt114#" ? (
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
                            <Box className={isLastMessageofStack ? "fs-14-regular white bubble-partner-lastmessage" : "fs-14-regular white bubble-partner"}>
                              {decryptedmessage !== "Unable to decode message #tymt114#" ? (
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
            <div id={"emptyblock"}></div>
          </Box>

          {/* Input field section */}
          <Chatinputfield value={value} setValue={setValue} />
        </Box>
      )}
    </>
  );
};

export default Chatbox;
