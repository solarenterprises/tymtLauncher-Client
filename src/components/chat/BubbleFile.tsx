import { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

import { tymt_avatar_url } from "../../configs";

import { Box, Stack } from "@mui/material";

import BubbleDownloadButton from "./BubbleDownloadButton";

import { ChatMessageType } from "../../types/chatTypes";

// const FILE_URL = "https://www.englishtco.com/wp-content/uploads/2018/06/Job-Interviews-In-English_Series-One-Pack.pdf";

export interface IParamsBubbleFile {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
}

const BubbleFile = ({ roomMode, message, isLastMessage, isSender }: IParamsBubbleFile) => {
  const [mouseOn, setMouseOn] = useState<boolean>(false);

  const url = `${tymt_avatar_url}/public/upload/message/${message.file}`;

  const getFileDetails = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;

      // Get the filename
      const segments = pathname.split("/");
      const filenameWithExtension = segments.pop() || null;

      // Get the file extension
      const extension = filenameWithExtension ? filenameWithExtension.split(".").pop() : null;

      // Check if the extension is valid
      const isValidExtension = extension && extension !== filenameWithExtension;

      return {
        filename: filenameWithExtension,
        extension: isValidExtension ? extension : null,
      };
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const fileDetail = getFileDetails(url);

  return (
    <>
      <Box
        className={`fs-14-regular white ${isSender ? "bubble" : "bubble-partner"} ${
          isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"
        }`}
        sx={{ position: "relative" }}
        onMouseEnter={() => {
          setMouseOn(true);
        }}
        onMouseLeave={() => {
          setMouseOn(false);
        }}
      >
        {mouseOn && <BubbleDownloadButton url={url} />}
        <Stack direction={"row"} gap={"8px"} alignItems={"center"} height={"48px"} width={"240px"}>
          <Box
            height={"48px"}
            width={"32px"}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FileIcon extension={fileDetail.extension} {...defaultStyles[fileDetail.extension]} />
          </Box>
          <Box
            className="fs-16-regular white"
            width={"200px"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fileDetail.filename}
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default BubbleFile;
