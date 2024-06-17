import { Stack, Box } from "@mui/material";

interface props {
  icon: string;
  text: string;
  line?: number;
  secondaryText?: string;
}

const AccountIconBar = ({ icon, text, line, secondaryText }: props) => {
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"16px"}>
      <Box component={"img"} src={icon} />
      <Stack>
        <Box className={"fs-18-regular white"}>{text}</Box>
        {line === 2 && <Box className={"fs-16-regular white"}>{secondaryText}</Box>}
      </Stack>
    </Stack>
  );
};

export default AccountIconBar;
