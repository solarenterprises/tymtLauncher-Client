import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import _ from "lodash";
import "firebase/database";

import { Box, Divider, Button, Stack } from "@mui/material";

import { addChatHistory } from "../../lib/api/JSONHelper";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { getChatHistory, setChatHistory, setChatHistoryAsync } from "../../features/chat/ChatHistorySlice";
import { selectChat } from "../../features/settings/ChatSlice";
import { setMountedFalse, setMountedTrue } from "../../features/chat/IntercomSupportSlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { ICurrentChatroomMembers, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";

import { useSocket } from "../../providers/SocketProvider";
import ChatInputField from "../../components/chat/Chatinputfield";
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
import Bubble from "../../components/chat/Bubble";

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
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);

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
        console.log("Chatbox > socket.current.emit > get-messages-by-room", query);
      }
      console.log("fetchMessages");
    } catch (err) {
      console.error("Failed to fetchMessages: ", err);
    }
  };

  // Fetch chat history of the first page
  useEffect(() => {
    if (socket.current && view === "chatbox") {
      dispatch(setChatHistoryAsync({ messages: [] })).then(() => {
        fetchMessages();
      });
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
  }, [socket.current, view]);

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
            <Stack direction={"row"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
              <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                <Button className={"setting-back-button"} onClick={() => setView("chatmain")}>
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
                <Stack
                  alignItems={"center"}
                  flexDirection={"row"}
                  gap={"16px"}
                  sx={{
                    cursor: "pointer",
                    width: "300px",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#ffffff33",
                    },
                  }}
                  onClick={() => {
                    if (!isDM) setView("chatGroupMemberList");
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
                  <Stack justifyContent={"flex-start"} direction={"column"} spacing={1} width={"244px"}>
                    <Box className={"fs-18-bold white"} sx={{ WebkitBoxOrient: "vertical", WebkitLineClamp: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
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
              </Stack>
              <Button
                className={"setting-back-button"}
                onClick={() => {
                  navigate("/chat");
                  dispatch(setChatHistory({ messages: [] }));
                }}
              >
                <Box component={"img"} src={maximize}></Box>
              </Button>
            </Stack>
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
              {[...chatHistoryStore.messages].reverse()?.map((message, index) => (
                <Bubble roomMode={false} screenExpanded={false} message={message} index={index} />
              ))}
            </InfiniteScroll>
            <div id={"emptyblock"}></div>
          </Box>

          {/* Input field section */}
          <ChatInputField value={value} setValue={setValue} />
        </Box>
      )}
    </>
  );
};

export default Chatbox;
