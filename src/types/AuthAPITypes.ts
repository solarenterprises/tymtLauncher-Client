export interface INonCustodyBeforeSignInReq {
  sxpAddress: string;
  publicKey: string;
  signature: string;
}

export interface INonCustodyBeforeSignInRes {
  salt: string;
}

export interface INonCustodySignInReq {
  sxpAddress: string;
  token: string;
  deviceID: string;
  rsa_pub_key: string;
}

export interface INonCustodySignUpReqWallet {
  chainId: Number;
  chainName: string;
  address: string;
}

export interface INonCustodySignUpReq {
  nickName: string;
  password: string;
  sxpAddress: string;
  publicKey: string;
  wallet: INonCustodySignUpReqWallet[];
  rsa_pub_key: string;
}
