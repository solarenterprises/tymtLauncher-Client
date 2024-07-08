import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import InputText from "../../components/account/InputText";
import GroupAvatar from "../../components/chat/GroupAvatar";

import SettingStyle from "../../styles/SettingStyle";
import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";

import { propsType } from "../../types/settingTypes";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { getCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";

const ChatGroupEditRoom = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    if (view === "chatGroupEditRoom") {
      setGroupName(currentChatroomStore.room_name);
    }
  }, [view]);

  return (
    <>
      {view === "chatGroupEditRoom" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" onChange={() => {}} style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("chatGroupMemberListRoom")}>
              <Box component={"img"} src={backIcon} />
            </Button>
            <Box className="fs-h3 white">{t("cha-54_edit-group")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"30px"}>
              <Stack direction={"row"} justifyContent={"center"} textAlign={"right"} alignItems={"center"} gap={"10px"}>
                <Box className="center-align">
                  <GroupAvatar size={92} url={""} />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={() => {}}>
                  <Tooltip title={t("set-82_edit")} classes={{ tooltip: classname.tooltip }}>
                    <img src={editIcon} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Box>
              </Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="change-group-name" label={t("cha-55_change-group-name")} type="text" value={groupName} setValue={setGroupName} />
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button fullWidth className={classname.action_button} onClick={() => {}}>
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default ChatGroupEditRoom;
