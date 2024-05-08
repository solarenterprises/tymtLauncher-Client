import { Stack, Box } from "@mui/material";

const OrLinechat = ({ timeline }: any) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        height: "18px",
        padding: "0px 5px 0px 5px",
      }}
      marginBottom={"10px"}
    >
      <Box
        sx={{
          width: "40%",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
      <Box
        className={"fs-14-regular"}
        sx={{
          width: "20%",
          textAlign: "center",
          color: "#AFAFAF",
          fontFeatureSettings: "'calt' off",
        }}
      >
        {timeline}
      </Box>
      <Box
        sx={{
          width: "40%",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
    </Stack>
  );
};

export default OrLinechat;
