import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";
import tymtCore from "../../lib/core/tymtCore";

export const fetchContactList = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/contact/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("fetchContactList");
      return {
        contacts: res?.data?.contacts,
      };
    } else {
      console.log("fetchContactList res.status !== 200");
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to fetchContactList: ", err);
    return {
      contacts: [],
    };
  }
};

export const createContact = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const contact = {
      contact: _id,
    };
    const res = await axios.post(`${tymt_backend_url}/users/contact`, contact, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("createContact");
      if (res?.data?.contacts) {
        return {
          contacts: res?.data?.contacts,
        };
      }
      return null;
    } else {
      console.log("createContact: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to createContact: ", err);
    return {
      contacts: [],
    };
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
    if (res?.status === 200) {
      console.log("deleteContact");
      return {
        contacts: res?.data?.contacts,
      };
    } else {
      console.log("deleteContact: ", res?.status);
      return {
        contacts: [],
      };
    }
  } catch (err) {
    console.error("Failed to deleteContact: ", err);
    return {
      contacts: [],
    };
  }
};

export const searchUsers = async (nameOrSxp: string) => {
  try {
    const isAddress =
      tymtCore.Blockchains.solar.wallet.validateAddress(nameOrSxp);

    const res = await axios.get(
      isAddress
        ? `${tymt_backend_url}/users?sxp=${nameOrSxp}`
        : `${tymt_backend_url}/users?name=${nameOrSxp}`
    );

    if (res?.status === 200) {
      console.log("searchUsers");
      return res?.data?.users;
    } else {
      console.log("searchUsers res.status", res?.status);
      return [];
    }
  } catch (err) {
    console.error("Failed to searchUsers: ", err);
    return [];
  }
};

export const getsenderName = async (userid: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/${userid}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200) {
      console.log("getsenderName");
      return res?.data?.result?.data?.nickName;
    } else {
      console.log("getsenderName", res?.status);
    }
  } catch (err) {
    console.error("Failed to getsenderName: ", err);
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
