import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import { Box, Stack, TextField, ThemeProvider, InputAdornment, Button, Divider, createTheme } from "@mui/material";
import { ICurrentChatroomMember, ICurrentChatroomMembers, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";
import { searchUsers } from "../../features/chat/ContactListApi";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import GroupMemberListItem from "../../components/chat/GroupMemberListItem";
import { IChatroom } from "../../types/ChatroomAPITypes";
import ChatStyle from "../../styles/ChatStyles";
import searchlg from "../../assets/searchlg.svg";
import settingicon from "../../assets/chat/settings.svg";
import backIcon from "../../assets/settings/back-icon.svg";

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

export interface IPropsChatGroupMemberList {
  view: string;
  setView: (panel: string) => void;
}

const ChatGroupMemberList = ({ view, setView }: IPropsChatGroupMemberList) => {
  const classes = ChatStyle();
  const { t } = useTranslation();
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const currentChatroomMembersStore: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);
  const [value, setValue] = useState<string>("");
  const [searchedUserList, setSearchedUserList] = useState<ICurrentChatroomMember[]>([]);

  const debouncedFilterUsers = debounce(async (value: string) => {
    setSearchedUserList(await searchUsers(value));
  }, 1000);

  const filterUsers = (value: string) => {
    debouncedFilterUsers(value);
  };

  useEffect(() => {
    // This effect will run whenever currentChatroomMembersStore changes
  }, [currentChatroomMembersStore]);

  return (
    <>
      {view === "chatGroupMemberList" && (
        <>
          <Box
            sx={{
              display: "flex",
              padding: "16px 8px 16px 16px",
              flexDirection: "column",
              margin: "10px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                paddingRight: "8px",
                position: "relative",
              }}
            >
              <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"}>
                <Button className={"setting-back-button"} onClick={() => setView("chatbox")}>
                  <Box component={"img"} src={backIcon}></Box>
                </Button>
                <Box className="fs-h3 white">{currentChatroomStore?.room_name}</Box>
              </Stack>
              <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} marginTop={"30px"}>
                <ThemeProvider theme={theme}>
                  <TextField
                    className={classes.search_bar}
                    color="secondary"
                    value={value}
                    placeholder={t("cha-3_you-search-user")}
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
                        filterUsers(e.target.value);
                      }
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
            <Box className={classes.scroll_bar}>
              {!value &&
                currentChatroomMembersStore?.members?.map((member, index) => {
                  return <GroupMemberListItem member={member} index={index} invited={true} />;
                })}
              {value &&
                searchedUserList?.map((member, index) => {
                  if (currentChatroomMembersStore?.members?.some((element) => element._id === member._id))
                    return <GroupMemberListItem member={member} index={index} invited={true} />;
                  else return <GroupMemberListItem member={member} index={index} invited={false} />;
                })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ChatGroupMemberList;
