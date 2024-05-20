export interface IGetAccountReq {
  chain: string;
}

export interface IGetBalanceReq {
  chain: string;
  address: string;
}

export interface ISendTransactionReq {
  chain: string;
  to: string;
  amount: string;
  note: string;
  memo: string;
}
