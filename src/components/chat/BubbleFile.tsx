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
  displayNickname: string;
  isDM: boolean;
}

const BubbleFile = ({ roomMode, message, decryptedMessage, isLastMessage, isSender, displayNickname, isDM }: IParamsBubbleFile) => {
  const [mouseOn, setMouseOn] = useState<boolean>(false);

  const url = `${tymt_avatar_url}/public/upload/message/${message.message}`;

  const getFileDetailsFromFileName = (fullFileName: string) => {
    try {
      const extension = fullFileName.includes(".") ? fullFileName.split(".").pop() : null;
      const filenameWithoutExtension = extension ? fullFileName.slice(0, -(extension.length + 1)) : fullFileName;
      const isValidExtension = extension && extension !== fullFileName;
      return {
        filename: filenameWithoutExtension,
        extension: isValidExtension ? extension : null,
      };
    } catch (err) {
      console.error("Failed to getFileDetailsFromFileName: ", err);
      return {
        filename: null,
        extension: null,
      };
    }
  };

  const fileDetail = getFileDetailsFromFileName(decryptedMessage);

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
        {mouseOn && <BubbleDownloadButton url={url} name={decryptedMessage} />}
        <Stack>
          {!isDM && <Box className={"fs-12-regular white"}>{displayNickname}</Box>}
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
              {decryptedMessage}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default BubbleFile;
