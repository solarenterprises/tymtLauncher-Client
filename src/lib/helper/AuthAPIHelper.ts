import tymtCore from "../core/tymtCore";

import { ChainIDs, ChainNames } from "../../consts/Chains";

import { IAccount, IMachineId } from "../../types/accountTypes";
import { INonCustodyBeforeSignInReq, INonCustodySignInReq, INonCustodySignUpReq } from "../../types/AuthAPITypes";
import { IWallet } from "../../types/walletTypes";

export const getReqBodyNonCustodySignUp = (account: IAccount, wallet: IWallet, mnemonic: string) => {
  try {
    const newPublicKey: string = tymtCore.Blockchains.solar.wallet.getPublicKey(mnemonic);
    const data: INonCustodySignUpReq = {
      nickName: account?.nickName,
      password: account?.password,
      sxpAddress: account?.sxpAddress,
      rsa_pub_key: account?.rsaPubKey,
      publicKey: newPublicKey,
      wallet: [
        {
          chainId: ChainIDs.ETHEREUM,
          chainName: ChainNames.ETHEREUM,
          address: wallet?.ethereum,
        },
        {
          chainId: ChainIDs.BINANCE,
          chainName: ChainNames.BINANCE,
          address: wallet?.binance,
        },
        {
          chainId: ChainIDs.POLYGON,
          chainName: ChainNames.POLYGON,
          address: wallet?.polygon,
        },
        {
          chainId: ChainIDs.ARBITRUM,
          chainName: ChainNames.ARBITRUM,
          address: wallet?.arbitrum,
        },
        {
          chainId: ChainIDs.AVALANCHE,
          chainName: ChainNames.AVALANCHE,
          address: wallet?.avalanche,
        },
        {
          chainId: ChainIDs.SOLANA,
          chainName: ChainNames.SOLANA,
          address: wallet?.solana,
        },
        {
          chainId: ChainIDs.BITCOIN,
          chainName: ChainNames.BITCOIN,
          address: wallet?.bitcoin,
        },
        {
          chainId: ChainIDs.SOLAR,
          chainName: ChainNames.SOLAR,
          address: wallet?.solar,
        },
      ],
    };
    return data;
  } catch (err) {
    console.log("Failed to getBodyNonCustodySignUp: ", err);
  }
};

export const getReqBodyNonCustodySignIn = (account: IAccount, machineId: IMachineId, token: string) => {
  try {
    const data: INonCustodySignInReq = {
      sxpAddress: account?.sxpAddress,
      token: token,
      deviceID: machineId?.machineId,
      rsa_pub_key: account?.rsaPubKey,
    };
    return data;
  } catch (err) {
    console.log("Failed to getReqBodyNonCustodySignIn: ", err);
  }
};

export const getReqBodyNonCustodyBeforeSignIn = (account: IAccount, mnemonic: string) => {
  try {
    const newPublicKey: string = tymtCore.Blockchains.solar.wallet.getPublicKey(mnemonic);
    const newSignature: string = tymtCore.Blockchains.solar.wallet.signMessage("tymt", mnemonic);

    const data: INonCustodyBeforeSignInReq = {
      sxpAddress: account?.sxpAddress,
      publicKey: newPublicKey,
      signature: newSignature,
    };
    return data;
  } catch (err) {
    console.log("Failed to getReqBodyNonCustodyBeforeSignIn: ", err);
  }
};
