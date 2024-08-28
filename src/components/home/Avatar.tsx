import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { tymt_avatar_url } from "../../configs";

import { Tooltip, Stack, Box } from "@mui/material";

import { ICurrentChatroomMember } from "../../features/chat/CurrentChatroomMembersSlice";
import { getRenderTime, IRenderTime } from "../../features/account/RenderTimeSlice";
import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";

import UserAPI from "../../lib/api/UserAPI";

import { getSupportChainByName } from "../../lib/helper/WalletHelper";

import onlineframe from "../../assets/chat/onlineframe.svg";
import offlineframe from "../../assets/chat/offlineframe.svg";
import donotdisturbframe from "../../assets/chat/donotdisturbframe.svg";
import mask from "../../assets/account/mask.png";
import accountIcon from "../../assets/wallet/account.svg";

import { ICurrentChain, ISupportChain } from "../../types/walletTypes";

const Avatar = ({ size, url, userid, onlineStatus, ischain, status }: any) => {
  const { t } = useTranslation();

  const renderTimeStore: IRenderTime = useSelector(getRenderTime);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);

  const currentSupportChain: ISupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);

  const [user, setUser] = useState<ICurrentChatroomMember>();

  useEffect(() => {
    if (userid) {
      const init = async () => {
        const res = await UserAPI.getUserById(userid);
        if (!res?.data?.result?.data) {
          return;
        }
        setUser(res?.data?.result?.data);
      };
      init();
    }
  }, [userid]);

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
              src={status === "donotdisturb" ? donotdisturbframe : onlineframe}
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
              src={currentSupportChain?.chain?.logo}
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
          <Box
            component={"img"}
            src={
              userid
                ? `${tymt_avatar_url}/public/upload/avatars/${user?.avatar ? user?.avatar : "default.png"}?${renderTimeStore.renderTime}`
                : `${tymt_avatar_url}/public/upload/avatars/${url ? url : "default.png"}?${renderTimeStore.renderTime}`
            }
            sx={{
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
              transition: "all 0.5s",
            }}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = accountIcon;
            }}
          />
        </div>
      </Tooltip>
    </>
  );
};

export default Avatar;
