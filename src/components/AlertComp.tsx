import { Snackbar, Stack, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Slide from "@mui/material/Slide";

import CommonStyles from "../styles/commonStyles";
import failedIcon from "../assets/alert/failed-icon.svg";
import successIcon from "../assets/alert/success-icon.svg";
import warnnigIcon from "../assets/alert/warnning-icon.svg";
import alertIcon from "../assets/alert/alert-icon.png";
import messageIcon from "../assets/alert/message-icon.svg";
import closeIcon from "../assets/settings/x-icon.svg";
import Avatar from "./home/Avatar";

import { propsAlertTypes } from "../types/commonTypes";
import { getUserlist } from "../features/chat/Chat-userlistSlice";
import { notification_duration } from "../configs";
import {
  selectPartner,
  setCurrentChatPartner,
} from "../features/chat/Chat-currentPartnerSlice";
import { scrollDownType, userType } from "../types/chatTypes";
import { accountType, nonCustodialType } from "../types/accountTypes";
import { multiWalletType } from "../types/walletTypes";

import {
  getdownState,
  setdownState,
} from "../features/chat/Chat-scrollDownSlice";
import {
  getFriendlist,
  setFriendlist,
} from "../features/chat/Chat-friendlistSlice";
import {
  approveFriendRequest,
  declineFriendRequest,
} from "../features/chat/Chat-alertApi";
import { getAccount } from "../features/account/AccountSlice";
import { getaccessToken } from "../features/chat/Chat-contactApi";
import { getNonCustodial } from "../features/account/NonCustodialSlice";
import { getMultiWallet } from "../features/wallet/MultiWalletSlice";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classname = CommonStyles();
  const searchParams = new URLSearchParams(link?.split("?")[1]);
  const userdata: userType[] = useSelector(selectPartner);
  const chatuserlist: userType[] = useSelector(getUserlist);
  const scrollstate: scrollDownType = useSelector(getdownState);
  const friendlist: userType[] = useSelector(getFriendlist);
  const account: accountType = useSelector(getAccount);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const shouldScrollDown = scrollstate.down;
  const [border, setBorder] = useState("");
  const [bg, setBg] = useState("");
  const [logo, setLogo] = useState<any>();
  const senderId =
    title === "Friend Request" ? detail.note?.sender : searchParams.get("senderId");
  const senderUser = chatuserlist.find((user) => user._id === senderId);

  const addFriend = async () => {
    const senderId = detail.note?.sender;
    const senderInChatUserlist = chatuserlist.find(
      (user) => user._id === senderId
    );
    console.log("friendlist", friendlist);
    console.log("request sender", senderInChatUserlist);
    console.log("chatuserlist", chatuserlist);
    const updatedFriendlist: userType[] = [...friendlist, senderInChatUserlist];
    dispatch(setFriendlist(updatedFriendlist));
  };
  const approveFR = async () => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await approveFriendRequest(detail._id, account.uid, accessToken);
  };
  const declineFR = async () => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await declineFriendRequest(detail._id, account.uid, accessToken);
  };
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
          if (title !== "Friend Request") {
            dispatch(
              setCurrentChatPartner({
                ...userdata,
                _id: senderUser?._id,
                nickName: senderUser?.nickName,
                avatar: senderUser?.avatar,
                lang: senderUser?.lang,
                sxpAddress: senderUser?.sxpAddress,
                onlineStatus: senderUser?.onlineStatus,
                notificationStatus: senderUser?.notificationStatus,
              })
            );
            dispatch(setdownState({ down: !shouldScrollDown }));
          }
        }}
      >
        <Stack
          className={classname.alert_container}
          direction={"column"}
          sx={{
            border: `2px solid ${border}`,
            backdropFilter: "blur(4px)",
            background: bg,
          }}
        >
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack direction={"row"} gap={"12px"} alignItems={"center"}>
              <Box className={classname.center_align}>
                <img src={logo} />
              </Box>

              <Stack direction={"column"} gap={"8px"}>
                <Box className={"fs-h4 white"}>{title}</Box>
                <Box className={"fs-16-regular white"}>
                  {title !== "Friend Request" &&
                    (detail.length > 100
                      ? detail.substring(0, 100) + "..."
                      : detail)}
                  {title === "Friend Request" &&
                    "Don't miss out on the fun - add to your friends now!"}
                </Box>
              </Stack>
            </Stack>
            <Box onClick={() => setOpen(false)}>
              <img src={closeIcon} />
            </Box>
          </Stack>
          {title === "Friend Request" && (
            <>
              <Stack
                display={"flex"}
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={"7px"}
                  marginLeft={"43px"}
                >
                  <Avatar
                    onlineStatus={senderUser?.onlineStatus}
                    userid={senderUser?._id}
                    size={40}
                  />
                  <Box className={"fs-18-regular white"}>
                    {senderUser?.nickName}
                  </Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                  <Button
                    className="modal_btn_right"
                    onClick={() => {
                      addFriend();
                      approveFR();
                      setOpen(false);
                    }}
                  >
                    <Box className={"fs-18-bold white"}>Add</Box>
                  </Button>
                  <Button
                    className="modal_btn_left_fr"
                    onClick={() => {
                      setOpen(false);
                      declineFR();
                    }}
                  >
                    <Box
                      className={"fs-18-bold"}
                      color={"var(--Main-Blue, #52E1F2)"}
                    >
                      Decline
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </Snackbar>
    </>
  );
};
export default AlertComp;
