import { Snackbar, Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Slide from "@mui/material/Slide";

import CommonStyles from "../styles/commonStyles";
import failedIcon from "../assets/alert/failed-icon.svg";
import successIcon from "../assets/alert/success-icon.svg";
import warnnigIcon from "../assets/alert/warnning-icon.svg";
import alertIcon from "../assets/alert/alert-icon.svg";
import messageIcon from "../assets/alert/message-icon.svg";
import closeIcon from "../assets/settings/x-icon.svg";

import { propsAlertTypes } from "../types/commonTypes";
import { notification_duration } from "../configs";
import {
  selectPartner,
  setCurrentChatPartner,
} from "../features/chat/Chat-currentPartnerSlice";
import { scrollDownType, userType } from "../types/chatTypes";
import { getUserlist } from "../features/chat/Chat-userlistSlice";
import {
  getdownState,
  setdownState,
} from "../features/chat/Chat-scrollDownSlice";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const AlertComp = ({
  open,
  status,
  title,
  detail,
  setOpen,
  link,
}: propsAlertTypes) => {
  const searchParams = new URLSearchParams(link?.split("?")[1]);
  const userdata: userType[] = useSelector(selectPartner);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const scrollstate: scrollDownType = useSelector(getdownState);
  const shouldScrollDown = scrollstate.down;
  const senderId = searchParams.get("senderId");
  const senderUser = chatuserlist.find((user) => user._id === senderId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classname = CommonStyles();
  const [border, setBorder] = useState("");
  const [bg, setBg] = useState("");
  const [logo, setLogo] = useState<any>();
  useEffect(() => {
    if (status == "failed") {
      setLogo(failedIcon);
      setBorder("#5A3937");
      setBg("#5A39374D");
    }
    if (status == "success") {
      setLogo(successIcon);
      setBorder("#45583A");
      setBg("#45583A4D");
    }
    if (status == "warning") {
      setLogo(warnnigIcon);
      setBorder("#564E35");
      setBg("#564E354D");
    }
    if (status == "alert") {
      setLogo(alertIcon);
      setBorder("#485B61");
      setBg("#485B614D");
    }
    if (status == "message") {
      setLogo(messageIcon);
      setBorder("#485B61");
      setBg("#485B614D");
    }
  }, [status]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, notification_duration as number);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [open, status, title, detail]);

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
        sx={{
          maxWidth: "800px",
          zIndex: 5000,
          cursor: "pointer",
          transition: "transform 0.3s",
          "&:active": {
            transform: "scale(0.9)",
          },
        }}
        onClick={() => {
          navigate(link);
          if (senderUser) {
            dispatch(
              setCurrentChatPartner({
                ...userdata,
                _id: senderUser._id,
                nickName: senderUser.nickName,
                avatar: senderUser.avatar,
                lang: senderUser.lang,
                sxpAddress: senderUser.sxpAddress,
                onlineStatus: senderUser.onlineStatus,
                notificationStatus: senderUser.notificationStatus,
              })
            );
            dispatch(setdownState({ down: !shouldScrollDown }));
          }
        }}
      >
        <Stack
          className={classname.alert_container}
          sx={{
            border: `2px solid ${border}`,
            backdropFilter: "blur(4px)",
            background: bg,
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} gap={"12px"}>
              <Box className={classname.center_align}>
                <img src={logo} />
              </Box>
              <Stack direction={"column"} gap={"8px"}>
                <Box className={"fs-h4 white"}>{title}</Box>
                <Box className={"fs-16-regular white"}>
                  {detail.length > 100
                    ? detail.substring(0, 100) + "..."
                    : detail}
                </Box>
                {title === "Friend Request" && <></>}
              </Stack>
            </Stack>
            <Box onClick={() => setOpen(false)}>
              <img src={closeIcon} />
            </Box>
          </Stack>
        </Stack>
      </Snackbar>
    </>
  );
};
export default AlertComp;
