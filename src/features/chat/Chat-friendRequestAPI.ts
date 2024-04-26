import { tymt_backend_url } from "../../configs";
import axios from "axios";

export interface alertrequestinterface {
  alertType: string;
  note: object;
  receivers: string[];
}

export const sendFriendRequest = async (
  receivers: string[],
  accessToken: string,
  senderId:string
) => {
  try {
    const alertrequest: alertrequestinterface = {
      alertType: "friend-request",
      note: {
        sender: `${senderId}`,
        status:"pending"
      },
      receivers: receivers
    };
    const res = await axios.post(`${tymt_backend_url}/alerts`, alertrequest, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
