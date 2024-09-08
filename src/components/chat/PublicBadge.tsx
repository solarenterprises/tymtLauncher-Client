import { Box } from "@mui/material";

const PublicBadge = () => {
  return (
    <Box
      className="fs-12-light white"
      sx={{
        padding: "2px 8px",
        borderRadius: "4px",
        border: "1px solid #EF8244",
        backgroundColor: "rgba(239, 130, 68, 0.20)",
      }}
    >
      {`Public`}
    </Box>
  );
};

export default PublicBadge;
