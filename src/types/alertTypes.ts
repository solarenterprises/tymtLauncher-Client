import { IAlert } from "./chatTypes";

export interface propsType {
  view: string;
  setView: (panel: string) => void;
}

export interface propsAlertType {
  viewAlert: boolean;
  setViewAlert: (param: boolean) => void;
}

export interface propsAlertListType {
  status: string;
  title: string;
  detail: IAlert;
  read: string;
}

// export interface alertbadgeType {
//   trigger: boolean;
//   badge: boolean;
// }

export interface IAlertList {
  read: IAlert[];
  unread: IAlert[];
  readCount: number;
  unreadCount: number;
}

export interface IFetchAlertListParam {
  userId: string;
  page: number;
  limit: number;
}

export interface IUpdateFriendRequest {
  alertId: string;
  status: string;
}
