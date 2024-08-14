import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { emit } from "@tauri-apps/api/event";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import InputText from "../../components/account/InputText";
import GroupAvatar from "../../components/chat/GroupAvatar";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { updateGroupAvatarAsync, updateGroupNameAsync } from "../../features/chat/ChatroomListSlice";

import SettingStyle from "../../styles/SettingStyle";
import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";

import { propsType } from "../../types/settingTypes";
import { IChatroom, IReqChatroomUpdateGroupName } from "../../types/ChatroomAPITypes";
import { useSocket } from "../../providers/SocketProvider";
import { ISocketParamsSyncEventsAll } from "../../types/SocketTypes";
import { accountType } from "../../types/accountTypes";
import { SyncEventNames } from "../../consts/SyncEventNames";

const ChatGroupEditRoom = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { socket } = useSocket();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);
  const [groupName, setGroupName] = useState<string>("");

  const handleBrowseClick = () => {
    try {
      const fileInput = document.getElementById("file-input-group-avatar");
      if (fileInput) {
        fileInput.click();
      }
      console.log("handleBrowseClick");
    } catch (err) {
      console.error("Failed to handleBrowseClick: ", err);
    }
  };

  const uploadGroupAvatar = useCallback(() => {
    try {
      const fileInput = document.getElementById("file-input-group-avatar") as HTMLInputElement;
      const file = fileInput.files ? fileInput.files[0] : null;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("room_id", currentChatroomStore?._id);
      dispatch(updateGroupAvatarAsync(formData)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          const newCurrentChatroom = action.payload as IChatroom;
          if (!newCurrentChatroom) {
            emit("error", { message: "Error at updating the group image async" });
            return;
          }
          dispatch(setCurrentChatroom(newCurrentChatroom));
          emit("success", { message: "Group image has been updated." });

          if (socket.current && socket.current.connected) {
            const data: ISocketParamsSyncEventsAll = {
              sender_id: accountStore?.uid,
              instructions: [SyncEventNames.UPDATE_IMAGE_RENDER_TIME],
              is_to_self: true,
            };
            socket.current.emit("sync-events-all", JSON.stringify(data));
            console.log("socket.current.emit > sync-events-all", data);
          }
        }
      });
      console.log("uploadGroupAvatar", file, currentChatroomStore?._id);
    } catch (err) {
      console.error("Failed to uploadGroupAvatar: ", err);
      emit("error", { message: err.toString() });
    }
  }, [socket.current, currentChatroomStore, accountStore]);

  const handleSaveClick = useCallback(() => {
    try {
      if (!groupName) {
        emit("error", { message: "The group name mustn't be empty." });
        return;
      }
      const body: IReqChatroomUpdateGroupName = {
        room_id: currentChatroomStore?._id,
        room_name: groupName,
      };
      dispatch(updateGroupNameAsync(body)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          const newCurrentChatroom: IChatroom = action.payload as IChatroom;
          if (!newCurrentChatroom) {
            emit("error", { message: "Error at updating the group name async" });
            return;
          }
          dispatch(setCurrentChatroom(newCurrentChatroom));
          emit("success", { message: "Group detail has been updated." });

          if (socket.current && socket.current.connected) {
            const data: ISocketParamsSyncEventsAll = {
              sender_id: accountStore?.uid,
              instructions: [SyncEventNames.UPDATE_CHATROOM_LIST],
              is_to_self: true,
            };
            socket.current.emit("sync-events-all", JSON.stringify(data));
            console.log("socket.current.emit > sync-events-all", data);
          }
        }
      });

      console.log("handleSaveClick", groupName, currentChatroomStore?._id);
    } catch (err) {
      console.error("Failed to handleSaveClick:", err);
      emit("error", { message: err.toString() });
    }
  }, [socket.current, groupName, currentChatroomStore]);

  useEffect(() => {
    if (view === "chatGroupEditRoom") {
      setGroupName(currentChatroomStore?.room_name);
    }
  }, [view]);

  return (
    <>
      {view === "chatGroupEditRoom" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input-group-avatar" onChange={uploadGroupAvatar} style={{ display: "none" }} />
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
                  <GroupAvatar size={92} url={currentChatroomStore?.room_image} />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={handleBrowseClick}>
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
              <Button fullWidth className={classname.action_button} onClick={handleSaveClick}>
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
