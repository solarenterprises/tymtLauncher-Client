import { tymt_backend_url } from "../../configs";
import axios from "axios";

export interface alertrequestinterface {
  alertType: string;
  note: string;
  receivers: string[];
  reads: string[];
  readAts: Object;
}

export const sendFriendRequest = async (
  receivers: string[],
  accessToken: string
) => {
  try {
    const alertrequest: alertrequestinterface = {
      alertType: "Friend Request",
      note: "Don't miss out on the fun - add to your friends now!",
      receivers: receivers,
      reads: [],
      readAts: {},
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
