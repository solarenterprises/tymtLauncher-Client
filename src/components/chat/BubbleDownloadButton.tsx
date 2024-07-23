import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { getFileNameFromURL } from "../../lib/api/URLHelper";

export interface IPropsBubbleDownloadButton {
  url: string;
}

const BubbleDownloadButton = ({ url }: IPropsBubbleDownloadButton) => {
  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = getFileNameFromURL(url);
    link.click();
  };

  return (
    <IconButton
      className="icon-button"
      sx={{
        position: "absolute",
        top: "8px",
        right: "8px",
        zIndex: 1,
        width: "20px",
        height: "20px",
        padding: "16px",
        backgroundColor: "#00000077",
        transition: "all 0.3s ease",
      }}
      onClick={handleDownloadClick}
    >
      <DownloadIcon className="icon-button" />
    </IconButton>
  );
};

export default BubbleDownloadButton;
