import { useSelector } from "react-redux";
import { useState } from "react";
import { Button, Box, Stack } from "@mui/material";

import InstallProcessContextMenu from "./InstallProcessContextMenu";

import { getDownloadStatus } from "../../features/home/DownloadStatusSlice";

import downloadbig from "../../assets/main/downloadbig.svg";
import downloadsmall from "../../assets/main/downloadsmall.svg";

import { getCurrentLogo } from "../../features/home/Tymtlogo";

import { IDownloadStatus, IPoint, TymtlogoType } from "../../types/homeTypes";
import { openDir } from "../../lib/helper/DownloadHelper";
import numeral from "numeral";

const InstallingProcess = () => {
  const drawer: TymtlogoType = useSelector(getCurrentLogo);
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<IPoint>({
    x: 0,
    y: 0,
  });

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenuPosition({ x: mouseX, y: mouseY });
    setShowContextMenu(true);
  };

  return (
    <>
      {drawer.isDrawerExpanded && downloadStatusStore.isDownloading && (
        <Box onContextMenu={handleRightClick}>
          <Button
            sx={{
              width: "180px",
              height: "52px",
              marginLeft: "10px",
              marginBottom: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              backgroundColor: "rgba(128, 128, 128, 0.10)",
              backdropFilter: "blur(50px)",
              color: "gray",
              alignItems: "center",
              display: "flex",
              justifyContent: "left",
              position: "relative",
              "&:hover": {
                backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
                border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.10))",
              },
            }}
            onClick={async () => {
              try {
                await openDir();
              } catch (error) {
                console.error("Failed to open the directory:", error);
              }
            }}
          >
            <img
              src={downloadStatusStore?.game?.imageUrl}
              style={{
                position: "absolute",
                left: "0px",
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
              <Box
                className={"fs-16 white"}
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  WebkitLineClamp: 7,
                  WebkitBoxOrient: "vertical",
                  display: "-webkit-box",
                  width: "100px",
                }}
              >
                {downloadStatusStore?.game?.title}
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
                {`${numeral((downloadStatusStore?.progress / downloadStatusStore?.total) * 100).format("0")}%`}
              </Box>
            </Stack>
          </Button>
        </Box>
      )}
      {!drawer.isDrawerExpanded && downloadStatusStore.isDownloading && (
        <Box onContextMenu={handleRightClick}>
          <Button
            sx={{
              width: "74px",
              height: "21px",
              marginLeft: "10px",
              marginBottom: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              backgroundColor: "rgba(128, 128, 128, 0.10)",
              backdropFilter: "blur(50px)",
              color: "gray",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              "&:hover": {
                backgroundColor: "var(--bg-stroke-icon-button-bg-10, rgba(128, 128, 128, 0.10))",
                border: "1px solid var(--Stroke-linear-Hover, rgba(255, 255, 255, 0.10))",
              },
            }}
            onClick={async () => {
              try {
                await openDir();
              } catch (error) {
                console.error("Failed to open the directory:", error);
              }
            }}
          >
            <img
              src={downloadStatusStore?.game?.imageUrl}
              style={{
                position: "absolute",
                left: "0px",
                height: "19px",
                width: "16px",
                borderRadius: "16px",
              }}
            />
            <Box
              className={"fs-14-regular gray"}
              sx={{
                marginLeft: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={downloadsmall} width={"16px"} />
              {`${numeral((downloadStatusStore?.progress / downloadStatusStore?.total) * 100).format("0")}%`}
            </Box>
          </Button>
        </Box>
      )}
      <InstallProcessContextMenu view={showContextMenu} setView={setShowContextMenu} contextMenuPosition={contextMenuPosition} />
    </>
  );
};

export default InstallingProcess;
