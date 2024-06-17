import { Stack, Box } from "@mui/material";

const OrLinechat = ({ timeline }: any) => {
  const centralBoxWidth = `${timeline.length * 12}px`; // Adjust the multiplier as needed

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
          width: `calc((100% - ${centralBoxWidth})/2)`,
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
      <Box
        className={"fs-14-regular"}
        sx={{
          width: centralBoxWidth,
          textAlign: "center",
          color: "#AFAFAF",
          fontFeatureSettings: "'calt' off",
        }}
      >
        {timeline}
      </Box>
      <Box
        sx={{
          width: `calc((100% - ${centralBoxWidth})/2)`,
          height: "1px",
          backgroundColor: "#FFFFFF16",
        }}
      ></Box>
    </Stack>
  );
};

export default OrLinechat;
