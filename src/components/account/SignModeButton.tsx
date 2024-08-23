import { Box, Stack } from "@mui/material";

import RightArrow from "../../assets/chevronright.svg";

export interface IPropsSignModeButton {
  icon: string;
  text: string;
}

const SignModeButton = ({ icon, text }: IPropsSignModeButton) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "1px solid #52E1F233",
        padding: "12px 16px",
        borderRadius: "50ch",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "var(--bg-stroke-white-10-stroke-default, #FFFFFF1A)",
        },
      }}
    >
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Stack direction="row" alignItems="center" gap="16px">
          <Box component={"img"} src={icon} />
          <Box className={"fs-18-regular white"}>{text}</Box>
        </Stack>
        <Box component={"img"} src={RightArrow} width={"24px"} height={"24px"} />
      </Stack>
    </Box>
  );
};

export default SignModeButton;
