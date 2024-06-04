import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";
import { IAlertList } from "../../types/alertTypes";

export const fetchUnreadAlertList = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-unread-for-user/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchUnreadAlertList");
      return {
        unread: res?.data?.result,
      };
    } else {
      console.log("fetchUnreadAlertList res.status !== 200");
      return {
        unread: [],
      };
    }
  } catch (err) {
    console.error("Failed to fetchUnreadAlertList: ", err);
    return {
      unread: [],
    };
  }
};

export const fetchReadAlertList = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-read-for-user/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchReadAlertList");
      return {
        read: res?.data?.result,
      };
    } else {
      console.log("fetchReadAlertList res.status !== 200");
      return {
        read: [],
      };
    }
  } catch (err) {
    console.error("Failed to fetchReadAlertList: ", err);
    return {
      read: [],
    };
  }
};

export const fetchAlertList = async (userid: string) => {
  try {
    const res = await Promise.all([fetchUnreadAlertList(userid), fetchReadAlertList(userid)]);
    const res1: IAlertList = {
      unread: res[0]?.unread,
      read: res[1]?.read,
    };
    console.log("fetchAlertList");
    return res1;
  } catch (err) {
    console.error("Failed to getAlertList: ", err);
  }
};

export const fetchCountUnreadAlertList = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/alerts/alerts-count-unread-for-user/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchCountUnreadAlertList");
      return res?.data?.count;
    } else {
      console.log("fetchCountUnreadAlertList res.status !== 200");
      return 0;
    }
  } catch (err) {
    console.error("Failed to fetchCountUnreadAlertList: ", err);
    return 0;
  }
};

interface updateAlertReadStatusPayload {
  alertId: string;
  userId: string;
}
export const updateAlertReadStatus = async (payload: updateAlertReadStatusPayload) => {
  try {
    const { alertId, userId } = payload;
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/alerts/add-reader/${alertId}`,
      {
        reader: `${userId}`,
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res?.status === 200) {
      console.log("updateAlertReadstatus");
      return res?.data?.result;
    } else {
      console.log("updateAlertReadstatus res.status !== 200");
      return null;
    }
  } catch (err) {
    console.error("Failed to updateAlertReadstatus: ", err);
    return null;
  }
};

// export const updateAllAlertReadStatus = async (userid: string) => {
//   try {
//     const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
//     const res = await axios.put(
//       `${tymt_backend_url}/alerts/add-reader/${alert_id}`,
//       {
//         reader: `${userid}`,
//       },
//       {
//         headers: {
//           "x-token": saltTokenStore.token,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (res?.status === 200) {
//       console.log("updateAllAlertReadStatus");
//       return res?.data?.result;
//     } else {
//       console.log("updateAllAlertReadStatus res.status !== 200");
//       return null;
//     }
//   } catch (err) {
//     console.error("Failed to updateAllAlertReadStatus: ", err);
//     return null;
//   }
// };

// export const approveFriendRequest = async (
//   alert_id: string,
//   userid: string
// ) => {
//   try {
//     const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
//     const res = await axios.put(
//       `${tymt_backend_url}/alerts/${alert_id}`,
//       {
//         note: { status: "accepted" },
//         reads: [`${userid}`],
//         readAts: { userid: Date.now() },
//       },
//       {
//         headers: {
//           "x-token": saltTokenStore.token,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (res.status === 200) {
//       console.log("approveFriendRequest");
//     } else {
//       console.log("approveFriendRequest res.status !== 200");
//     }
//   } catch (err) {
//     console.error("Failed to approveFriendRequest: ", err);
//   }
// };

// export const declineFriendRequest = async (
//   alert_id: string,
//   userid: string
// ) => {
//   try {
//     const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
//     const res = await axios.put(
//       `${tymt_backend_url}/alerts/${alert_id}`,
//       {
//         note: { status: "rejected" },
//         reads: [`${userid}`],
//         readAts: { userid: Date.now() },
//       },
//       {
//         headers: {
//           "x-token": saltTokenStore.token,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (res.status === 200) {
//       console.log("declineFriendRequest");
//     } else {
//       console.log("declineFriendRequest res.status !== 200");
//     }
//   } catch (err) {
//     console.error("Failed to declineFriendRequest: ", err);
//   }
// };
