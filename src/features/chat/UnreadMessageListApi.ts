import AlertAPI from "../../lib/api/AlertAPI";
import { IUnreadMessage, IUnreadMessageList } from "./UnreadMessageListSlice";

export const fetchUnreadMessageList = async (userId: string) => {
  try {
    console.log("fetchUnreadMessageList");

    const res = await AlertAPI.unreadAlertsCountForChatroom({ userId, roomId: "0" });
    if (!res || res.status !== 200 || !res?.data?.count) {
      console.error("Failed to fetchUnreadMessageList: response undefined!", res);
      return null;
    }

    const dataList: IUnreadMessage[] = res.data.count.map(({ _id, unreadCount }) => {
      const data: IUnreadMessage = {
        chatroomId: _id,
        unreadMessageCount: unreadCount,
      };
      return data;
    });
    const newUnreadMessageList: IUnreadMessageList = { data: dataList };

    return newUnreadMessageList;
  } catch (err) {
    console.error("Failed to fetchUnreadMessageList: ", err);
    return null;
  }
};
