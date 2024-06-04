import { Box } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top={0}
      left={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backdropFilter: "blur(10px)", zIndex: "100" }}
    >
      <ThreeDots height="100%" width={100} radius={3} color={`#EF4444`} />
    </Box>
  );
};

export default Loading;
