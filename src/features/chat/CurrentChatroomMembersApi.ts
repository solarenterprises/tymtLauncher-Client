import ChatroomAPI from "../../lib/api/ChatroomAPI";
import { IChatroom, IReqChatroomAddParticipant } from "../../types/ChatroomAPITypes";
import { ICurrentChatroomMember } from "./CurrentChatroomMembersSlice";
import { rsaEncrypt } from "./RsaApi";
import { ISKey } from "./SKeySlice";

export const fetchCurrentChatroomMembers = async (_chatroomId: string) => {
  try {
    const res = await ChatroomAPI.fetchCurrentChatroomMembers(_chatroomId);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to fetchCurrentChatroomMembers: ", res);
      return null;
    }
    return res?.data;
  } catch (err) {
    console.error("Failed to fetchCurrentChatroomMembers: ", err);
    return null;
  }
};

export const addOneCurrentChatroomMembers = async (_member: ICurrentChatroomMember) => {
  try {
    const sKeyStore: ISKey = JSON.parse(sessionStorage.getItem(`sKey`));
    if (!sKeyStore || !sKeyStore.sKey) {
      console.error("Failed to addOneCurrentChatroomMembers: sKey undefined");
      return null;
    }

    const currentChatroomStore: IChatroom = JSON.parse(sessionStorage.getItem(`currentChatroom`));
    if (!currentChatroomStore) {
      console.error("Failed to addOneCurrentChatroomMembers: currentChatroomStore undefined");
      return null;
    }

    const body: IReqChatroomAddParticipant = {
      user_id: _member._id,
      user_key: rsaEncrypt(sKeyStore.sKey, _member.rsa_pub_key),
      id: currentChatroomStore._id,
    };
    const res = await ChatroomAPI.addParticipant(body);
    if (res?.status !== 200 || !res?.data) {
      console.error("Failed to addOneCurrentChatroomMembers: ", res);
      return null;
    }

    return res?.data?.result?.participants;
  } catch (err) {
    console.error("Failed to addOneCurrentChatroomMembers", err);
    return null;
  }
};
