import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { Button, Box, Stack } from "@mui/material";
import homeStyles from "../../styles/homeStyles";
import downloadbig from "../../assets/main/downloadbig.svg";
import downloadsmall from "../../assets/main/downloadsmall.svg";
import { useSelector } from "react-redux";
import { getCurrentLogo } from "../../features/home/Tymtlogo";
import { IDownloadStatus, TymtlogoType } from "../../types/homeTypes";
import Games from "../../lib/game/Game";
import { openDir } from "../../lib/api/Downloads";
import { getDownloadStatus } from "../../features/home/DownloadStatusSlice";

const InstallingProcess = () => {
  const homeclasses = homeStyles();
  const drawer: TymtlogoType = useSelector(getCurrentLogo);
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  useEffect(() => {
    const unlisten = listen("download-progress", (event) => {
      console.log(event.payload as string);
    });

    return () => {
      unlisten.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      {drawer.isDrawerExpanded && downloadStatusStore.isDownloading && (
        <>
          <Button
            className={homeclasses.button_download}
            onClick={async () => {
              try {
                await openDir();
              } catch (error) {
                console.error("Failed to open the directory:", error);
              }
            }}
          >
            <img
              src={Games[downloadStatusStore.name].downloadImg}
              style={{
                position: "absolute",
                left: -4,
                height: "50px",
                width: "40px",
                borderRadius: "16px",
              }}
            />
            <Stack
              direction={"column"}
              sx={{
                marginLeft: "25%",
              }}
            >
              <Box className={"fs-16 white"} sx={{ textTransform: "none", display: "flex", marginLeft: 0.5 }}>
                {Games[downloadStatusStore.name].name}
              </Box>
              <Box
                className={"fs-14-regular gray"}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={downloadbig} />
                Downloading...
              </Box>
            </Stack>
          </Button>
        </>
      )}
      {!drawer.isDrawerExpanded && downloadStatusStore.isDownloading && (
        <>
          <Button className={homeclasses.button_download_small}>
            <img src={Games[downloadStatusStore.name].downloadImg} style={{ position: "absolute", left: -2, width: "21px" }} />
            <Box
              className={"fs-14-regular gray"}
              sx={{
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={downloadsmall} width={"16px"} />
            </Box>
          </Button>
        </>
      )}
    </>
  );
};

export default InstallingProcess;
