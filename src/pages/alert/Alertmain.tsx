import { Box, Button, Stack } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import unreaddot from "../../assets/alert/unreaddot.svg";
import readdot from "../../assets/alert/readdot.svg";
import AlertList from "../../components/alert/AlertList";
import { IAlertList, IFetchAlertListParam } from "../../types/alertTypes";
import {
  fetchAlertListAsync,
  fetchReadAlertListAsync,
  fetchUnreadAlertListAsync,
  getAlertList,
  updateAllAlertReadStatusAsync,
} from "../../features/alert/AlertListSlice";
import { encryptionkeyStoreType } from "../../types/chatTypes";
import { selectEncryptionKeyStore } from "../../features/chat/Chat-encryptionkeySlice";
import { useSocket } from "../../providers/SocketProvider";
import { AppDispatch } from "../../store";
import InfiniteScroll from "react-infinite-scroll-component";
import { accountType } from "../../types/accountTypes";
import { getAccount } from "../../features/account/AccountSlice";

const Alertmain = () => {
  const { t } = useTranslation();
  const { askEncryptionKey } = useSocket();

  const dispatch = useDispatch<AppDispatch>();

  const alertListStore: IAlertList = useSelector(getAlertList);
  const encryptionKeyStore: encryptionkeyStoreType = useSelector(selectEncryptionKeyStore);
  const accountStore: accountType = useSelector(getAccount);

  const [alertStatus, setAlertStatus] = useState<string>("unread");
  const [page, setPage] = useState<number>(1);
  // const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreAlert = useCallback(() => {
    try {
      // if (!hasMore) {
      //   console.log("No more alerts");
      //   return;
      // }
      if (alertStatus === "read") {
        const param: IFetchAlertListParam = {
          userId: accountStore.uid,
          page: page + 1,
          limit: 20,
        };
        setPage((prev) => prev + 1);
        // const previousReadLength = [...alertListStore.read].length;
        dispatch(fetchReadAlertListAsync(param)).then(() => {
          // if (alertListStore.read.length === previousReadLength) {
          //   setHasMore(false);
          // }
        });
      } else {
        const param: IFetchAlertListParam = {
          userId: accountStore.uid,
          page: page + 1,
          limit: 20,
        };
        setPage((prev) => prev + 1);
        // const previousUnreadLength = [...alertListStore.unread].length;
        dispatch(fetchUnreadAlertListAsync(param)).then(() => {
          // if (alertListStore.unread.length === previousUnreadLength) {
          //   setHasMore(false);
          // }
        });
      }
      console.log("fetchMoreAlert: ", `page: ${page + 1}`, `hasMore: true`);
    } catch (err) {
      console.error("Failed to fetchMoreAlert: ", err);
    }
  }, [page, alertStatus, accountStore, alertListStore]);

  useEffect(() => {
    setPage(1);
    // setHasMore(true);
    dispatch(fetchAlertListAsync(accountStore.uid));
  }, [alertStatus, accountStore]);

  const handleMarkAllAsReadClick = () => {
    dispatch(updateAllAlertReadStatusAsync()).then(() => {
      setPage(1);
      // setHasMore(true);
      dispatch(fetchAlertListAsync(accountStore.uid));
    });
  };

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
        <Stack marginTop={"24px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
          <Stack direction={"row"} alignItems={"center"} gap={"5px"}>
            <Button
              className="read-status-button"
              onClick={() => {
                setAlertStatus("unread");
              }}
            >
              <Stack display={"flex"} direction={"row"} alignItems={"center"} gap={"8px"}>
                <Box className={"fs-14-regular gray"}>{alertListStore.unreadCount}</Box>
                <Box className={"fs-14-regular gray"}>{t("not-2_unread")}</Box>
                <img src={unreaddot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
            <Button
              className="read-status-button"
              onClick={() => {
                setAlertStatus("read");
              }}
            >
              <Stack display={"flex"} direction={"row"} alignItems={"center"} gap={"8px"}>
                <Box className={"fs-14-regular gray"}>{alertListStore.readCount}</Box>
                <Box className={"fs-14-regular gray"}> {t("not-3_read")}</Box>
                <img src={readdot} width={"8px"} height={"8px"} />
              </Stack>
            </Button>
          </Stack>
          <Button className="modal_btn_left_fr" onClick={handleMarkAllAsReadClick}>
            <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
              {t("not-4_mark-all-as-read")}
            </Box>
          </Button>
        </Stack>
        <Box
          className={"alert-inbox-scrollbar"}
          sx={{
            overflowX: "auto",
          }}
        >
          <InfiniteScroll
            style={{
              minHeight: "100%",
            }}
            dataLength={alertStatus === "unread" ? alertListStore.unread.length : alertListStore.read.length} //This is important field to render the next data
            next={fetchMoreAlert}
            hasMore={true}
            loader={<Box className={"fs-14-regular white t-center"}>{t("cha-32_loading")}</Box>}
            refreshFunction={fetchMoreAlert}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8595; {t("cha-34_pull-down")}</Box>}
            releaseToRefreshContent={<Box className={"fs-14-regular white t-center"}>&#8593; {t("cha-35_release-to-refresh")}</Box>}
          >
            {alertStatus === "unread" &&
              [...alertListStore.unread].reverse().map((alert, index) => {
                if (alert.alertType === "chat") {
                  const key = encryptionKeyStore.encryption_Keys[alert?.note?.sender];
                  if (!key) askEncryptionKey(alert?.note?.sender);
                }
                return (
                  <AlertList
                    key={`${alert._id}-${index}`}
                    status={alert.alertType === "chat" ? "message" : "alert"}
                    title={alert.alertType === "friend-request" ? "Friend Request" : alert.alertType === "chat" ? `chat` : t("not-8_update-notification")}
                    detail={alert}
                    read={"unread"}
                  />
                );
              })}
            {alertStatus === "read" &&
              [...alertListStore.read].reverse().map((alert, index) => {
                if (alert.alertType === "chat") {
                  const key = encryptionKeyStore.encryption_Keys[alert?.note?.sender];
                  if (!key) askEncryptionKey(alert?.note?.sender);
                }
                return (
                  <AlertList
                    key={`${alert._id}-${index}`}
                    status={alert.alertType === "chat" ? "message" : "alert"}
                    title={alert.alertType === "friend-request" ? "Friend Request" : alert.alertType === "chat" ? `chat` : t("not-8_update-notification")}
                    detail={alert}
                    read={"read"}
                  />
                );
              })}
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  );
};

export default Alertmain;
