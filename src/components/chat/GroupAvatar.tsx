import { Box } from "@mui/material";

import { useSelector } from "react-redux";

import { getRenderTime, IRenderTime } from "../../features/account/RenderTimeSlice";

import mask from "../../assets/account/mask.png";
import accountIcon from "../../assets/wallet/account.svg";

import { tymt_avatar_url } from "../../configs";

export interface IPropsGroupAvatar {
  size: number;
  url: string;
}

const GroupAvatar = ({ size, url }: IPropsGroupAvatar) => {
  const renderTimeStore: IRenderTime = useSelector(getRenderTime);

  return (
    <>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          display: "inline-block",
          border: "transparent",
        }}
      >
        <Box
          component={"img"}
          key={`${url}-${new Date().getTime()}`}
          src={`${tymt_avatar_url}/public/upload/room-image/${url ? url : "default.png"}?${renderTimeStore.renderTime}`}
          loading="lazy"
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
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = accountIcon;
          }}
        />
      </div>
    </>
  );
};

export default GroupAvatar;
