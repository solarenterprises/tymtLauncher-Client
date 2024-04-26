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

export const fetchReadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-read-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetch read alerts successfully");
      return res.data.result;
    } else {
      console.log("fetch read alerts failed");
    }
  } catch (err) {
    console.log("fetch read alerts failed");
  }
};

export const fetchCountUnreadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-count-unread-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetch unread Counts successfully");
      return res.data.count;
    } else {
      console.log("fetch unread Counts failed");
    }
  } catch (err) {
    console.log("fetch unread Counts failed");
  }
};


export const updateAlertReadstatus = async (
  alert_id: string,
  userid: string,
  accessToken: string
) => {
  try {
    const res = await axios.put(
      `${tymt_backend_url}/alerts/add-reader/${alert_id}`,
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

export const approveFriendRequest = async (
  alert_id: string,
  userid: string,
  accessToken: string
) => {
  try {
    const res = await axios.put(
      `${tymt_backend_url}/alerts/${alert_id}`,
      {
        note: { status: "accepted" },
        reads: [`${userid}`],
        readAts: { userid: Date.now() },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("approve FR success");
    } else {
      console.log("approve FR failed");
    }
  } catch (err) {
    console.log("approve FR failed");
  }
};

export const declineFriendRequest = async (
  alert_id: string,
  userid: string,
  accessToken: string
) => {
  try {
    const res = await axios.put(
      `${tymt_backend_url}/alerts/${alert_id}`,
      {
        note: { status: "rejected" },
        reads: [`${userid}`],
        readAts: { userid: Date.now() },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("Decline FR success");
    } else {
      console.log("Decline FR failed");
    }
  } catch (err) {
    console.log("Decline FR failed");
  }
};
