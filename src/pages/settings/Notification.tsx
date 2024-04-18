import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";

import backIcon from "../../assets/settings/back-icon.svg";
import SwitchComp from "../../components/SwitchComp";
import arrowImg from "../../assets/settings/arrow-right.svg";
import { useCallback } from "react";
import { propsType, notificationType } from "../../types/settingTypes";

import { updateUsernotificationStatus } from "../../features/chat/Chat-contactApi";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";

const Notification = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data: notificationType = useSelector(selectNotification);
  const accountStore: accountType = useSelector(getAccount);

  const putUserStatus = async () => {
    try {
      await updateUsernotificationStatus(
        accountStore.uid,
        data.alert,
        accountStore.accessToken
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateNotification = useCallback(
    async (type: string) => {
      let updateData: any;
      if (type == "alert") {
        await putUserStatus();
        updateData = { ...data, alert: !data.alert };
      }
      if (type == "update") {
        updateData = { ...data, update: !data.update };
      }
      if (type == "sound") {
        updateData = { ...data, sound: !data.sound };
      }
      dispatch(setNotification(updateData));
    },
    [data]
  );
  return (
    <>
      {view === "notification" && (
        <Stack direction={"column"}>
          <Stack
            flexDirection={"row"}
            justifyContent={"flex-start"}
            gap={"10px"}
            alignItems={"center"}
            textAlign={"center"}
            sx={{ padding: "20px" }}
          >
            <Button
              className={"setting-back-button"}
              onClick={() => setView("general")}
            >
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-48_notifications")}</Box>
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
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                textAlign={"center"}
                gap={1}
                alignItems={"center"}
              >
                <SwitchComp
                  checked={data.alert}
                  onClick={() => {
                    updateNotification("alert");
                  }}
                />
              </Stack>
            </Stack>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
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
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                textAlign={"center"}
                gap={1}
                alignItems={"center"}
              >
                <SwitchComp
                  checked={data.update}
                  onClick={() => {
                    updateNotification("update");
                  }}
                  disabled={true}
                />
              </Stack>
            </Stack>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
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
              <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                textAlign={"center"}
                gap={1}
                alignItems={"center"}
              >
                <SwitchComp
                  checked={data.sound}
                  onClick={() => {
                    updateNotification("sound");
                  }}
                  disabled={true}
                />
              </Stack>
            </Stack>
            <Divider
              variant="fullWidth"
              sx={{ backgroundColor: "#FFFFFF1A" }}
            />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setView("hour");
              }}
              disabled={true}
            >
              <Stack direction={"column"} gap={"10px"}>
                <Stack
                  direction={"column"}
                  justifyContent={"flex-start"}
                  gap={"5px"}
                  textAlign={"left"}
                >
                  <Box className="fs-h5 white">
                    {t("set-43_enable-notification")}
                  </Box>
                  <Box
                    className="fs-14-regular gray"
                    sx={{
                      whiteSpace: "normal",
                    }}
                  >
                    {t("set-44_enable-notification-detail")}
                  </Box>
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  textAlign={"center"}
                >
                  <Box className="fs-h4 white">
                    {data.hour} {t("set-45_h")}
                  </Box>
                  <Box className="center-align">
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

export default Notification;
