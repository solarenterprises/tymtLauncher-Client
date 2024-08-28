export interface propsType {
  view: string;
  setView: (panel: string) => void;
}

export interface propsFeeType {
  status: string;
  setStatus: (status: string) => void;
}

export interface notificationType {
  alert: boolean;
  update: boolean;
  sound: boolean;
  hour: number;
  trigger: boolean;
  alertbadge: boolean;
}

export interface chatType {
  disturb: boolean;
  message: string;
  friend: string;
}
export interface addressType {
  name: string;
  address: string;
}

export interface propsSettingType {
  view: boolean;
  setView: (param: boolean) => void;
}

export interface IWalletSetting {
  refreshed: boolean;
  hidde: boolean;
  currency: string;
  status: string;
  fee: string;
}

export interface languageType {
  language: string;
}
