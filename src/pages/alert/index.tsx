import { Box, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import { propsAlertType } from "../../types/alertTypes";
import ChatStyle from "../../styles/ChatStyles";
import closeicon from "../../assets/settings/collaps-close-btn.svg";

import Alertmain from "./Alertmain";

type Anchor = "right";

const Alertindex = ({ viewAlert, setViewAlert }: propsAlertType) => {
  const [state, setState] = useState({ right: false });
  const classes = ChatStyle();
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  return (
    <SwipeableDrawer
      anchor="right"
      open={viewAlert}
      onClose={() => setViewAlert(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classes.chat_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
    >
      <Box className={classes.collaps_pan}>
        <img
          src={closeicon}
          className={classes.close_icon}
          onClick={() => setViewAlert(false)}
        />
      </Box>
      <Box className={classes.main_pan}>
        <Alertmain />
      </Box>
    </SwipeableDrawer>
  );
};

export default Alertindex;
