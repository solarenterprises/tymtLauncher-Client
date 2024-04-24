import { Box, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import unreaddot from "../../assets/alert/unreaddot.svg";
import readdot from "../../assets/alert/readdot.svg";
import AlertList from "../../components/alert/Alertlist";

import { accountType, nonCustodialType } from "../../types/accountTypes";

// import { featchCountUnreadAlert } from "../../features/chat/Chat-alertApi";
import { getAccount } from "../../features/account/AccountSlice";
import {
  fetchReadAlerts,
  fetchUnreadAlerts,
  updateAlertReadstatus,
} from "../../features/chat/Chat-alertApi";
import { alertType } from "../../types/chatTypes";
import { notificationType } from "../../types/settingTypes";
import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";
import { getaccessToken } from "../../features/chat/Chat-contactApi";
import { multiWalletType } from "../../types/walletTypes";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";

const Alertmain = () => {
  const dispatch = useDispatch();
  const account: accountType = useSelector(getAccount);
  const [unreadcount, setUnreadCount] = useState<number>(0);
  const [readcount, setReadCount] = useState<number>(0);
  const [unreadalerts, setUnreadAlerts] = useState<alertType[]>([]);
  const [readalerts, setReadAlerts] = useState<alertType[]>([]);
  const [read, setRead] = useState<string>("unread");
  const notification: notificationType = useSelector(selectNotification);
  const getUnreadAlerts = async () => {
    const unreadalerts: alertType[] = await fetchUnreadAlerts(account.uid);
    setUnreadCount(unreadalerts.length);
    setUnreadAlerts(unreadalerts);
  };
  const getReadAlerts = async () => {
    const readalerts: alertType[] = await fetchReadAlerts(account.uid);
    setReadCount(readalerts.length);
    setReadAlerts(readalerts);
  };
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);

  const updateAlert = async () => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );

    for (const alert of unreadalerts) {
      await updateAlertReadstatus(alert._id, account.uid, accessToken);
    }

    getUnreadAlerts();
    getReadAlerts();

    console.log("accesstoken", accessToken);
    console.log("userid", account.uid);
  };

  useEffect(() => {
    getUnreadAlerts();
    getReadAlerts();
  }, [notification.trigger, read]);

  return (
    <Box className={"alertmain-container"}>
      <Box
        sx={{
          width: "100%",
          paddingRight: "8px",
          position: "relative",
        }}
      >
        <Box className={"fs-24-bold white"} marginTop={"0px"}>
          Notifications
        </Box>
        <Stack
          marginTop={"24px"}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
            <Button
              className="read-status-button"
              onClick={() => {
                setRead("unread");
              }}
            >
              <Stack
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
                gap={"8px"}
              >
                <Box className={"fs-18-regular gray"}>{unreadcount}</Box>
                <Box className={"fs-18-regular gray"}>Unread</Box>
                <img src={unreaddot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
            <Button
              className="read-status-button"
              onClick={() => {
                setRead("read");
              }}
            >
              <Stack
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
                gap={"8px"}
              >
                <Box className={"fs-18-regular gray"}>{readcount}</Box>
                <Box className={"fs-18-regular gray"}>Read</Box>
                <img src={readdot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
          </Stack>
          <Button
            className="modal_btn_left_fr"
            onClick={() => {
              updateAlert();
              dispatch(
                setNotification({
                  ...notification,
                  trigger: !notification.trigger,
                })
              );
            }}
          >
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              Mark all as read
            </Box>
          </Button>
        </Stack>
        <Box className={"alert-inbox-scrollbar"}>
          {read === "unread" &&
            unreadalerts
              .reverse()
              .map((alert, index) => (
                <AlertList
                  key={index}
                  status={alert.alertType === "chat" ? "message" : "alert"}
                  title={
                    alert.alertType === "friend-request"
                      ? "Friend Request"
                      : alert.alertType === "chat"
                      ? `${alert.note?.sender}`
                      : "Update"
                  }
                  detail={
                    alert.alertType === "friend-request"
                      ? alert
                      : `${alert.note?.detail}`
                  }
                  read={"unread"}
                />
              ))}
          {read === "read" &&
            readalerts
              .reverse()
              .map((alert, index) => (
                <AlertList
                  key={index}
                  status={alert.alertType === "chat" ? "message" : "alert"}
                  title={
                    alert.alertType === "friend-request"
                      ? "Friend Request"
                      : alert.alertType === "chat"
                      ? `${alert.note?.sender}`
                      : "Update"
                  }
                  detail={
                    alert.alertType === "friend-request"
                      ? alert
                      : `${alert.note?.detail}`
                  }
                  read={"read"}
                />
              ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Alertmain;
