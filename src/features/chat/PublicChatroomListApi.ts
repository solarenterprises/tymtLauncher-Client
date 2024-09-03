import ChatroomAPI from "../../lib/api/ChatroomAPI";

export const fetchPublicChatroomList = async () => {
  try {
    const res = await ChatroomAPI.fetchAllPublicChatrooms();
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchPublicChatroomList: ", res);
      return null;
    }
    console.log("fetchPublicChatroomList");
    return res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetchPublicChatroomList: ", err);
    return null;
  }
};
