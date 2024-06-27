import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { AppDispatch } from "../../store";
import { ICurrentChatroomMember, fetchCurrentChatroomMembersAsync } from "../../features/chat/CurrentChatroomMembersSlice";
import { getChatroomList, removeParticipantAsync } from "../../features/chat/ChatroomListSlice";
import { getCurrentChatroom, setCurrentChatroom } from "../../features/chat/CurrentChatroomSlice";
import { IChatroom, IChatroomList } from "../../types/ChatroomAPITypes";

export interface IPropsMemberRemoveButton {
  member: ICurrentChatroomMember;
}

const MemberRemoveButton = ({ member }: IPropsMemberRemoveButton) => {
  const dispatch = useDispatch<AppDispatch>();
  const chatroomListStore: IChatroomList = useSelector(getChatroomList);
  const currentChatroomStore: IChatroom = useSelector(getCurrentChatroom);

  const handleMemberRemoveButtonClick = useCallback(() => {
    try {
      dispatch(removeParticipantAsync(member)).then(() => {
        const newCurrentChatroom = chatroomListStore.chatrooms.find((element) => element._id === currentChatroomStore._id);
        dispatch(setCurrentChatroom(newCurrentChatroom));
        dispatch(fetchCurrentChatroomMembersAsync(newCurrentChatroom._id));
      });
      console.log("handleMemberInviteButtonClick");
    } catch (err) {
      console.error("Failed to handleMemberRemoveButtonClick: ", err);
    }
  }, [chatroomListStore, currentChatroomStore]);

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
