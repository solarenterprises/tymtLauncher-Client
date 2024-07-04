import { Box } from "@mui/material";
import mask from "../../assets/account/mask.png";
import accountIcon from "../../assets/wallet/account.svg";

export interface IPropsGroupAvatar {
  size: number;
  url: string;
  onClick?: () => void;
}

const GroupAvatar = ({ size, url, onClick }: IPropsGroupAvatar) => {
  return (
    <>
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
          display: "inline-block",
          border: "transparent",
          cursor: onClick ? "pointer" : "default",
        }}
      >
        <Box
          component={"img"}
          key={`${new Date().getTime()}`}
          src={`${url}?${Date.now()}`}
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
          onClick={() => {
            if (onClick) onClick();
          }}
        />
      </div>
    </>
  );
};

export default GroupAvatar;
