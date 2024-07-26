import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";

export interface IPropsBubbleDownloadButton {
  url: string;
  name: string;
}

const BubbleDownloadButton = ({ url, name }: IPropsBubbleDownloadButton) => {
  const handleDownloadClick = () => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, name); // Use saveAs to trigger the download
      })
      .catch((error) => {
        console.error("Failed to handleDownloadClick: ", error);
      });
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
