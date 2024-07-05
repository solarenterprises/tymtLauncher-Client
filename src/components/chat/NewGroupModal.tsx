import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Box, Button, Fade, Modal, Stack } from "@mui/material";

import { useSocket } from "../../providers/SocketProvider";
import NewGroupSwitch from "./NewGroupSwitch";
import InputText from "../account/InputText";

import { AppDispatch } from "../../store";
import { createGroupAsync } from "../../features/chat/ChatroomListSlice";
import { getAccount } from "../../features/account/AccountSlice";
import { addOneSKeyList } from "../../features/chat/SKeyListSlice";
import { getRsa } from "../../features/chat/RsaSlice";
import { rsaDecrypt } from "../../features/chat/RsaApi";

import { IChatroom } from "../../types/ChatroomAPITypes";
import { IRsa } from "../../types/chatTypes";
import { ISocketParamsJoinMessageGroup } from "../../types/SocketTypes";
import { accountType } from "../../types/accountTypes";

export interface IPropsNewGroupModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  roomMode: boolean;
}

const NewGroupModal = ({ open, setOpen, roomMode }: IPropsNewGroupModal) => {
  const { t } = useTranslation();
  const { socket } = useSocket();

  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const rsaStore: IRsa = useSelector(getRsa);
  const [newGroupMode, setNewGroupMode] = useState<string>("public");
  const [newGroupName, setNewGroupName] = useState<string>("");

  const handleCancelClick = () => {
    setOpen(false);
  };

  const handleCreateClick = useCallback(() => {
    if (socket.current && socket.current.connected) {
      try {
        if (!newGroupName) {
          console.log("handleCreateClick: !newGroupName");
          return;
        }
        console.log("handleCreateClick", newGroupMode, newGroupName);
        dispatch(
          createGroupAsync({
            room_name: newGroupName,
            isPrivate: newGroupMode === "private",
          })
        ).then((action) => {
          if (action.type.endsWith("/fulfilled")) {
            const newChatroom: IChatroom = action.payload as IChatroom;

            const data_1: ISocketParamsJoinMessageGroup = {
              room_id: newChatroom._id,
              joined_user_id: accountStore.uid,
            };
            socket.current.emit("join-message-group", JSON.stringify(data_1));
            console.log("socket.current.emit > join-message-group", data_1);

            dispatch(
              addOneSKeyList({
                roomId: newChatroom._id,
                sKey: rsaDecrypt((action.payload as IChatroom).participants[0].userKey, rsaStore.privateKey),
              })
            );
          }
        });
        setOpen(false);
      } catch (err) {
        console.error("Failed to handleCreateClick: ", err);
      }
    } else {
      console.error("Failed to handleCreateClick: socket not connected!");
    }
  }, [newGroupName, newGroupMode, rsaStore, accountStore, socket.current]);

  return (
    <>
      <Modal open={open} onClose={handleCancelClick}>
        <Fade in={open}>
          <Box className={roomMode ? "modal_content_chatroom" : "modal_content"}>
            <Box className={"fs-24-bold white"} textAlign={"center"}>
              {t("cha-45_create-new-group")}
            </Box>
            <Stack width={"100%"} justifyContent={"center"} gap={"5px"} mt={"25px"}>
              <Box className="center-align">
                <NewGroupSwitch value={newGroupMode} setValue={setNewGroupMode} />
              </Box>
              <InputText
                id="groupName"
                label={t("cha-49_group-name")}
                type="text"
                name="groupName"
                value={newGroupName}
                setValue={setNewGroupName}
                error={!newGroupName}
              />
              <Stack width={"100%"} flexDirection={"row"} alignSelf={"center"} justifyContent={"space-around"}>
                <Button className="modal_btn_left" onClick={handleCancelClick}>
                  <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
                    {t("cha-7_cancel")}
                  </Box>
                </Button>
                <Button className="modal_btn_right" onClick={handleCreateClick}>
                  <Box className={"fs-18-bold white"}>{t("cha-48_create")}</Box>
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default NewGroupModal;
