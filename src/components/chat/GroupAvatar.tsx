import { Box } from "@mui/material";
import mask from "../../assets/account/mask.png";
import accountIcon from "../../assets/wallet/account.svg";
import { tymt_backend_url } from "../../configs";

export interface IPropsGroupAvatar {
  size: number;
  url: string;
}

const GroupAvatar = ({ size, url }: IPropsGroupAvatar) => {
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
          key={`${new Date().getTime()}`}
          src={`${tymt_backend_url}/chatroom/get-room-image/${url}?${Date.now()}`}
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
          loading="lazy"
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
