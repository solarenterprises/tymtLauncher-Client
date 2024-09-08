import { readText } from "@tauri-apps/api/clipboard";

import { Grid, IconButton, Tooltip, Stack, Box } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";

interface props {
  value: string;
  setValue: (_: string) => void;
}

const OtpInput = ({ value, setValue }: props) => {
  const { t } = useTranslation();
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <Grid container>
      <Grid item xs={12} container justifyContent={"flex-end"}>
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
              <Box className="fs-16-regular white">{t("cca-61_paste")}</Box>
            </Stack>
          }
          PopperProps={{
            sx: {
              [`& .MuiTooltip-tooltip`]: {
                backgroundColor: "transparent", // Set the background color to transparent
                boxShadow: "none", // Remove any shadow
              },
            },
          }}
        >
          <IconButton
            onClick={async () => {
              const code = await readText();
              setValue(code ?? "");
            }}
          >
            <ContentCopyIcon className="icon-button" />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={12} mt={"20px"} height={"50px"}>
        <MuiOtpInput
          value={value}
          onChange={handleChange}
          length={6}
          gap={"16px"}
          sx={{
            "& .MuiOtpInput-TextField": {
              borderRadius: "8px",
              border: "1px solid var(--bg-stroke-white-10-stroke-default, rgba(255, 255, 255, 0.10))",
              background: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
              backgroundBlendMode: "luminosity",
              backdropFilter: "blur(50px)",
              "&:hover": {
                border: "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
                background: "var(--bg-stroke-icon-button-bg-active-30, rgba(128, 128, 128, 0.30))",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "0px !important",
            },
            "& .MuiInputBase-input": {
              color: "white",
              fontFamily: "Cobe-Bold",
              fontSize: "20px",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default OtpInput;
