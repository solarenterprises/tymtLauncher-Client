import { Button, Stack, Box } from "@mui/material";

import chevronRight from "../../assets/account/chevron-right.png";

interface props {
  src: string;
  text: string;
  onClick: () => void;
}

const PaymentButton = ({ src, text, onClick }: props) => {
  return (
    <Button fullWidth className="account-button" onClick={onClick}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
        padding={"8px 16px"}
      >
        <Stack direction={"row"} spacing={"16px"} alignItems={"center"}>
          <Box
            component={"img"}
            src={src}
            sx={{
              width: "32px",
              height: "32px"
            }}
          />
          <Box
            className="fs-18-bold white"
            sx={{
              textTransform: "none"
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

export default PaymentButton;
