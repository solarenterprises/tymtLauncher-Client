export enum loginEnum {
  "signup",
  "login",
  "reset",
  "import",
}

export enum walletEnum {
  "noncustodial",
  "custodial",
}

export interface ILogin {
  isLoggedIn: boolean;
}

export interface IAccount {
  avatar: string;
  nickName: string;
  password: string;
  sxpAddress: string;
  mnemonic: string;
  rsaPubKey: string;
}

export interface IAccountList {
  list: IAccount[];
}

export interface nonCustodialType {
  mnemonic: string;
  mnemonicLength: number;
  avatar: string;
  nickname: string;
  password: string;
}

export interface custodialType {
  email: string;
  password: string;
  avatar: string;
  nickname: string;
}

export interface threeConfirmType {
  first: string;
  second: string;
  third: string;
  focus: number;
}

export interface oauthModalType {
  title: string;
  src: any;
  open: boolean;
  setOpen: (status: boolean) => void;
}

export interface connectModalType {
  coin: any;
  title: string;
  src: any;
  open: boolean;
  setOpen: (status: boolean) => void;
}

export interface ITymt {
  version: string;
}

export interface IMachineId {
  machineId: string;
}

export interface IMnemonic {
  mnemonic: string;
}

export interface ISaltToken {
  salt: string;
  token: string;
}
