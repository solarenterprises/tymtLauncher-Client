export interface IGetAccountReq {
  chain: string;
  launcher_token: string;
}

export interface IGetBalanceReq {
  chain: string;
  address: string;
  launcher_token: string;
}

export interface ITransfer {
  to: string;
  amount: string;
}

export interface ISendTransactionReq {
  chain: string;
  transfer: ITransfer[];
  note: string;
  memo?: string;
  token?: string;
  launcher_token: string;
}
