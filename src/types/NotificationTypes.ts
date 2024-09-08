import { IGame } from "./GameTypes";

export interface INotificationParams {
  status: string; // failed, success, warning, alert, message
  title: string;
  message: string;
  link: string;
  translate: boolean;
}

export interface INotificationGameDownloadParams {
  status: string; //started, finished, cancelled, failed
  game: IGame;
}

export interface INotificationGameDownloadProgressParams {
  downloaded: number;
  speed: number;
  total_size: number;
}
