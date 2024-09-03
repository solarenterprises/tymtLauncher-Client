import { Box, Stack, Button, CircularProgress } from "@mui/material";

import RightArrow from "../../assets/chevronright.svg";

export interface IPropsSignModeButton {
  icon: string;
  text: string;
  loading?: boolean;
  onClick: () => void;
}

const SignModeButton = ({ icon, text, loading, onClick }: IPropsSignModeButton) => {
  return (
    <Button
      disabled={loading}
      onClick={onClick}
      sx={{
        textTransform: "none",
        width: "100%",
        border: "1px solid #52E1F233",
        padding: "12px 16px",
        borderRadius: "50ch",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "var(--bg-stroke-white-10-stroke-default, #FFFFFF1A)",
          border: "1px solid #ffffff33",
        },
      }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
        <Stack direction="row" alignItems="center" gap="16px">
          <Box component={"img"} src={icon} />
          <Box className={"fs-18-regular white"}>{text}</Box>
        </Stack>
        {loading ? (
          <CircularProgress
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
        ) : (
          <Box component={"img"} src={RightArrow} width={"24px"} height={"24px"} />
        )}
      </Stack>
    </Button>
  );
};

export default SignModeButton;
