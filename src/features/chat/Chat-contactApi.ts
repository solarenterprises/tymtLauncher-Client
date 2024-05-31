import axios from "axios";
import tymtCore from "../../lib/core/tymtCore";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";

export const searchUsers = async (nameorsxp: string) => {
  try {
    const isaddress =
      tymtCore.Blockchains.solar.wallet.validateAddress(nameorsxp);

    const res = await axios.get(
      isaddress
        ? `${tymt_backend_url}/users?sxp=${nameorsxp}`
        : `${tymt_backend_url}/users?name=${nameorsxp}`
    );

    if (res.status === 200) {
      console.log("searchUsers");
      return res.data.users;
    } else {
      console.log("searchUsers res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to searchUsers: ", err);
  }
};

export interface contactinterface {
  contact: string;
}

export const createContact = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const contact: contactinterface = {
      contact: _id,
    };
    const res = await axios.post(`${tymt_backend_url}/users/contact`, contact, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("createContact");
      return res.data.contacts;
    } else {
      console.log("createContact res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to createContact: ", err);
  }
};

export const deleteContact = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.delete(`${tymt_backend_url}/users/contact`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
      data: {
        contact: _id,
      },
    });
    if (res.status === 200) {
      console.log("deleteContact");
      return res.data.contacts;
    } else {
      console.log("deleteContact res.status !== 200");
    }
  } catch (err) {
    console.log("Failed to deleteContact: ", err);
  }
};

export const receiveContactlist = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/contact/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("receiveContactlist", res.data.contacts);
      return res.data.contacts;
    } else {
      console.log("receiveContactlist res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to receiveContactlist: ", err);
  }
};

export interface accessinterface {
  sxpAddress: string;
  password: string;
}

export const getsenderName = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("getsenderName");
      return res.data.result.data.nickName;
    } else {
      console.log("getsenderName res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to getsenderName: ", err);
  }
};

export const getUserAvatar = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(
      `${tymt_backend_url}/users/get-avatar/${userid}`,
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("getUserAvatar");
      return res.data.avatarUrl;
    } else {
      console.log("getUserAvatar res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to getUserAvatar: ", err);
  }
};

export const getUsernotificationStatus = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("getUsernotificationStatus");
      return res.data.result.data.notificationStatus;
    } else {
      console.log("getUsernotificationStatus res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to getUsernotificationStatus: ", err);
  }
};

export const updateUsernotificationStatus = async (
  userid: string,
  notificationStatus: boolean
) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.put(
      `${tymt_backend_url}/users/${userid}`,
      {
        notificationStatus: notificationStatus ? "donotdisturb" : "online",
      },
      {
        headers: {
          "x-token": saltTokenStore.token,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("updateUsernotificationStatus");
      return res.data.notificationStatus;
    } else {
      console.log("updateUsernotificationStatus res.status !== 200");
    }
  } catch (err) {
    console.error("Failed to updateUsernotificationStatus: ", err);
  }
};

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!#~$%^&*()-=+";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
