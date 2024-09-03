import { Stack, Box } from "@mui/material";

const OrLine = (day: string) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        height: "18px",
      }}
    >
      <Box
        sx={{
          width: "200px",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
      <Box
        className={"fs-14-regular"}
        sx={{
          width: "80px",
          textAlign: "center",
          color: "#AFAFAF",
          fontFeatureSettings: "'calt' off",
        }}
      >
        {day}
      </Box>
      <Box
        sx={{
          width: "200px",
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
    </Stack>
  );
};

export default OrLine;
