import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken } from "../../types/accountTypes";
import tymtStorage from "../../lib/Storage";
import tymtCore from "../../lib/core/tymtCore";
import { IRsa } from "../../types/chatTypes";
import { IChatroomAddParticipant, IChatroomCreateGroupReq } from "../../types/ChatroomAPITypes";
import ChatroomAPI from "../../lib/api/ChatroomAPI";
import UserAPI from "../../lib/api/UserAPI";
import { rsaDecrypt, rsaEncrypt } from "./RsaApi";

export const fetchGroupList = async () => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/group/list`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res?.status === 200 && res?.data?.contacts) {
      console.log("fetchContactList");
      return {
        contacts: res?.data?.contacts,
      };
    } else {
      console.log("fetchGroupList: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetchContactList: ", err);
    return null;
  }
};

export const createGroup = async (payload: IChatroomCreateGroupReq) => {
  try {
    const res = await ChatroomAPI.createGroup(payload);
    if (res?.status === 200 && res?.data?.result) {
      console.log("createGroup");
      return res?.data?.result;
    } else {
      console.log("createGroup: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to createGroup: ", err);
    return null;
  }
};

export const createDM = async (_id: string) => {
  try {
    // Create group
    const body0: IChatroomCreateGroupReq = {
      room_name: "",
      isPrivate: true,
    };
    const res0 = await ChatroomAPI.createGroup(body0);
    if (res0?.status !== 200 || !res0?.data?.result) {
      console.error("Failed to createDM at createGroup: ", res0);
      return null;
    }

    // Get user by id
    const res1 = await UserAPI.getUserById(_id);
    if (res1?.status !== 200 || !res1?.data?.result) {
      console.error("Failed to createDM at getUserById: ", res1);
      return null;
    }

    // Add participant
    const rsaKeyPair: IRsa = JSON.parse(sessionStorage.getItem(`rsa`));
    const s_key = rsaDecrypt(res0?.data?.result?.participants[0]?.userKey, rsaKeyPair?.privateKey);
    console.log("rsaKeyPair", rsaKeyPair);
    console.log("res0", res0);
    const body2: IChatroomAddParticipant = {
      user_id: _id,
      user_key: rsaEncrypt(s_key, res1?.data?.result?.data?.rsa_pub_key),
      room_id: res0?.data?.result?.room_id,
    };
    console.log("body2", body2);
    const res2 = await ChatroomAPI.addParticipant(body2);
    if (res2?.status !== 200 || !res2?.data?.result) {
      console.error("Failed to createDM at addParticipant: ", res2);
      return null;
    }

    console.log("res2", res2);
    return res2?.data?.result;
  } catch (err) {
    console.error("Failed to createDM: ", err);
    return null;
  }
};

export const deleteGroup = async (_id: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.delete(`${tymt_backend_url}/users/group`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
      data: {
        contact: _id,
      },
    });
    if (res?.status === 200 && res?.data?.contacts) {
      console.log("deleteGroup");
      return {
        contacts: res?.data?.contacts,
      };
    } else {
      console.log("deleteGroup: ", res?.status);
      return null;
    }
  } catch (err) {
    console.error("Failed to deleteGroup: ", err);
    return null;
  }
};

export const searchGroups = async (nameOrSxp: string) => {
  try {
    const isAddress = tymtCore.Blockchains.solar.wallet.validateAddress(nameOrSxp);

    const res = await axios.get(isAddress ? `${tymt_backend_url}/users?sxp=${nameOrSxp}` : `${tymt_backend_url}/users?name=${nameOrSxp}`);

    if (res?.status === 200 && res?.data?.users) {
      console.log("searchGroups");
      return res?.data?.users;
    } else {
      console.log("searchGroups: ", res?.status);
      return [];
    }
  } catch (err) {
    console.error("Failed to searchGroups: ", err);
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

export const getGroupAvatar = async (groupId: string) => {
  try {
    const saltTokenStore: ISaltToken = JSON.parse(tymtStorage.get(`saltToken`));
    const res = await axios.get(`${tymt_backend_url}/users/get-avatar/${groupId}`, {
      headers: {
        "x-token": saltTokenStore.token,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 && res?.data?.avatarUrl) {
      console.log("getGroupAvatar");
      return res?.data?.avatarUrl;
    } else {
      console.log("getGroupAvatar: ", res?.status);
    }
  } catch (err) {
    console.error("Failed to getGroupAvatar: ", err);
  }
};
