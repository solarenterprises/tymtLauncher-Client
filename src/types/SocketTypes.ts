export interface ISocketParamsJoinMessageGroup {
  room_id: string;
  joined_user_id: string;
}

export interface ISocketParamsLeaveMessageGroup {
  room_id: string;
  joined_user_id: string;
}

export interface ISocketParamsPostMessage {
  room_id: string;
  sender_id: string;
  message: string;
  type: string;
}

export interface ISocketParamsJoinedMessageGroup {
  room_id: string;
  joined_user_id: string;
}

export interface ISocketParamsLeftMessageGroup {
  room_id: string;
  left_user_id: string;
}

export interface ISocketParamsActiveUsers {
  users: string[];
}
