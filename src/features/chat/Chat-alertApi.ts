import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const fetchUnreadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-unread-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetchUnreadAlerts");
      return res.data.result;
    } else {
      console.log("fetchUnreadAlerts res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to fetchUnreadAlerts: ", err);
  }
};

export const fetchReadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-read-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetchReadAlerts");
      return res.data.result;
    } else {
      console.log("fetchReadAlerts res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to fetchReadAlerts: ", err);
  }
};

export const fetchCountUnreadAlerts = async (userid: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/alerts/alerts-count-unread-for-user/${userid}`
    );
    if (res.status === 200) {
      console.log("fetchCountUnreadAlerts");
      return res.data.count;
    } else {
      console.log("fetchCountUnreadAlerts res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to fetchCountUnreadAlerts: ", err);
  }
};

export const updateAlertReadstatus = async (
  alert_id: string,
  userid: string
) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/add-reader/${alert_id}`,
      {
        reader: `${userid}`,
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("updateAlertReadstatus");
    } else {
      console.log("updateAlertReadstatus res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to updateAlertReadstatus: ", err);
  }
};

export const approveFriendRequest = async (
  alert_id: string,
  userid: string
) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/${alert_id}`,
      {
        note: { status: "accepted" },
        reads: [`${userid}`],
        readAts: { userid: Date.now() },
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("approveFriendRequest");
    } else {
      console.log("approveFriendRequest res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to approveFriendRequest: ", err);
  }
};

export const declineFriendRequest = async (
  alert_id: string,
  userid: string
) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/${alert_id}`,
      {
        note: { status: "rejected" },
        reads: [`${userid}`],
        readAts: { userid: Date.now() },
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("declineFriendRequest");
    } else {
      console.log("declineFriendRequest res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to declineFriendRequest: ", err);
  }
};
