import { useCallback, useState, useRef, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import EmojiPicker, { SkinTones } from "emoji-picker-react";

import { Box, Button, Divider, InputAdornment, Popover, TextField } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { ISKeyList, getSKeyList } from "../../features/chat/SKeyListSlice";
import { getChatHistory, setChatHistory } from "../../features/chat/ChatHistorySlice";

import { encrypt } from "../../lib/api/Encrypt";

import ChatStyle from "../../styles/ChatStyles";
import emotion from "../../assets/chat/emotion.svg";
import send from "../../assets/chat/chatframe.svg";

import { ChatHistoryType, propsChatInputFieldType } from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
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

const ChatInputField = ({ value, setValue }: propsChatInputFieldType) => {
  const { socket } = useSocket();
  const { t } = useTranslation();
  const classes = ChatStyle();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);

  const [anchorEl, setAnchorEl] = useState(null);
  const [EmojiLibraryOpen, setIsEmojiLibraryOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input dialog
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;

      if (files && files.length > 0) {
        const file = files[0];
        let fileType: string = "";
        if (file.type.startsWith("image/")) {
          fileType = "image";
        } else if (file.type.startsWith("audio/")) {
          fileType = "audio";
        } else if (file.type.startsWith("video/")) {
          fileType = "video";
        } else {
          fileType = "file";
        }

        console.log("handleFileInputChange", fileType, file);
      }
    } catch (err) {
      console.error("Failed to handleFileInputChange: ", err);
    }
  };

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

  const sendMessage = useCallback(async () => {
    if (socket.current && socket.current.connected) {
      try {
        if (value.trim() !== "") {
          // Encrypt & send the message
          const currentSKey = sKeyListStore?.sKeys?.find((element) => element?.roomId === currentChatroomStore?._id)?.sKey;
          const encryptedMessage = currentChatroomStore?.isPrivate ? await encrypt(value, currentSKey) : value;
          const message = {
            sender_id: accountStore?.uid,
            room_id: currentChatroomStore?._id,
            message: encryptedMessage,
            createdAt: Date.now(),
          };
          socket.current.emit("post-message", JSON.stringify(message));
          console.log("socket.current.emit > post-message", message);

          // Trigger the alert
          const data = {
            alertType: "chat",
            note: {
              sender: accountStore?.uid,
              room_id: currentChatroomStore?._id,
              message: encryptedMessage,
            },
            receivers: currentChatroomStore?.participants?.filter((element) => element.userId !== accountStore.uid)?.map((element_2) => element_2.userId),
          };
          socket.current.emit("post-alert", JSON.stringify(data));
          console.log("socket.current.emit > post-alert");

          // Update the chatHistoryStore
          const updatedHistory = [message, ...chatHistoryStore.messages];
          dispatch(
            setChatHistory({
              messages: updatedHistory,
            })
          );

          // Clear the input field
          setValue("");
        }
      } catch (err) {
        console.error("Failed to sendMessage: ", err);
      }
    }
  }, [socket.current, accountStore, currentChatroomStore, sKeyListStore, value]);

  const handleEnter = useCallback(
    async (e: any) => {
      if (e.key === "Enter" && (e.ctrlKey || e.shiftKey)) {
        e.preventDefault();

        const cursorPosition = e.target.selectionStart;
        const beforeText = value.substring(0, cursorPosition);
        const afterText = value.substring(cursorPosition);
        setValue(`${beforeText}\n${afterText}`);

        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
        }, 0);
      } else if (e.key === "Enter") {
        e.preventDefault();

        await sendMessage();
        setValue("");
      }
    },
    [sendMessage, value]
  );

  return (
    <>
      <Box sx={{ marginTop: "5px", marginBottom: "0px" }}>
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
                  <div style={{ width: 5 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <Button className={classes.emoji_button} onClick={handleEmojiClick}>
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

                  <Button
                    className="upload_button"
                    sx={{
                      display: value ? "none" : "block",
                    }}
                    onClick={handleUploadClick}
                  >
                    <Box className={"center-align"}>
                      <FileUploadIcon sx={{ color: "#ffffff" }} />
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
          <EmojiPicker className={classes.emojipicker} onEmojiClick={handleEmojiSelect} defaultSkinTone={SkinTones.LIGHT} autoFocusSearch={true} />
        </Popover>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }} // Hide the input
        onChange={handleFileInputChange}
      />
    </>
  );
};

export default ChatInputField;
