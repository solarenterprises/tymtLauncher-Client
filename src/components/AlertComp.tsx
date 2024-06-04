import { Snackbar, Stack, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Slide from "@mui/material/Slide";
import CommonStyles from "../styles/commonStyles";
import failedIcon from "../assets/alert/failed-icon.svg";
import successIcon from "../assets/alert/success-icon.svg";
import warnnigIcon from "../assets/alert/warnning-icon.svg";
import alertIcon from "../assets/alert/alert-icon.png";
import messageIcon from "../assets/alert/message-icon.svg";
import closeIcon from "../assets/settings/x-icon.svg";
// import Avatar from "./home/Avatar";
import { propsAlertTypes } from "../types/commonTypes";
import { notification_duration } from "../configs";
import { IContactList } from "../types/chatTypes";
// import { accountType } from "../types/accountTypes";
// import {
//   addOneToFriendList,
//   getFriendlist,
// } from "../features/chat/FriendListSlice";
// import { getAccount } from "../features/account/AccountSlice";
import { selectEncryptionKeyByUserId } from "../features/chat/Chat-encryptionkeySlice";
import { decrypt } from "../lib/api/Encrypt";
import {
  // getCurrentPartner,
  setCurrentPartner,
} from "../features/chat/CurrentPartnerSlice";
import { getContactList } from "../features/chat/ContactListSlice";
// import {
//   approveFriendRequest,
//   declineFriendRequest,
// } from "../features/alert/AlertListApi";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const AlertComp = ({ open, status, title, detail, setOpen, link }: propsAlertTypes) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classname = CommonStyles();
  const searchParams = new URLSearchParams(link?.split("?")[1]);

  const contactListStore: IContactList = useSelector(getContactList);

  const senderId = title === "Friend Request" ? detail.note?.sender : searchParams.get("senderId");
  const senderUser = contactListStore.contacts.find((user) => user._id === senderId);

  const dispatch = useDispatch();
  // const currentPartnerStore: IContact = useSelector(getCurrentPartner);
  // const friendListStore: IContactList = useSelector(getFriendlist);
  // const accountStore: accountType = useSelector(getAccount);
  const existkey: string = useSelector((state) => selectEncryptionKeyByUserId(state, senderId));

  const [border, setBorder] = useState("");
  const [bg, setBg] = useState("");
  const [logo, setLogo] = useState<any>();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const decryptmessage = async () => {
      const decryptedmessage: string = existkey ? await decrypt(detail, existkey) : t("not-13_cannot-decrypt");
      setMessage(decryptedmessage);
    };
    decryptmessage();
  }, [detail]);

  // const addFriend = useCallback(async () => {
  //   const senderId = detail.note?.sender;
  //   const senderInFriendList = friendListStore.contacts.find(
  //     (user) => user._id === senderId
  //   );
  //   if (senderInFriendList) return;
  //   const senderInContactList = contactListStore.contacts.find(
  //     (user) => user._id === senderId
  //   );
  //   if (!senderInContactList) return;
  //   dispatch(addOneToFriendList(senderInContactList));
  // }, [friendListStore, contactListStore]);

  // const approveFR = useCallback(async () => {
  //   await approveFriendRequest(detail._id, accountStore.uid);
  // }, [];

  // const declineFR = async () => {
  //   await declineFriendRequest(detail._id, accountStore.uid);
  // }, [accountStore]);

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
              setCurrentPartner({
                _id: senderUser?._id,
                nickName: senderUser?.nickName,
                avatar: senderUser?.avatar,
                lang: senderUser?.lang,
                sxpAddress: senderUser?.sxpAddress,
                onlineStatus: senderUser?.onlineStatus,
                notificationStatus: senderUser?.notificationStatus,
              })
            );
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
                  {status === "message" && (message.length > 100 ? message.substring(0, 100) + "..." : message)}
                  {status === "alert" && title === "Friend Request" && t("not-10_fr-intro")}
                  {!(status === "message" || (status === "alert" && title === "Friend Request")) &&
                    (detail.length > 100 ? detail.substring(0, 100) + "..." : detail)}
                </Box>
              </Stack>
            </Stack>
            <Box onClick={() => setOpen(false)}>
              <img src={closeIcon} />
            </Box>
          </Stack>
          {/* {title === "Friend Request" && (
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
                    status={senderUser?.notificationStatus}
                  />
                  <Box className={"fs-18-regular white"}>
                    {senderUser?.nickName.length > 14
                      ? `${senderUser?.nickName.substring(0, 13)}...`
                      : senderUser?.nickName}
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
                    <Box className={"fs-18-bold white"}>{t("not-5_add")}</Box>
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
                      {t("not-6_decline")}
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </>
          )} */}
        </Stack>
      </Snackbar>
    </>
  );
};
export default AlertComp;
