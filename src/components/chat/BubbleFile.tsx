import { FileIcon, defaultStyles } from "react-file-icon";

import { Box, Stack } from "@mui/material";

import { ChatMessageType } from "../../types/chatTypes";

const FILE_URL = "https://www.englishtco.com/wp-content/uploads/2018/06/Job-Interviews-In-English_Series-One-Pack.pdf";

export interface IParamsBubbleFile {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
}

const BubbleFile = ({ isLastMessage, isSender }: IParamsBubbleFile) => {
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

  const fileDetail = getFileDetails(FILE_URL);

  return (
    <>
      <Box
        className={
          isLastMessage
            ? `fs-14-regular white ${isSender ? "bubble-last" : "bubble-last-partner"}`
            : `fs-14-regular white ${isSender ? "bubble" : "bubble-partner"}`
        }
      >
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
