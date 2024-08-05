import { IRsa } from "../../types/chatTypes";
import {
  IChatroom,
  IParamsJoinPublicGroup,
  IParamsLeaveGroup,
  IReqChatroomAddParticipant,
  IReqChatroomCreateChatroom,
  IReqChatroomLeaveChatroom,
  IReqChatroomUpdateGroupName,
} from "../../types/ChatroomAPITypes";
import { rsaDecrypt, rsaEncrypt } from "./RsaApi";
import ChatroomAPI from "../../lib/api/ChatroomAPI";
import UserAPI from "../../lib/api/UserAPI";
import { ISKeyList } from "./SKeyListSlice";
import { ICurrentChatroomMember } from "./CurrentChatroomMembersSlice";
import { isArray } from "lodash";

export const fetchChatroomList = async (_id: string) => {
  try {
    const res = await ChatroomAPI.fetchAllChatroomsFor(_id);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchChatroomList: ", res);
      return null;
    }
    console.log("fetchChatroomList");
    return res?.data ?? [];
  } catch (err) {
    console.error("Failed to fetchChatroomList: ", err);
    return null;
  }
};

export const addOneToChatroomList = async (room_id: string) => {
  try {
    const res = await ChatroomAPI.fetchChatroom(room_id);
    if (res?.status !== 200 || !res?.data || !res?.data?.result) {
      console.error("Failed to addOneToChatroomList: ", res);
      return null;
    }

    console.log("addOneToChatroomList", room_id);
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to addOneToChatroomList: ", err);
    return null;
  }
};

export const createGroup = async (payload: IReqChatroomCreateChatroom) => {
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
    const body0: IReqChatroomCreateChatroom = {
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
    const body2: IReqChatroomAddParticipant = {
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

export const addParticipant = async (_member: ICurrentChatroomMember) => {
  try {
    const currentChatroomStore: IChatroom = JSON.parse(sessionStorage.getItem(`currentChatroom`));
    if (!currentChatroomStore) {
      console.error("Failed to addOneCurrentChatroomMembers: currentChatroomStore undefined!");
      return null;
    }

    const sKeyListStore: ISKeyList = JSON.parse(sessionStorage.getItem(`sKeyList`));
    if (!sKeyListStore || !sKeyListStore.sKeys || !isArray(sKeyListStore.sKeys)) {
      console.error("Failed to addOneCurrentChatroomMembers: sKeyListStore undefined!");
      return null;
    }

    const currentSKey = sKeyListStore?.sKeys?.find((element) => element?.roomId === currentChatroomStore?._id)?.sKey;
    if (!currentSKey && currentChatroomStore?.isPrivate) {
      console.error("Failed to addOneCurrentChatroomMembers: currentSKey undefined!");
      return null;
    }

    const body: IReqChatroomAddParticipant = {
      user_id: _member._id,
      user_key: currentChatroomStore?.isPrivate ? rsaEncrypt(currentSKey, _member.rsa_pub_key) : "",
      id: currentChatroomStore?._id,
    };
    const res = await ChatroomAPI.addParticipant(body);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to addParticipant: ", res);
      return null;
    }

    console.log("addParticipant");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to addParticipant: ", err);
  }
};

export const removeParticipant = async (_member: ICurrentChatroomMember) => {
  try {
    const currentChatroomStore: IChatroom = JSON.parse(sessionStorage.getItem(`currentChatroom`));
    if (!currentChatroomStore) {
      console.error("Failed to addOneCurrentChatroomMembers: currentChatroomStore undefined");
      return null;
    }

    const body: IReqChatroomLeaveChatroom = {
      user_id: _member._id,
      id: currentChatroomStore?._id,
    };
    const res = await ChatroomAPI.leaveChatroom(body);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to addParticipant: ", res);
      return null;
    }

    console.log("removeParticipant");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to removeParticipant: ", err);
  }
};

export const joinPublicGroup = async ({ _userId, _groupId }: IParamsJoinPublicGroup) => {
  try {
    const body: IReqChatroomAddParticipant = {
      user_id: _userId,
      user_key: "",
      id: _groupId,
    };
    const res = await ChatroomAPI.addParticipant(body);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to joinPublicGroup: ", res);
      return null;
    }

    console.log("joinPublicGroup");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to joinPublicGroup: ", err);
  }
};

export const leaveGroup = async ({ _userId, _groupId }: IParamsLeaveGroup) => {
  try {
    const body: IReqChatroomLeaveChatroom = {
      user_id: _userId,
      id: _groupId,
    };
    const res = await ChatroomAPI.leaveChatroom(body);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to leaveGroup: ", res);
      return null;
    }

    console.log("leaveGroup");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to leaveGroup: ", err);
  }
};

export const searchGroups = async (name: string) => {
  try {
    const res = await ChatroomAPI.searchPublicChatrooms(name);
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

export const updateGroupAvatar = async (formData: FormData) => {
  try {
    const res = await ChatroomAPI.uploadChatroomAvatar(formData);
    if (res?.status !== 200 || !res?.data || !res?.data?.result) {
      console.error("Failed to updateGroupAvatar: ", res);
      return null;
    }

    console.log("updateGroupAvatar");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to updateGroupAvatar: ", err);
    return null;
  }
};

export const updateGroupName = async (body: IReqChatroomUpdateGroupName) => {
  try {
    const res = await ChatroomAPI.updateChatroomName(body);
    if (res?.status !== 200 || !res?.data || !res?.data?.result) {
      console.error("Failed to updateGroupName: ", res);
      return null;
    }

    console.log("updateGroupName");
    return res?.data?.result;
  } catch (err) {
    console.error("Failed to updateGroupName: ", err);
  }
};

export const removeChatroom = async (chatroom_id: string) => {
  try {
    const res = await ChatroomAPI.removeChatroom(chatroom_id);
    if (!res || res.status !== 200) {
      throw new Error("response undefined!");
    }

    console.log("removeChatroom", res);
  } catch (err) {
    console.error("removeChatroom: ", err);
    return null;
  }
};
