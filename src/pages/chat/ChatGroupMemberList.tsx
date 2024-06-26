import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Box, Stack, TextField, ThemeProvider, InputAdornment, Button, Divider, createTheme } from "@mui/material";
import { ICurrentChatroomMembers, getCurrentChatroomMembers } from "../../features/chat/CurrentChatroomMembersSlice";
import GroupMemberListItem from "../../components/chat/GroupMemberListItem";
import ChatStyle from "../../styles/ChatStyles";
import searchlg from "../../assets/searchlg.svg";
import settingicon from "../../assets/chat/settings.svg";

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
  const currentChatroomMembers: ICurrentChatroomMembers = useSelector(getCurrentChatroomMembers);
  const [value, setValue] = useState<string>("");

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
              <Box className={"fs-24-bold white"} marginTop={"0px"}>
                {t("cha-1_chat")}
              </Box>
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
                  />
                </ThemeProvider>
                <Button className={"common-btn"}>
                  <Box
                    className={"center-align"}
                    onClick={() => {
                      setView("chatsetting");
                    }}
                  >
                    <img src={settingicon} style={{ cursor: "pointer" }} />
                  </Box>
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
              {currentChatroomMembers.members.map((member, index) => {
                return <GroupMemberListItem member={member} index={index} />;
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ChatGroupMemberList;
