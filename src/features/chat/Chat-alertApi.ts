import axios from "axios";
import { tymt_backend_url } from "../../configs";

export const fetchUnreadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-unread-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetch unread alerts successfully");
      return res.data.result;
    } else {
      console.log("fetch unread alerts failed");
    }
  } catch (err) {
    console.log("fetch unread alerts failed");
  }
};

export const fetchCountUnreadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-count-unread-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetch unread alerts successfully");
      return res.data.count;
    } else {
      console.log("fetch unread alerts failed");
    }
  } catch (err) {
    console.log("fetch unread alerts failed");
  }
};

export const updateAlertReadstatus = async (
  userid: string,
  accessToken: string
) => {
  try {
    const res = await axios.put(
      `${tymt_backend_url}/alerts/add-reader/${userid}`,
      {
        reader: `${userid}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("update alert status success");
    } else {
      console.log("update alert status failed");
    }
  } catch (err) {
    console.log("update alert status failed");
  }
};
