import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Popover,
  // Stack,
  TextField,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ChatStyle from "../../styles/ChatStyles";
import emotion from "../../assets/chat/emotion.svg";
import send from "../../assets/chat/chatframe.svg";
import AttachFileIcon from "@mui/icons-material/AttachFile";
// import DeleteIcon from "@mui/icons-material/Delete";

import EmojiPicker, { SkinTones } from "emoji-picker-react";
import { useSocket } from "../../providers/SocketProvider";
import {
  ChatHistoryType,
  propsChatinputfieldType,
  // propsUploadFilesType,
  userType,
} from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";
import { selectPartner } from "../../features/chat/Chat-currentPartnerSlice";
import {
  getChatHistory,
  setChatHistory,
} from "../../features/chat/Chat-historySlice";
import { encrypt } from "../../lib/api/Encrypt";
import { selectEncryptionKeyByUserId } from "../../features/chat/Chat-encryptionkeySlice";
import ComingModal from "../ComingModal";
// import { UploadButton } from "@bytescale/upload-widget-react";
// import { UploadDropzone } from "@bytescale/upload-widget-react";
// import { UrlBuilder } from "@bytescale/sdk";
// import { deleteFile } from "../../features/chat/Chat-assestApi";

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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = ChatStyle();
  const account: accountType = useSelector(getAccount);
  const currentpartner: userType = useSelector(selectPartner);
  const chatHistoryStore: ChatHistoryType = useSelector(getChatHistory);
  const userid: string = currentpartner._id;
  const existkey: string = useSelector((state) =>
    selectEncryptionKeyByUserId(state, userid)
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [EmojiLibraryOpen, setIsEmojiLibraryOpen] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

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

  const sendMessage = async () => {
    try {
      if (value.trim() !== "") {
        const encryptedvalue = await encrypt(value, keyperuser);
        const message = {
          sender_id: account.uid,
          recipient_id: currentpartner._id,
          // room_id: `room_${account.uid}_${currentpartner._id}`,
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
    }
  };

  // const options = {
  //   apiKey: "free",
  //   maxFileCount: 5,
  //   showFinishButton: true,
  // };

  // const [files, setFiles] = useState<any[]>([]);

  // const MyUploadButton = ({ setFiles }) => (
  //   <UploadButton options={options} onComplete={setFiles}>
  //     {({ onClick }) => (
  //       <IconButton
  //         sx={{
  //           color: "var(--Basic-Light, #AFAFAF)",
  //           transform: "rotate(45deg)",
  //           padding: "4px",
  //           "&:hover": {
  //             transform: "rotate(45deg)",
  //             backgroundColor: "#FFFFFF1A",
  //           },
  //           "&:active": {
  //             backgroundColor: "#52E1F21A",
  //           },
  //         }}
  //         onClick={onClick}
  //       >
  //         <AttachFileIcon />
  //       </IconButton>
  //     )}
  //   </UploadButton>
  // );

  // const MyDropzone = ({ setFiles }) => (
  //   <UploadDropzone
  //     options={options}
  //     onUpdate={({ uploadedFiles }) =>
  //       console.log(`Files: ${uploadedFiles.map((x) => x.fileUrl).join("\n")}`)
  //     }
  //     onComplete={setFiles}
  //     width="600px"
  //     height="375px"
  //   />
  // );

  // const MyUploadedFiles = ({ files }) => {
  //   const handleDeleteFile = (filePath, accountId) => {
  //     deleteFile({
  //       accountId: accountId,
  //       apiKey: "free",
  //       querystring: {
  //         filePath: filePath,
  //       },
  //     }).then(
  //       () => {
  //         // Remove the deleted file from the files array
  //         const updatedFiles = files.filter(
  //           (file) => file.filePath !== filePath
  //         );
  //         setFiles(updatedFiles);
  //       },
  //       (error) => console.error(error)
  //     );
  //   };

  //   return (
  //     <>
  //       {files.map((file) => {
  //         // Save 'filePath' to your DB, and construct URLs using UrlBuilder:
  //         const { filePath, accountId } = file;
  //         // Build an image transformation URL for the uploaded file.
  //         // Remove 'options' to get the URL to the original file:
  //         const fileUrl = UrlBuilder.url({
  //           filePath,
  //           accountId,
  //           options: {
  //             transformation: "preset",
  //             transformationPreset: "thumbnail",
  //           },
  //         });
  //         return (
  //           <Stack key={filePath} direction="row" alignItems={"center"}>
  //             <Box className={"fs-12-light"}>
  //               <a href={fileUrl} target="_blank" color="#FFFFFF1A">
  //                 {fileUrl}
  //               </a>
  //             </Box>
  //             <IconButton
  //               sx={{
  //                 color: "var(--Basic-Light, #AFAFAF)",
  //                 padding: "4px",
  //                 "&:hover": {
  //                   backgroundColor: "#FFFFFF1A",
  //                 },
  //                 "&:active": {
  //                   backgroundColor: "#52E1F21A",
  //                 },
  //               }}
  //               onClick={() => handleDeleteFile(filePath, accountId)}
  //             >
  //               <DeleteIcon sx={{ width: "1px" }} />
  //             </IconButton>
  //           </Stack>
  //         );
  //       })}
  //     </>
  //   );
  // };

  return (
    <>
      {/* {files.length ? <MyUploadedFiles files={files} /> : <></>} */}
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
                  {/* <MyUploadButton setFiles={setFiles} /> */}
                  <IconButton
                    sx={{
                      color: "var(--Basic-Light, #AFAFAF)",
                      transform: "rotate(45deg)",
                      padding: "4px",
                      "&:hover": {
                        transform: "rotate(45deg)",
                        backgroundColor: "#FFFFFF1A",
                      },
                      "&:active": {
                        backgroundColor: "#52E1F21A",
                      },
                    }}
                    onClick={() => setOpen(true)}
                  >
                    <AttachFileIcon />
                  </IconButton>
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
      <ComingModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Chatinputfield;
