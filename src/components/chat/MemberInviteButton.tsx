import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AppDispatch } from "../../store";
import { ICurrentChatroomMember, fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { addParticipantAsync, getChatroomList } from "../../features/chat/ChatroomListSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";

export interface IPropsMemberInviteButton {
  member: ICurrentChatroomMember;
}

const MemberInviteButton = ({ member }: IPropsMemberInviteButton) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);

  const handleMemberInviteButtonClick = useCallback(() => {
    try {
      dispatch(addParticipantAsync(member)).then(() => {
        const newCurrentChatroom = chatroomListStore.chatrooms.find((element) => element._id === currentChatroomStore._id);
        dispatch(setCurrentChatroom(newCurrentChatroom));
        dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
      });
      console.log("handleMemberInviteButtonClick");
    } catch (err) {
      console.error("Failed to handleMemberInviteButtonClick: ", err);
    }
  }, [chatroomListStore, currentChatroomStore]);

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
