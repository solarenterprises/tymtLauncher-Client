import { Box, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import unreaddot from "../../assets/alert/unreaddot.svg";
import AlertList from "../../components/alert/Alertlist";

import { accountType, nonCustodialType } from "../../types/accountTypes";

// import { featchCountUnreadAlert } from "../../features/chat/Chat-alertApi";
import { getAccount } from "../../features/account/AccountSlice";
import {
  fetchCountUnreadAlerts,
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
  const [unreadalerts, setUnreadAlerts] = useState<alertType[]>([]);
  const notification: notificationType = useSelector(selectNotification);
  const getUnreadAlerts = async () => {
    const unreadcount: number = await fetchCountUnreadAlerts(account.uid);
    const unreadalerts: alertType[] = await fetchUnreadAlerts(account.uid);
    setUnreadCount(unreadcount);
    setUnreadAlerts(unreadalerts);
  };
  const multiwallet: multiWalletType = useSelector(getMultiWallet);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);

  const updateAlert = async () => {
    const accessToken: string = await getaccessToken(
      multiwallet.Solar.chain.wallet,
      nonCustodial.password
    );
    await updateAlertReadstatus(account.uid, accessToken);
    console.log("accesstoken", accessToken);
    console.log("userid", account.uid);
  };

  useEffect(() => {
    getUnreadAlerts();
  }, [notification.update]);

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
          <Button
            className="modal_btn_left_fr"
            onClick={() => {
              updateAlert();
              dispatch(
                setNotification({
                  ...notification,
                  update: !notification.update,
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
          {unreadalerts.reverse().map((alert, index) => (
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
                  ? "Don't miss out on the fun - add to your friends now!"
                  : `${alert.note.detail}`
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Alertmain;
