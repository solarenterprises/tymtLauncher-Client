import ChatroomAPI from "../../lib/api/ChatroomAPI";

export const fetchGlobalChatroomList = async () => {
  try {
    const res = await ChatroomAPI.fetchGlobalChatrooms();
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchGlobalChatroomList: ", res);
      return null;
    }
    console.log("fetchGlobalChatroomList");
    return res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetchGlobalChatroomList: ", err);
    return null;
  }
};
