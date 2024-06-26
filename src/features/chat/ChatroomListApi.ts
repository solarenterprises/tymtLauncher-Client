import { IRsa } from "../../types/chatTypes";
import { IChatroomAddParticipant, IChatroomCreateChatroomReq } from "../../types/ChatroomAPITypes";
import { rsaDecrypt, rsaEncrypt } from "./RsaApi";
import ChatroomAPI from "../../lib/api/ChatroomAPI";
import UserAPI from "../../lib/api/UserAPI";

export const fetchChatroomList = async (_id: string) => {
  try {
    const res = await ChatroomAPI.fetchAllChatroomsFor(_id);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchChatroomList: ", res);
      return null;
    }
    return res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetchChatroomList: ", err);
    return null;
  }
};

export const createGroup = async (payload: IChatroomCreateChatroomReq) => {
  try {
    const res = await ChatroomAPI.createChatroom(payload);
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
    const body0: IChatroomCreateChatroomReq = {
      room_name: "",
      isPrivate: true,
    };
    const res0 = await ChatroomAPI.createChatroom(body0);
    if (res0?.status !== 200 || !res0?.data?.result) {
      console.error("Failed to createDM at createChatroom: ", res0);
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
    const body2: IChatroomAddParticipant = {
      user_id: _id,
      user_key: rsaEncrypt(s_key, res1?.data?.result?.data?.rsa_pub_key),
      id: res0?.data?.result?._id,
    };
    const res2 = await ChatroomAPI.addParticipant(body2);
    if (res2?.status !== 200 || !res2?.data?.result) {
      console.error("Failed to createDM at addParticipant: ", res2);
      return null;
    }
    console.log("createDM");
    return res2?.data?.result;
  } catch (err) {
    console.error("Failed to createDM: ", err);
    return null;
  }
};

export const searchGroups = async (name: string) => {
  try {
    const res = await ChatroomAPI.searchChatroom(name);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to searchGroups: ", res);
      return [];
    }
    console.log("searchGroups");
    return res?.data;
  } catch (err) {
    console.error("Failed to searchGroups: ", err);
    return [];
  }
};
