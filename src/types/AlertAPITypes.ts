export interface IReqReadMultipleAlerts {
  ids: string[];
}

export interface IReqReadAllUnreadAlertsForChatroom {
  userId: string;
  roomId: string;
}

export interface IReqUnreadAlertsCountForChatroom {
  userId: string;
  roomId: string;
}
