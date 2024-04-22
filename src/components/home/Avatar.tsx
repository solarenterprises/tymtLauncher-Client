import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { Tooltip, Stack, Box } from "@mui/material";

import onlineframe from "../../assets/chat/onlineframe.svg";
import offlineframe from "../../assets/chat/offlineframe.svg";
import donotdisturbframe from "../../assets/chat/donotdisturbframe.svg";
import mask from "../../assets/account/mask.png";

import { IChain } from "../../types/walletTypes";
import { chatType, notificationType } from "../../types/settingTypes";
import { getChain } from "../../features/wallet/ChainSlice";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { selectChat } from "../../features/settings/ChatSlice";

const Avatar = ({ size, userid, onlineStatus, ischain, status }: any) => {
  const { t } = useTranslation();
  const chain: IChain = useSelector(getChain);
  const [notificationstatus, setNotificationStatus] = useState("");
  const notificationStore: notificationType = useSelector(selectNotification);
  const data: chatType = useSelector(selectChat);
  const getNotificationStatus = () => {
    setNotificationStatus(status);
  };

  useEffect(() => {
    getNotificationStatus();
  }, [userid, notificationStore.alert, data.disturb]);

  return (
    <>
      <Tooltip
        placement="bottom-start"
        title={
          <Stack
            spacing={"10px"}
            sx={{
              left: "10px",
              backgroundColor: "rgb(49, 53, 53)",
              padding: "6px 8px",
              borderRadius: "32px",
              border: "1px solid rgb(71, 76, 76)",
            }}
          >
            <Box className="fs-16-regular white">
              {onlineStatus && status === "online"
                ? t("tol-4_online")
                : onlineStatus && status === "donotdisturb"
                ? t("tol-6_donotdisturb")
                : onlineStatus && status === undefined
                ? t("tol-4_online")
                : t("tol-5_offline")}
            </Box>
          </Stack>
        }
        PopperProps={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
          sx: {
            [`& .MuiTooltip-tooltip`]: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: "relative",
            display: "inline-block",
            border: "transparent",
          }}
        >
          {onlineStatus === false && (
            <img
              src={offlineframe}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                overflow: "hidden",
              }}
            />
          )}
          {onlineStatus === true && (
            <img
              src={
                notificationstatus === "donotdisturb"
                  ? donotdisturbframe
                  : onlineframe
              }
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                overflow: "hidden",
              }}
            />
          )}
          {ischain && (
            <img
              src={chain.chain.logo}
              style={{
                position: "absolute",
                width: "18px",
                top: "75%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                zIndex: 7,
              }}
            />
          )}

          <img
            src={`https://dev.tymt.com/api/users/get-avatar/${userid}?${new Date().toISOString()}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              borderColor: "transparent",
              maskImage: `url(${mask})`,
              maskPosition: "center",
              maskSize: "cover",
              zIndex: 1,
              opacity: 0.9,
            }}
            loading="lazy"
          />
        </div>
      </Tooltip>
    </>
  );
};

export default Avatar;
