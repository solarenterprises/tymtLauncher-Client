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
  detail: string;
}
