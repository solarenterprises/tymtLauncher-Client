import { useTranslation } from "react-i18next";
import { Tooltip, Stack, Box } from "@mui/material";
import mask from "../../assets/account/mask.png";
import accountIcon from "../../assets/wallet/account.svg";

export interface IPropsGroupAvatar {
  size: number;
  url: string;
  onClick?: () => void;
}

const GroupAvatar = ({ size, url, onClick }: IPropsGroupAvatar) => {
  const { t } = useTranslation();

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
            <Box className="fs-16-regular white">{t("tol-4_online")}</Box>
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
      </Tooltip>
    </>
  );
};

export default GroupAvatar;
