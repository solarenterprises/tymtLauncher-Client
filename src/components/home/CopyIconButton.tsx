import { useTranslation } from "react-i18next";
import { Tooltip, Stack, Box, IconButton } from "@mui/material";
import CopyIcon from "../../assets/main/Copy.svg";
import CopyHoverIcon from "../../assets/main/CopyHover.svg";

export interface IPropsCopyIconButton {
  onClick: () => void;
}

const CopyIconButton = ({ onClick }: IPropsCopyIconButton) => {
  const { t } = useTranslation();

  return (
    <Tooltip
      placement="top"
      title={
        <Stack
          spacing={"10px"}
          sx={{
            marginBottom: "-20px",
            backgroundColor: "rgb(49, 53, 53)",
            padding: "6px 8px",
            borderRadius: "32px",
            border: "1px solid rgb(71, 76, 76)",
          }}
        >
          <Box className="fs-16-regular white">{t("ncca-57_copy")}</Box>
        </Stack>
      }
      PopperProps={{
        sx: {
          [`& .MuiTooltip-tooltip`]: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <IconButton
        className={"icon-button"}
        onClick={onClick}
        sx={{
          width: "40px",
          height: "40px",
          alignSelf: "center",
          position: "relative",
          "&:hover img": {
            content: "url(" + CopyHoverIcon + ")",
          },
        }}
      >
        <Box
          component={"img"}
          src={CopyIcon}
          sx={{
            width: "100%",
            height: "100%",
            transition: "all 0.3s ease",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyIconButton;
