import { Stack, Box } from "@mui/material";

interface props {
  icon: string;
  chain: string;
  address: string;
}

const WalletBar = ({ icon, chain, address }: props) => {
  return (
    <Stack className={"wallet-bar"} direction={"row"} spacing={"8px"}>
      <Stack direction={"row"} spacing={"8px"} alignItems={"center"}>
        <Box component={"img"} src={icon} width={"24px"} height={"24px"} />
        <Box
          className={"fs-18-regular"}
          sx={{
            color: "white",
            leadingTrim: "both",
            textEdge: "cap",
            fontFeatureSettings: "'calt' off",
          }}
        >
          {chain}
        </Box>
      </Stack>
      <Stack className="center-align">
        <Box
          className={"fs-12-light"}
          sx={{
            color: "#52E1F2",
            leadingTrim: "both",
            textEdge: "cap",
            fontFeatureSettings: "'calt' off",
          }}
        >
          {address}
        </Box>
      </Stack>
    </Stack>
  );
};

export default WalletBar;
