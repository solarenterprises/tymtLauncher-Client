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

export interface ISignMessageReq {
  message: string;
  chain: string;
}

export interface IVerifyMessageReq {
  message: string;
  signature: string;
  chain: string;
}

// Define the IAbiInput interface
export interface IAbiInput {
  internalType: string;
  name: string;
  type: string;
}

// Define the IAbiOutput interface
export interface IAbiOutput {
  internalType: string;
  name: string;
  type: string;
}

// Define the IAbiFunction interface
export interface IAbiFunction {
  inputs: IAbiInput[];
  name: string;
  outputs: IAbiOutput[];
  stateMutability: string;
  type: string;
}

// Define the ISendContractReq interface
export interface ISendContractReq {
  contract_address: string;
  function_name: string;
  method_type: "read" | "write";
  params: string[];
  abi: IAbiFunction[];
  chain: string;
}
