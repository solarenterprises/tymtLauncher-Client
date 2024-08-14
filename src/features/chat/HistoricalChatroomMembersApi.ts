import ChatroomAPI from "../../lib/api/ChatroomAPI";

export const fetchHistoricalChatroomMembers = async (_chatroomId: string) => {
  try {
    const res = await ChatroomAPI.fetchHistoricalChatroomMembers(_chatroomId);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchHistoricalChatroomMembers: ", res);
      return null;
    }
    return res?.data;
  } catch (err) {
    console.error("Failed to fetchHistoricalChatroomMembers: ", err);
    return null;
  }
};
