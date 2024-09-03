import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import SwitchComp from "../../components/SwitchComp";

import { AppDispatch } from "../../store";
import { selectNotification, setNotification } from "../../features/settings/NotificationSlice";

import { updateUsernotificationStatus } from "../../features/chat/ContactListApi";

import { propsType, notificationType } from "../../types/settingTypes";

import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";
import { IMyInfo } from "../../types/chatTypes";
import { getMyInfo } from "../../features/account/MyInfoSlice";

const Notification = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const notificationStore: notificationType = useSelector(selectNotification);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const putUserStatus = useCallback(async () => {
    try {
      await updateUsernotificationStatus(myInfoStore?._id, notificationStore.alert);
    } catch (err) {
      console.log(err);
    }
  }, [myInfoStore, notificationStore]);

  const updateNotification = useCallback(
    async (type: string) => {
      let updateData: any;
      if (type == "alert") {
        await putUserStatus();
        updateData = { ...notificationStore, alert: !notificationStore.alert };
      }
      if (type == "update") {
        updateData = {
          ...notificationStore,
          update: !notificationStore.update,
        };
      }
      if (type == "sound") {
        updateData = { ...notificationStore, sound: !notificationStore.sound };
      }
      dispatch(setNotification(updateData));
    },
    [notificationStore]
  );
  return (
    <>
      {view === "notification" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-48_notifications")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-37_alerts")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-38_alert-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationStore.alert}
                  onClick={() => {
                    updateNotification("alert");
                  }}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-39_updates")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-40_update-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationStore.update}
                  onClick={() => {
                    updateNotification("update");
                  }}
                  disabled={true}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"20px"}>
              <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                <Box className="fs-h5 white">{t("set-41_sound")}</Box>
                <Box
                  className="fs-14-regular gray"
                  sx={{
                    whiteSpace: "normal",
                  }}
                >
                  {t("set-42_sound-detail")}
                </Box>
              </Stack>
              <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1} alignItems={"center"}>
                <SwitchComp
                  checked={notificationStore.sound}
                  onClick={() => {
                    updateNotification("sound");
                  }}
                  disabled={true}
                />
              </Stack>
            </Stack>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("hour");
              }}
              disabled={true}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack direction={"column"} justifyContent={"flex-start"} gap={"5px"} textAlign={"left"}>
                  <Box className="fs-h5 white">{t("set-43_enable-notification")}</Box>
                  <Box
                    className="fs-14-regular gray"
                    sx={{
                      whiteSpace: "normal",
                    }}
                  >
                    {t("set-44_enable-notification-detail")}
                  </Box>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white">
                    {notificationStore.hour} {t("set-45_h")}
                  </Box>
                  <Box className="center-align">
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Notification;
