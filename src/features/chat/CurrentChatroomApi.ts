import ChatroomAPI from "../../lib/api/ChatroomAPI";

export const fetchCurrentChatroom = async (chatroomId: string) => {
  try {
    const res = await ChatroomAPI.fetchChatroom(chatroomId);
    if (res?.status !== 200 || !res?.data?.result) {
      console.error("Failed to fetchCurrentChatroom: response undefined!", res);
      return null;
    }

    console.log("fetchCurrentChatroom", res);

    return res.data.result;
  } catch (err) {
    console.error("Failed to fetchCurrentChatroom: ", err);
    return null;
  }
};
