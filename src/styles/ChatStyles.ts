import { makeStyles } from "@mui/styles";

const ChatStyle = makeStyles({
  common_btn: {
    "&.MuiButtonBase-root": {
      display: "block",
      textTransform: "none",
      borderRadius: "0",
      color: "#52E1F21A",
      minWidth: "unset",
      boxShadow: "none",
      margin: 0,
      "&:hover": {
        backgroundColor: "#FFFFFF1A",
      },
      "&:active": {
        backgroundColor: "#52E1F21A",
      },
    },
  },
  center_align: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },

  //chatting box structure
  chat_container: {
    height: "98% !important",
    minWidth: "500px",
    display: "flex",
    borderRadius: "32px",
    backgroundColor: "#8080804D !important",
    backgroundBlendMode: "luminosity",
    backdropFilter: "blur(4px)",
    margin: "10px",
    "&.MuiPaper-root": {
      flexDirection: "row",
    },
    zIndex: -1,
  },
  collaps_pan: {
    width: "45px",
    height: "100%",
    position: "relative",
    marginRight: "0px",
  },
  close_icon: {
    cursor: "pointer",
    position: "absolute",
    bottom: "40px",
  },
  main_pan: {
    maxWidth: "455px",
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    borderRadius: "24px",
    backgroundColor: "#071516",
    whiteSpace: "nowrap",
    scrollbarWidth: "none",
    position: "relative",
    marginRight: "0px",
  },
  search_bar: {
    width: "357px",
    "& .MuiInputBase-root": {
      height: "44px",
      borderRadius: "var(--Angle-Number, 32px)",
      border:
        "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
      background:
        "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
      backgroundBlendMode: "luminosity",
      fontFamily: "Cobe",
      color: "var(--Basic-Light, #AFAFAF)",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "gray", // Change the border color on hover
      },
    },
    "&:hover": {
      backgroundColor: "var(--Windows-Glass, rgba(128, 128, 128, 0.30))",
      borderRadius: "var(--Angle-Number, 32px)", // this will make it turn gray on hover
    },
    "&:covered": {
      background: "var(--Windows-Glass, rgba(128, 128, 128, 0.30))",
    },

    "& input": {
      color: "#FFFFFF",
    },
    flexShrink: 1,
  },
  chat_input: {
    marginBottom: "1%",
    width: "100%",
    "& .MuiInputBase-root": {
      "& textarea": {
        height: "auto",
        minHeight: "25px", // Set the minimum height for the input field
      },
      borderRadius: "var(--Angle-Number, 32px)",
      border:
        "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
      background:
        "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
      backgroundBlendMode: "luminosity",
      fontFamily: "Cobe",
      color: "var(--Basic-Light, #AFAFAF)",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "gray", // Change the border color on hover
      },
    },
    flexShrink: 1,
    "MuiOutlinedInput-notchedOutline": {
      innerWidth: "80%",
    },
    "&:hover": {
      backgroundColor: "var(--Windows-Glass, rgba(128, 128, 128, 0.30))",
      borderRadius: "var(--Angle-Number, 32px)", // this will make it turn gray on hover
    },
    "&:covered": {
      background: "var(--Windows-Glass, rgba(128, 128, 128, 0.30))",
    },
  },
  chatbox_container: {
    width: "410px",
    position: "fixed",
    display: "flex",
    padding: "16px",
    flexDirection: "column",
    margin: "10px",
    marginBottom: "30px",
    height: "calc(100% - 50px)",
    justifyContent: "space-between",
  },
  emoji_button: {
    "&.MuiButtonBase-root": {
      width: "40px",
      height: "40px",
      display: "flex",
      textTransform: "none",
      borderRadius: "200px",
      color: "#52E1F21A",
      minWidth: "unset",
      boxShadow: "none",
      margin: 0,
      "&:hover": {
        backgroundColor: "#FFFFFF1A",
      },
      "&:active": {
        backgroundColor: "#52E1F21A",
      },
    },
    justifyContent: "center",
  },
  send_button: {
    marginLeft: "10px",
    minWidth: "40px",
    width: "40px",
    height: "40px",
    borderRadius: "52px",
    background: "#EF4444",
    "&:hover": {
      background: "#992727",
    },
    transition: "opacity 0.5s ease, transform 0.1s ease",
    transform: "scale(1)",
    "&:active": {
      transform: "scale(0.9)",
    },
  },
  emojipicker: {
    width: "100%",
    background: "#F2F3F5",
    borderRadius: "16px",
    border: "1px solid #E6E6E6",
    marginBottom: "15px",
    marginRight: "40px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  scroll_bar: {
    flexGlow: 1,
    height: "calc(100vh - 220px)",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      borderRadius: "100px",
      width: "5px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    "&::-webkit-scrollbar-track": {
      cursor: "pointer",
      borderRadius: "100px",
      background:
        "var(--bg-stroke-white-10-stroke-default, rgba(255, 255, 255, 0.10))",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "100px",
      background: "#888",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  scroll_bar_chatbox: {
    width: "101%",
    flexGrow: 1,
    overflowY: "auto",
    marginBottom: "0px",
    height: "calc(100vh - 200px)",
    paddingRight: "10px",
    display:"flex",
    flexDirection:"column",
    "&::-webkit-scrollbar": {
      borderRadius: "100px",
      width: "5px",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: "100px",
      background:
        "var(--bg-stroke-white-10-stroke-default, rgba(255, 255, 255, 0.10))",
    },
    "&::-webkit-scrollbar-thumb": {
      cursor: "pointer",
      borderRadius: "100px",
      background: "#888",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },

  },

  // chatroom
  userlist_container: {
    width: "455px",
    maxWidth: "455px",
    // width: "33%",
    height: "100%",
    overflow: "scroll",
    backgroundColor: "#071516",
    whiteSpace: "nowrap",
    overFlowX: "auth",
    scrollbarWidth: "none",
    position: "relative",
  },
  userlist_btn: {
    height: "64px",
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    paddingTop: "12px 0 12px 0",
    cursor: "pointer",
    "&:hover": {
      borderRadius: "5px",
      backgroundColor: "#FFFFFF1A",
    },
    "&:active": {
      backgroundColor: "#52E1F21A",
    },
  },
  inbox_container: {
    background: "rgba(255, 255, 255, 0.05)",
    zIndex: 100,
    width: "calc(100% - 510px)",
    position: "fixed",
    display: "flex",
    padding: "16px",
    paddingRight: "32px",
    paddingLeft: "32px",
    flexDirection: "column",
    marginBottom: "0px",
    height: "calc(100% - 90px)",
    justifyContent: "space-between",
  },
});

export default ChatStyle;
