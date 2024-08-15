export interface INotificationParams {
  status: string; // failed, success
  title: string;
  message: string;
  link: string;
  translate: boolean;
}

export interface INotificationGameDownloadParams {
  status: string; //started, finished, cancelled, failed
  id: string;
}
