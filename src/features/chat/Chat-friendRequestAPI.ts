import { tymt_backend_url } from "../../configs";
import axios from "axios";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export interface alertrequestinterface {
  alertType: string;
  note: object;
  receivers: string[];
}

export const sendFriendRequest = async (
  receivers: string[],
  senderId: string
) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const alertrequest: alertrequestinterface = {
      alertType: "friend-request",
      note: {
        sender: `${senderId}`,
        status: "pending",
      },
      receivers: receivers,
    };
    const res = await axios.post(`${tymt_backend_url}/alerts`, alertrequest, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("friend request success");
      return res.data.result;
    } else {
      console.log("failed");
    }
  } catch (err) {
    console.log("Not catched");
  }
};
