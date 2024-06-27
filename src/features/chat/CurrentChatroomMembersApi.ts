import ChatroomAPI from "../../lib/api/ChatroomAPI";

export const fetchCurrentChatroomMembers = async (_chatroomId: string) => {
  try {
    const res = await ChatroomAPI.fetchCurrentChatroomMembers(_chatroomId);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchCurrentChatroomMembers: ", res);
      return null;
    }
    return res?.data;
  } catch (err) {
    console.error("Failed to fetchCurrentChatroomMembers: ", err);
    return null;
  }
};
