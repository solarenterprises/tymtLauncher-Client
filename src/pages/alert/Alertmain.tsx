import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import {
  // useDispatch,
  useSelector,
} from "react-redux";
import { useTranslation } from "react-i18next";
import unreaddot from "../../assets/alert/unreaddot.svg";
import readdot from "../../assets/alert/readdot.svg";
import AlertList from "../../components/alert/AlertList";
import { IAlertList } from "../../types/alertTypes";
import {
  getAlertList,
  // updateAllAlertReadStatusAsync,
} from "../../features/alert/AlertListSlice";
import { encryptionkeyStoreType } from "../../types/chatTypes";
import { selectEncryptionKeyStore } from "../../features/chat/Chat-encryptionkeySlice";
import { useSocket } from "../../providers/SocketProvider";

const Alertmain = () => {
  const { t } = useTranslation();
  const { askEncryptionKey } = useSocket();

  // const dispatch = useDispatch();

  const alertListStore: IAlertList = useSelector(getAlertList);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(
    selectEncryptionKeyStore
  );

  const [page, setPage] = useState<string>("unread");

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
          {t("not-1_notifications")}
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
                setPage("unread");
              }}
            >
              <Stack
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
                gap={"8px"}
              >
                <Box className={"fs-18-regular gray"}>
                  {alertListStore.unread.length}
                </Box>
                <Box className={"fs-18-regular gray"}>{t("not-2_unread")}</Box>
                <img src={unreaddot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
            <Button
              className="read-status-button"
              onClick={() => {
                setPage("read");
              }}
            >
              <Stack
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
                gap={"8px"}
              >
                <Box className={"fs-18-regular gray"}>
                  {alertListStore.read.length}
                </Box>
                <Box className={"fs-18-regular gray"}> {t("not-3_read")}</Box>
                <img src={readdot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
          </Stack>
          <Button
            className="modal_btn_left_fr"
            onClick={() => {
              // dispatch(updateAllAlertReadStatusAsync());
            }}
          >
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              {t("not-4_mark-all-as-read")}
            </Box>
          </Button>
        </Stack>
        <Box className={"alert-inbox-scrollbar"}>
          {page === "unread" &&
            [...alertListStore.unread].reverse().map((alert, index) => {
              if (alert.alertType === "chat") {
                const key =
                  encryptionKeyStore.encryption_Keys[alert?.note?.sender];
                if (!key) askEncryptionKey(alert?.note?.sender);
              }
              return (
                <AlertList
                  key={`${alert._id}-${index}`}
                  status={alert.alertType === "chat" ? "message" : "alert"}
                  title={
                    alert.alertType === "friend-request"
                      ? "Friend Request"
                      : alert.alertType === "chat"
                      ? `chat`
                      : t("not-8_update-notification")
                  }
                  detail={alert}
                  read={"unread"}
                />
              );
            })}
          {page === "read" &&
            [...alertListStore.read].reverse().map((alert, index) => {
              if (alert.alertType === "chat") {
                const key =
                  encryptionKeyStore.encryption_Keys[alert?.note?.sender];
                if (!key) askEncryptionKey(alert?.note?.sender);
              }
              return (
                <AlertList
                  key={`${alert._id}-${index}`}
                  status={alert.alertType === "chat" ? "message" : "alert"}
                  title={
                    alert.alertType === "friend-request"
                      ? "Friend Request"
                      : alert.alertType === "chat"
                      ? `chat`
                      : t("not-8_update-notification")
                  }
                  detail={alert}
                  read={"read"}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default Alertmain;
