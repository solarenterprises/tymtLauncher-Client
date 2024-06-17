import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import backIcon from "../../assets/settings/back-icon.svg";
import checkImg from "../../assets/settings/check-icon.svg";

import { selectChat, setChat } from "../../features/settings/ChatSlice";
import { propsType, chatType } from "../../types/settingTypes";

const ChatMsginRoom = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const data: chatType = useSelector(selectChat);
  const setMessage = useCallback(
    (item: string) => {
      let updateData = { ...data, message: item };
      dispatch(setChat(updateData));
      console.log("receiving message option", data.message);
    },
    [data]
  );

  return (
    <>
      {view === "chatroom-message" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"common-btn"}>
              <Box className={"center_align"} onClick={() => setView("chatroom-chatsetting")}>
                <img src={backIcon} />
              </Box>
            </Button>
            <Box className={"fs-h3 white"}>{t("set-21_receive-messages")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setMessage("anyone");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className={"fs-h4 white"}>{t("set-23_anyone")}</Box>
                <Box className={"center-align"}>{data.message == "anyone" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setMessage("noone");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className={"fs-h4 white"}>{t("set-26_no-one")}</Box>
                <Box className={"center-align"}>{data.message == "noone" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className={"common-btn"}
              sx={{ padding: "20px" }}
              onClick={() => {
                setMessage("friend");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className={"fs-h4 white"}>{t("set-27_friends")}</Box>
                <Box className={"center-align"}>{data.message == "friend" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ChatMsginRoom;
