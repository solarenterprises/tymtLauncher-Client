export interface IReqChatroomCreateChatroom {
  room_name: string;
  isPrivate: boolean;
}

export interface IReqChatroomAddParticipant {
  user_id: string;
  user_key: string;
  id: string;
}

export interface IReqChatroomLeaveChatroom {
  user_id: string;
  id: string;
}

export interface IParticipant {
  userId: string;
  userKey: string;
}

export interface IChatroom {
  _id: string;
  created_by: string;
  participants: IParticipant[];
  isDeleted: boolean;
  isPrivate: boolean;
  room_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IChatroomList {
  chatrooms: IChatroom[];
}

export interface IParamsJoinPublicGroup {
  _userId: string;
  _groupId: string;
}

export interface IParamsLeaveGroup {
  _userId: string;
  _groupId: string;
}
