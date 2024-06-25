export interface IChatroomCreateGroupReq {
  room_name: string;
  isPrivate: boolean;
}

export interface IChatroomAddParticipant {
  user_id: string;
  user_key: string;
  room_id: string;
}
