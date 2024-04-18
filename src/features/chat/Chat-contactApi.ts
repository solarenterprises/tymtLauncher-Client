import axios from "axios";
import tymtCore from "../../lib/core/tymtCore";
import { tymt_backend_url } from "../../configs";

export const searchUsers = async (nameorsxp: string) => {
  try {
    const isaddress = await tymtCore.Blockchains.solar.wallet.validateAddress(
      nameorsxp
    );

    const res = await axios.get(
      isaddress
        ? `${tymt_backend_url}/users?sxp=${nameorsxp}`
        : `${tymt_backend_url}/users?name=${nameorsxp}`
    );

    if (res.status === 200) {
      return res.data.users;
    } else {
    }
  } catch (err) {}
};

export interface contactinterface {
  contact: string;
}

export const createContact = async (_id: string, accessToken: string) => {
  try {
    const contact: contactinterface = {
      contact: _id,
    };
    const res = await axios.post(`${tymt_backend_url}/users/contact`, contact, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      return res.data.contacts;
    } else {
    }
  } catch (err) {}
};

export const deleteContact = async (_id: string, accessToken: string) => {
  try {
    const res = await axios.delete(`${tymt_backend_url}/users/contact`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        contact: _id,
      },
    });
    if (res.status === 200) {
      console.log("Contact deleted successfully");
      return res.data.contacts;
    } else {
      console.log("Failed to delete contact");
    }
  } catch (err) {
    console.log("Error while deleting contact:", err.message);
  }
};

export const receiveContactlist = async (accessToken: string) => {
  try {
    const res = await axios.get(`${tymt_backend_url}/users/contact/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      console.log("Contactlist", res.data.contacts);
      return res.data.contacts;
    } else {
      console.log("Contactlist get failed");
    }
  } catch (err) {
    console.log("Contactlist not catched");
  }
};

export interface accessinterface {
  sxpAddress: string;
  password: string;
}

export const getaccessToken = async (sxpAddress: string, password: string) => {
  try {
    const accessrequest: accessinterface = {
      sxpAddress: sxpAddress,
      password: password,
    };
    const res = await axios.post(
      `${tymt_backend_url}/auth/non-custody/signin`,
      accessrequest
    );
    if (res.status === 200) {
      return res.data.accessToken;
    } else {
      console.log("failed");
    }
  } catch (err) {
    console.log("Not catched");
  }
};

export const getsenderName = async (userid: string) => {
  try {
    const res = await axios.get(`${tymt_backend_url}/users/${userid}`);
    if (res.status === 200) {
      console.log("getcontactlist success");
      return res.data.result.data.nickName;
    } else {
      console.log("Get sender failed");
    }
  } catch (err) {
    console.log("Sender not catched");
  }
};

export const getUserAvatar = async (userid: string, accessToken: string) => {
  try {
    const res = await axios.get(
      `${tymt_backend_url}/users/get-avatar/${userid}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      return res.data.avatarUrl;
    } else {
      console.log("getUserAvatar failed");
    }
  } catch (err) {
    console.log("getUserAvatar failed");
  }
};

export const getUsernotificationStatus = async (userid: string) => {
  try {
    const res = await axios.get(`${tymt_backend_url}/users/${userid}`);
    if (res.status === 200) {
      return res.data.result.data.notificationStatus;
    } else {
      console.log("getUsernotificationStatus failed");
    }
  } catch (err) {
    console.log("getUsernotificationStatus failed");
  }
};

export const updateUsernotificationStatus = async (
  userid: string,
  notificationStatus: boolean,
  accessToken: string
) => {
  try {
    const res = await axios.put(
      `${tymt_backend_url}/users/${userid}`,
      {
        notificationStatus: notificationStatus ? "donotdisturb" : "online",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      console.log("update success", res.data.result.data.notificationStatus);
      return res.data.notificationStatus;
    } else {
    }
  } catch (err) {}
};
