import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

import { Stack, Box, Divider, Button } from "@mui/material";

import Avatar from "../home/Avatar";
import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { updateAlertReadStatusAsync } from "../../features/alert/AlertListSlice";
import { getContactList } from "../../features/chat/ContactListSlice";
import { setCurrentPartner } from "../../features/chat/CurrentPartnerSlice";
import { IActiveUserList, getActiveUserList } from "../../features/chat/ActiveUserListSlice";
import { ISKeyList, getSKeyList } from "../../features/chat/SKeyListSlice";

import { Chatdecrypt } from "../../lib/api/ChatEncrypt";

import { propsAlertListType } from "../../types/alertTypes";
import { IContactList } from "../../types/chatTypes";
import { accountType } from "../../types/accountTypes";

import failedIcon from "../../assets/alert/failed-icon.svg";
import successIcon from "../../assets/alert/success-icon.svg";
import warnnigIcon from "../../assets/alert/warnning-icon.svg";
import alertIcon from "../../assets/alert/alert-icon.png";
import messageIcon from "../../assets/alert/message-icon.svg";
import unreaddot from "../../assets/alert/unreaddot.svg";
import readdot from "../../assets/alert/readdot.svg";

const AlertList = ({ status, title, detail, read }: propsAlertListType) => {
  const { t } = useTranslation();
  const { approveFriendRequest, declineFriendRequest } = useSocket();
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const contactListStore: IContactList = useSelector(getContactList);
  const senderUser = contactListStore.contacts.find((user) => user._id === detail.note?.sender);
  const activeUserListStore: IActiveUserList = useSelector(getActiveUserList);
  const sKeyListStore: ISKeyList = useSelector(getSKeyList);

  const [logo, setLogo] = useState<any>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>("Unable to decode message #tymt114#");

  useEffect(() => {
    if (title === "chat") {
      try {
        const sKey = sKeyListStore.sKeys.find((element) => element.roomId === detail?.note?.room_id)?.sKey;
        setDecryptedMessage(Chatdecrypt(detail?.note?.message, sKey));
      } catch (err) {
        console.error("Failed to useEffect AlertList.tsx: ", err);
      }
    }
  }, [sKeyListStore, title]);

  useEffect(() => {
    if (status == "failed") {
      setLogo(failedIcon);
    }
    if (status == "success") {
      setLogo(successIcon);
    }
    if (status == "warning") {
      setLogo(warnnigIcon);
    }
    if (status == "alert") {
      setLogo(alertIcon);
    }
    if (status == "message") {
      setLogo(messageIcon);
    }
  }, [status]);

  const handleAlertClick = useCallback(() => {
    try {
      if (title === "chat") {
        navigate(`/chat?senderId=${detail.note?.sender}`);
        dispatch(
          setCurrentPartner({
            _id: senderUser?._id,
            nickName: senderUser?.nickName,
            avatar: senderUser?.avatar,
            lang: senderUser?.lang,
            sxpAddress: senderUser?.sxpAddress,
            // onlineStatus: senderUser?.onlineStatus,
            onlineStatus: activeUserListStore.users.some((user) => user === senderUser?._id),
            notificationStatus: senderUser?.notificationStatus,
          })
        );
        dispatch(
          updateAlertReadStatusAsync({
            alertId: detail?._id,
            userId: accountStore.uid,
          })
        );
      } else if (title === "Friend Request") {
        dispatch(
          updateAlertReadStatusAsync({
            alertId: detail?._id,
            userId: accountStore.uid,
          })
        );
      }
    } catch (err) {
      console.error("Failed to click on alertList: ", err);
    }
  }, [title, detail, senderUser, accountStore]);

  return (
    <>
      <Box
        sx={{
          width: "95%",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#ffffff1a",
          },
          padding: "16px 4px 0px 4px",
        }}
        onClick={handleAlertClick}
      >
        <Stack direction={"column"}>
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
              <img src={logo} />
              <Box className={"fs-h4 white"}>
                {title === "chat" ? senderUser?.nickName ?? "Deleted Contact" : title === "Friend Request" ? t("not-9_friend-request") : title}
              </Box>
            </Stack>
            {read === "unread" && <img src={unreaddot} width={"12px"} height={"12px"} />}
            {read === "read" && <img src={readdot} width={"12px"} height={"12px"} />}
          </Stack>
          <Box className={"fs-16-regular white"} marginTop={"12px"} sx={{ textWrap: "wrap" }}>
            {title === "update" && (detail.note?.message.length > 100 ? detail.note?.message.substring(0, 100) + "..." : detail.note?.message)}
            {title === "chat" &&
              decryptedMessage !== "Unable to decode message #tymt114#" &&
              decryptedMessage.length > 100 &&
              decryptedMessage.substring(0, 100) + "..."}
            {title === "chat" && decryptedMessage !== "Unable to decode message #tymt114#" && decryptedMessage.length <= 100 && decryptedMessage}
            {title === "chat" && decryptedMessage === "Unable to decode message #tymt114#" && (
              <ThreeDots height="25px" width={"40px"} radius={5} color={`white`} />
            )}
            {title === "Friend Request" && detail.note.status === "pending" && t("not-10_fr-intro")}
            {title === "Friend Request" && detail.note.status === "accepted" && t("not-11_fr-accept")}
            {title === "Friend Request" && detail.note.status === "rejected" && t("not-12_fr-reject")}
          </Box>
          {title === "Friend Request" && detail.note.status === "pending" && (
            <>
              <Stack display={"flex"} direction={"row"} justifyContent={"space-between"} marginTop={"12px"}>
                <Stack direction={"row"} alignItems={"center"} gap={"7px"}>
                  <Avatar
                    onlineStatus={activeUserListStore.users.some((user) => user === senderUser?._id)}
                    userid={senderUser?._id}
                    size={40}
                    status={senderUser?.notificationStatus}
                  />
                  <Box className={"fs-18-regular white"}>
                    {senderUser?.nickName.length > 14 ? `${senderUser?.nickName.substring(0, 13)}...` : senderUser?.nickName}
                  </Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                  <Button
                    className="modal_btn_right"
                    onClick={() => {
                      approveFriendRequest(detail);
                    }}
                  >
                    <Box className={"fs-18-bold white"}>{t("not-5_add")}</Box>
                  </Button>
                  <Button
                    className="modal_btn_left_fr"
                    onClick={() => {
                      declineFriendRequest(detail);
                    }}
                  >
                    <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
                      {t("not-6_decline")}
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
          <Divider
            sx={{
              backgroundColor: "#FFFFFF1A",
              marginTop: "10px",
            }}
          />
        </Stack>
      </Box>
    </>
  );
};
export default AlertList;
