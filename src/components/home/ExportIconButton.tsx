import { useTranslation } from "react-i18next";
import { Tooltip, Stack, Box, IconButton } from "@mui/material";
// import ExportIcon from "../../assets/main/export.png";
import ExportIcon from "../../assets/main/Export.svg";
import ExportHoverIcon from "../../assets/main/ExportHover.svg";

export interface IPropsExportIconButton {
  onClick: () => void;
}

const ExportIconButton = ({ onClick }: IPropsExportIconButton) => {
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
          <Box className="fs-16-regular white">{t("cha-60_export")}</Box>
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
            content: "url(" + ExportHoverIcon + ")",
          },
        }}
      >
        <Box
          component={"img"}
          src={ExportIcon}
          sx={{
            width: "100%",
            height: "100%",
            transition: "0.3s",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default ExportIconButton;
