import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { useNotification } from "../../providers/NotificationProvider";
import { useSocket } from "../../providers/SocketProvider";

import { AppDispatch } from "../../store";
import { ICurrentChatroomMember, fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { addParticipantAsync, getChatroomList } from "../../features/chat/ChatroomListSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";

import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";
import { ISocketParamsJoinMessageGroup } from "../../types/SocketTypes";

import { translateString } from "../../lib/api/Translate";
import { useTranslation } from "react-i18next";

export interface IPropsMemberInviteButton {
  member: ICurrentChatroomMember;
}

const MemberInviteButton = ({ member }: IPropsMemberInviteButton) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);

  const handleMemberInviteButtonClick = useCallback(async () => {
    try {
      dispatch(addParticipantAsync(member)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          const newCurrentChatroom = action.payload as IChatroom;
          dispatch(setCurrentChatroom(newCurrentChatroom));
          dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));

          if (socket.current && socket.current.connected) {
            const data: ISocketParamsJoinMessageGroup = {
              room_id: newCurrentChatroom._id,
              joined_user_id: member._id,
            };
            socket.current.emit("join-message-group", JSON.stringify(data));
            console.log("socket.current.emit > join-message-group", data);
          }
        }
      });
      console.log("handleMemberInviteButtonClick");
    } catch (err) {
      console.error("Failed to handleMemberInviteButtonClick: ", err);

      setNotificationStatus("failed");
      setNotificationTitle(t("hom-23_error"));
      setNotificationDetail(await translateString(err.toString()));
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [chatroomListStore, currentChatroomStore, socket.current]);

  return (
    <>
      <Button
        onClick={handleMemberInviteButtonClick}
        sx={{
          transition: "all 0.3s ease", // Transition property
          minWidth: "24px",
          minHeight: "24px",
          width: "24px",
          height: "24px",
          borderRadius: "12px",
          border: "1px solid #52e1f2",
          backgroundColor: "transparent",
          "&:hover": {
            borderRadius: "6px",
            border: "1px solid #52e1f2",
            backgroundColor: "#52e1f2",
          },
        }}
      >
        <PersonAddIcon
          sx={{
            transition: "all 0.3s ease", // Transition property
            width: "12px",
            height: "12px",
            padding: "6px",
            color: "#52e1f2",
            "&:hover": {
              color: "#071616",
            },
          }}
        />
      </Button>
    </>
  );
};

export default MemberInviteButton;
