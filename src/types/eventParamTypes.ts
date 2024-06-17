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
  requestUserId: string;
  chain: string;
  transfers: ITransfer[];
  note: string;
  memo?: string;
  token?: string;
  status: string;
  transaction: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}
