export interface propsType {
  view: string;
  setView: (panel: string) => void;
}

export interface propsChatType {
  viewChat: boolean;
  setViewChat: (param: boolean) => void;
}

export interface chatwindowType {
  mode: string;
}

export interface userType {
  onlineStatus: boolean;
  _id: string;
  nickName: string;
  lang: string;
  sxpAddress: string;
  avatar: string;
  notificationStatus: string;
}

export interface ChatMessageType {
  sender_id: string;
  recipient_id: string;
  room_id: string;
  message: string;
  timestamp: number;
  createdAt: number;
  updatedAt: number;
}

export interface ChatHistoryType {
  messages: ChatMessageType[];
}

export interface ChatnotificationType {
  alert: boolean;
  update: boolean;
  sound: boolean;
  unreadmessage: number;
}

export interface ChatMsgType {
  timestamp: number;
  message: string;
  from: string;
  to: string;
}

export interface accesstokenType {
  accesstoken: string;
}

export interface selecteduserType {
  id: string;
}

export interface scrollDownType {
  down: boolean;
}
