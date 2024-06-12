import { Box, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { propsChatType } from "../../types/chatTypes";
import ChatStyle from "../../styles/ChatStyles";
import closeicon from "../../assets/settings/collaps-close-btn.svg";
import Chatmain from "./Chatmain";
import ChatSetting from "./Chatsetting";
import ChatMsg from "./Chatsetting-Msg.tsx";
import Chatfriend from "./Chatsetting-friend.tsx";
import Chatbox from "./Chatbox.tsx";

type Anchor = "right";

const Chatindex = ({ viewChat, setViewChat }: propsChatType) => {
  const [state, setState] = useState({ right: false });
  const [panel, setPanel] = useState("chatmain");
  const classes = ChatStyle();
  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={viewChat}
      onClose={() => setViewChat(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classes.chat_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
    >
      <Box className={classes.collaps_pan}>
        <img src={closeicon} className={classes.close_icon} onClick={() => setViewChat(false)} />
      </Box>
      <Box className={classes.main_pan}>
        <Chatmain view={panel} setView={setPanel} />
        <ChatSetting view={panel} setView={setPanel} />
        <ChatMsg view={panel} setView={setPanel} />
        <Chatfriend view={panel} setView={setPanel} />
        <Chatbox view={panel} setView={setPanel} />
      </Box>
    </SwipeableDrawer>
  );
};

export default Chatindex;
