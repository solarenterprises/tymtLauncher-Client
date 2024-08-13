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

export interface IReqChatroomUpdateGroupName {
  room_id: string;
  room_name: string;
}

export interface IParticipant {
  userId: string;
  userKey: string;
}

export interface IReqChatroomExportMessageHistory {
  userId: string;
  chatroomId: string;
  fromDate: string;
  toDate: string;
  chunkIndex: number;
}

export interface IChatroom {
  _id: string;
  created_by: string;
  participants: IParticipant[];
  isDeleted: boolean;
  isPrivate: boolean;
  isGlobal: boolean;
  room_name: string;
  createdAt: string;
  updatedAt: string;
  room_image?: string;
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
