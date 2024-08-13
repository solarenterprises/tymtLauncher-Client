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

export interface ISocketParamsSyncEvent {
  sender_id: string;
  recipient_id: string;
  instructions: string[];
  is_to_self: boolean;
}

export interface ISocketParamsSyncEvents {
  sender_id: string;
  recipient_ids: string[];
  instructions: string[];
  is_to_self: boolean;
}

export interface ISocketParamsSyncEventsAll {
  sender_id: string;
  instructions: string[];
  is_to_self: boolean;
}
