import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";

import { selectChat } from "../../features/settings/ChatSlice";
import SwitchComp from "../../components/SwitchComp";
import {
  propsType,
  chatType,
  notificationType,
} from "../../types/settingTypes";
import { accountType } from "../../types/accountTypes";
import { updateUsernotificationStatus } from "../../features/chat/Chat-contactApi";
import { getAccount } from "../../features/account/AccountSlice";

import { useNotification } from "../../providers/NotificationProvider";
import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";
import { useCallback } from "react";

const ChatSetting = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data: chatType = useSelector(selectChat);
  const account: accountType = useSelector(getAccount);
  const notificationStore: notificationType = useSelector(selectNotification);

  const {
    setNotificationStatus,
    setNotificationTitle,
    setNotificationDetail,
    setNotificationOpen,
    setNotificationLink,
  } = useNotification();

  const putUserStatus = useCallback(async () => {
    try {
      await updateUsernotificationStatus(account.uid, notificationStore.alert);
      dispatch(
        setNotification({
          ...notificationStore,
          alert: !notificationStore.alert,
        })
      );
      console.log("putUserStatus");
    } catch (err) {
      console.error("Failed to putUserStatus: ", err);
    }
  }, [notificationStore, account]);

  return (
    <>
      {view === "chatsetting" && (
        <Stack direction={"column"}>
          <Stack
            flexDirection={"row"}
            justifyContent={"flex-start"}
            gap={"10px"}
            alignItems={"center"}
            textAlign={"center"}
            sx={{ padding: "20px" }}
          >
            <Button className={"common-btn"}>
              <Box
                className={"center-align"}
                onClick={() => setView("chatmain")}
              >
                <img src={backIcon} />
              </Box>
            </Button>
            <Box className={"fs-h3 white"}>{t("set-18_chat-settings")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              textAlign={"center"}
              padding={"20px"}
            >
              <Stack
                direction={"column"}
                justifyContent={"flex-start"}
                gap={1}
                textAlign={"left"}
              >
                <Box className={"fs-h5 white"}>
                  {t("set-19_do-not-disturb")}
                </Box>
                <Box className={"fs-14-regular light"}>
                  {t("set-20_disable-all-notifications")}
                </Box>
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                textAlign={"center"}
                gap={1}
              >
                <SwitchComp
                  checked={!notificationStore.alert}
                  onClick={() => {
                    putUserStatus();
                    setNotificationStatus("success");
                    setNotificationTitle(
                      !notificationStore.alert
                        ? t("cha-28_not-disturb-disabled")
                        : t("cha-29_not-disturb-enabled")
                    );
                    setNotificationDetail(
                      !notificationStore.alert
                        ? t("cha-30_disabled-not-disturb")
                        : t("cha-31_switched-not-disturb")
                    );
                    setNotificationOpen(true);
                    setNotificationLink(null);
                  }}
                />
              </Stack>
            </Stack>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("message");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack
                  direction={"column"}
                  justifyContent={"flex-start"}
                  textAlign={"left"}
                >
                  <Box className={"fs-h5 white"}>
                    {t("set-21_receive-messages")}
                  </Box>
                  <Box className={"fs-14-regular light"}>
                    {t("set-22_pick-who-message")}
                  </Box>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  textAlign={"center"}
                >
                  <Box className={"fs-h4 white"}>
                    {data.message == "anyone" && t("set-23_anyone")}
                    {data.message == "noone" && t("set-26_no-one")}
                    {data.message == "friend" && t("set-27_friends")}
                  </Box>
                  <Box className={"enter-align"}>
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("friend");
              }}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack
                  direction={"column"}
                  justifyContent={"flex-start"}
                  gap={"5px"}
                  textAlign={"left"}
                >
                  <Box className={"fs-h5 white"}>
                    {t("set-24_receiving-friend-request")}
                  </Box>
                  <Box className={"fs-14-regular light"}>
                    {t("set-25_pick-who-friend")}
                  </Box>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  textAlign={"center"}
                >
                  <Box className={"fs-h4 white"}>
                    {data.friend == "anyone" && t("set-23_anyone")}
                    {data.friend == "noone" && t("set-26_no-one")}
                  </Box>
                  <Box className={"center-align"}>
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ChatSetting;
