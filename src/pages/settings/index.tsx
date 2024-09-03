import { useState } from "react";

import { Box, SwipeableDrawer } from "@mui/material";

import Main from "./Main";
import Chain from "./Chain";
import General from "./General";
import Language from "./Language";
import Chat from "./Chat";
import Message from "./Message";
import Friend from "./Friend";
import Wallet from "./Wallet";
import Currency from "./Currency";
import Notification from "./Notification";
import Hour from "./Hour";
import About from "./About";
import Fee from "./Fee";
import Profile from "./Profile";
import Security from "./Security";
import Password from "./Password";
import Address from "./Address";
import Backup from "./Backup";

import SettingStyle from "../../styles/SettingStyle";

import { propsSettingType } from "../../types/settingTypes";

import closeImg from "../../assets/settings/collaps-close-btn.svg";

type Anchor = "right";

const Settings = ({ view, setView }: propsSettingType) => {
  const classname = SettingStyle();
  const [state, setState] = useState({ right: false });
  const [panel, setPanel] = useState("main");

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={view}
      // onClose={toggleDrawer("right", false)}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classname.setting_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
    >
      <Box className={classname.collaps_pan}>
        <img src={closeImg} className={classname.close_icon} onClick={() => setView(false)} />
      </Box>
      <Box className={classname.setting_pan}>
        <Main view={panel} setView={setPanel} />
        <Chain view={panel} setView={setPanel} />
        <General view={panel} setView={setPanel} />
        <Language view={panel} setView={setPanel} />
        <Chat view={panel} setView={setPanel} />
        <Message view={panel} setView={setPanel} />
        <Friend view={panel} setView={setPanel} />
        <Wallet view={panel} setView={setPanel} />
        <Currency view={panel} setView={setPanel} />
        <Notification view={panel} setView={setPanel} />
        <Hour view={panel} setView={setPanel} />
        <About view={panel} setView={setPanel} />
        <Fee view={panel} setView={setPanel} />
        <Profile view={panel} setView={setPanel} />
        <Security view={panel} setView={setPanel} />
        <Password view={panel} setView={setPanel} />
        <Address view={panel} setView={setPanel} />
        <Backup view={panel} setView={setPanel} />
      </Box>
    </SwipeableDrawer>
  );
};

export default Settings;
