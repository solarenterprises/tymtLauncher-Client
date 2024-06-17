import { Button, Stack, Box } from "@mui/material";

import chevronRight from "../../assets/account/chevron-right.png";

interface props {
  src: string;
  text: string;
  onClick: () => void;
}

const AccountButton = ({ src, text, onClick }: props) => {
  return (
    <Button fullWidth className="account-button" onClick={onClick}>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"448px"}>
        <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
          <Box
            component={"img"}
            src={src}
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
          <Box
            className="fs-18-bold white"
            sx={{
              textTransform: "none",
            }}
          >
            {text}
          </Box>
        </Stack>

        <Box component={"img"} src={chevronRight} />
      </Stack>
    </Button>
  );
};

export default AccountButton;
