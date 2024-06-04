import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import backIcon from "../../assets/settings/back-icon.svg";
import checkImg from "../../assets/settings/check-icon.svg";
import { selectNotification, setNotification } from "../../features/settings/NotificationSlice";
import { propsType, notificationType } from "../../types/settingTypes";

const hours = [1, 2, 3, 6, 12];

const Hour = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data: notificationType = useSelector(selectNotification);
  const setHour = useCallback(
    (hour: Number) => {
      let updateData = { ...data, hour: hour };
      dispatch(setNotification(updateData));
    },
    [data]
  );
  return (
    <>
      {view === "hour" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("notification")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-49_silent-mode")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />\
          <Stack direction={"column"} justifyContent={""}>
            {hours.map((item) => (
              <>
                <Button
                  className="common-btn"
                  sx={{ padding: "20px" }}
                  onClick={() => {
                    setHour(item);
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                    <Box className="fs-h4 white">
                      {t("set-46_for")} {item} {t("set-47_hours")}
                    </Box>
                    <Box className="center-align">{data.hour == item && <img src={checkImg} />}</Box>
                  </Stack>
                </Button>
                <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              </>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Hour;
