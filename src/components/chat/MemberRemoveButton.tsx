import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import { useNotification } from "../../providers/NotificationProvider";
import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { ICurrentChatroomMember, fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getChatroomList, removeParticipantAsync } from "../../features/chat/ChatroomListSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";

import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { ISocketParamsLeaveMessageGroup } from "../../types/SocketTypes";

import { translateString } from "../../lib/api/Translate";

export interface IPropsMemberRemoveButton {
  member: ICurrentChatroomMember;
}

const MemberRemoveButton = ({ member }: IPropsMemberRemoveButton) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const dispatch = useDispatch<AppDispatch>();
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);

  const handleMemberRemoveButtonClick = useCallback(async () => {
    if (socket.current && socket.current.connected) {
      try {
        dispatch(removeParticipantAsync(member)).then((action) => {
          if (action.type.endsWith("/fulfilled")) {
            const newCurrentChatroom = action.payload as IChatroom;
            dispatch(setCurrentChatroom(newCurrentChatroom));
            dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));

            if (socket.current && socket.current.connected) {
              const data: ISocketParamsLeaveMessageGroup = {
                room_id: newCurrentChatroom._id,
                joined_user_id: member._id,
              };
              socket.current.emit("leave-message-group", JSON.stringify(data));
              console.log("socket.current.emit > leave-message-group", data);
            }
          }
        });

        console.log("handleMemberRemoveButtonClick");
      } catch (err) {
        console.error("Failed to handleMemberRemoveButtonClick: ", err);

        setNotificationStatus("failed");
        setNotificationTitle(t("hom-23_error"));
        setNotificationDetail(await translateString(err.toString()));
        setNotificationOpen(true);
        setNotificationLink(null);
      }
    } else {
      console.error("Failed to handleMemberRemoveButtonClick: socket not connected!");

      setNotificationStatus("failed");
      setNotificationTitle(t("hom-23_error"));
      setNotificationDetail(await translateString("Socket is not connected!"));
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [chatroomListStore, currentChatroomStore, socket.current]);

  return (
    <>
      <Button
        onClick={handleMemberRemoveButtonClick}
        sx={{
          transition: "all 0.3s ease", // Transition property
          minWidth: "24px",
          minHeight: "24px",
          width: "24px",
          height: "24px",
          borderRadius: "12px",
          border: "1px solid #EF4444",
          backgroundColor: "transparent",
          "&:hover": {
            borderRadius: "6px",
            border: "1px solid #EF4444",
            backgroundColor: "#EF4444",
          },
        }}
      >
        <PersonRemoveIcon
          sx={{
            transition: "all 0.3s ease", // Transition property
            width: "12px",
            height: "12px",
            padding: "6px",
            color: "#EF4444",
            "&:hover": {
              color: "#071616",
            },
          }}
        />
      </Button>
    </>
  );
};

export default MemberRemoveButton;
