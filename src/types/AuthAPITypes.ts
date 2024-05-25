export interface INonCustodyBeforeSignInReq {
  sxpAddress: string;
  publicKey: string;
  signature: string;
}

export interface INonCustodyBeforeSignInRes {
  salt: string;
}
