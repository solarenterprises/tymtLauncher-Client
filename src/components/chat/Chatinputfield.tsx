import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Popover,
  TextField,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import emotion from "../../assets/chat/emotion.svg";
import send from "../../assets/chat/chatframe.svg";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatStyle from "../../styles/ChatStyles";
import EmojiPicker, { SkinTones } from "emoji-picker-react";
import { useSocket } from "../../providers/SocketProvider";
import {
  ChatHistoryType,
  IContact,
  propsChatinputfieldType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { encrypt } from "../../lib/api/Encrypt";
import { selectEncryptionKeyByUserId } from "../../features/chat/Chat-encryptionkeySlice";
import { getCurrentPartner } from "../../features/chat/CurrentPartnerSlice";
import { AppDispatch } from "../../store";

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

const Chatinputfield = ({
  value,
  keyperuser,
  setValue,
}: propsChatinputfieldType) => {
  const { socket } = useSocket();
  const { t } = useTranslation();
  const classes = ChatStyle();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const currentPartnerStore: IContact = useSelector(getCurrentPartner);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const userid: string = currentPartnerStore._id;
  const existkey: string = useSelector((state) =>
    selectEncryptionKeyByUserId(state, userid)
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [EmojiLibraryOpen, setIsEmojiLibraryOpen] = useState(false);

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
    try {
      if (value.trim() !== "") {
        const encryptedvalue = await encrypt(value, keyperuser);
        console.log("socket.current.emit > post-message", keyperuser);
        const message = {
          sender_id: accountStore.uid,
          recipient_id: currentPartnerStore._id,
          message: encryptedvalue,
          createdAt: Date.now(),
        };
        socket.current.emit("post-message", JSON.stringify(message));
        const data = {
          alertType: "chat",
          note: {
            sender: `${accountStore.uid}`,
            message: encryptedvalue,
          },
          receivers: [currentPartnerStore._id],
        };
        socket.current.emit("post-alert", JSON.stringify(data));
        const updatedHistory = [message, ...chatHistoryStore.messages];
        dispatch(
          setChatHistory({
            messages: updatedHistory,
          })
        );
        setValue("");
      }
    } catch (err: any) {}
  }, [accountStore, currentPartnerStore]);

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
    }
  };

  return (
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
  );
};

export default Chatinputfield;
