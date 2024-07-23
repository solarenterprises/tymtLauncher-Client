import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listen } from "@tauri-apps/api/event";
import { emit } from "@tauri-apps/api/event";

import tymtCore from "../lib/core/tymtCore";

import TransactionProviderAPI from "../lib/api/TransactionProviderAPI";

import { AppDispatch } from "../store";
import { getNonCustodial } from "../features/account/NonCustodialSlice";
import { getChain } from "../features/wallet/ChainSlice";
import { selectWallet, setWallet } from "../features/settings/WalletSlice";
import { getSaltToken } from "../features/account/SaltTokenSlice";
import { getMultiWallet } from "../features/wallet/MultiWalletSlice";
import { getMnemonic } from "../features/account/MnemonicSlice";

import { walletType } from "../types/settingTypes";
import { IMnemonic, ISaltToken, nonCustodialType } from "../types/accountTypes";
import { IGetAccountReq, IGetBalanceReq, ISendContractReq, ISignMessageReq, IVerifyMessageReq } from "../types/eventParamTypes";
import { IChain, multiWalletType } from "../types/walletTypes";

const TransactionProvider = () => {
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const chainStore: IChain = useSelector(getChain);
  const walletStore: walletType = useSelector(selectWallet);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const mnemonicStore: IMnemonic = useSelector(getMnemonic);
  const dispatch = useDispatch<AppDispatch>();

  const chainStoreRef = useRef(chainStore);
  const walletStoreRef = useRef(walletStore);
  const nonCustodialStoreRef = useRef(nonCustodialStore);
  const saltTokenStoreRef = useRef(saltTokenStore);
  const mnemonicStoreRef = useRef(mnemonicStore);
  const multiWalletStoreRef = useRef(multiWalletStore);

  useEffect(() => {
    chainStoreRef.current = chainStore;
  }, [chainStore]);
  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);
  useEffect(() => {
    nonCustodialStoreRef.current = nonCustodialStore;
  }, [nonCustodialStore]);
  useEffect(() => {
    saltTokenStoreRef.current = saltTokenStore;
  }, [saltTokenStore]);
  useEffect(() => {
    mnemonicStoreRef.current = mnemonicStore;
  }, [mnemonicStore]);
  useEffect(() => {
    multiWalletStoreRef.current = multiWalletStore;
  }, [multiWalletStore]);

  useEffect(() => {
    if (chainStoreRef.current.chain.symbol === "SXP") {
      dispatch(
        setWallet({
          ...walletStoreRef.current,
          status: "minimum",
          fee: "0.0183",
        })
      );
    } else if (chainStoreRef.current.chain.symbol === "BTC") {
      dispatch(
        setWallet({
          ...walletStoreRef.current,
          status: "minimum",
          fee: "7.5",
        })
      );
    }
  }, [chainStoreRef.current]);

  useEffect(() => {
    const unlisten_get_account = listen("POST-/get-account", async (event) => {
      const json_data: IGetAccountReq = JSON.parse(event.payload as string);
      let res: string = await TransactionProviderAPI.getAccount(json_data);
      emit("res-POST-/get-account", res);
    });

    const unlisten_get_balance = listen("POST-/get-balance", async (event) => {
      const json_data: IGetBalanceReq = JSON.parse(event.payload as string);
      let bal: number = await TransactionProviderAPI.getBalance(json_data);
      emit("res-POST-/get-balance", bal);
    });

    const unlisten_validate_token = listen("validate-token", async (event) => {
      const token: string = event.payload as string;
      if (!mnemonicStoreRef.current.mnemonic || !token || token !== saltTokenStoreRef.current.token) {
        emit("res-validate-token", false);
        return;
      }
      const publicKey: string = tymtCore.Blockchains.solar.wallet.getPublicKey(mnemonicStoreRef.current.mnemonic);
      const res: boolean = tymtCore.Blockchains.solar.wallet.verifyToken(saltTokenStoreRef.current.salt, publicKey, token);
      emit("res-validate-token", res);
    });

    const unlisten_sign_message = listen("POST-/sign-message", async (event) => {
      const data: ISignMessageReq = JSON.parse(event.payload as string);
      const res = await TransactionProviderAPI.signMessage(data);
      emit("res-POST-/sign-message", res);
    });

    const unlisten_verify_message = listen("POST-/verify-message", async (event) => {
      const data: IVerifyMessageReq = JSON.parse(event.payload as string);
      const res = await TransactionProviderAPI.verifyMessage(data);
      emit("res-POST-/verify-message", res);
    });

    const unlisten_send_contract = listen("POST-/send-contract", async (event) => {
      const data: ISendContractReq = JSON.parse(event.payload as string);
      const res = await TransactionProviderAPI.sendContract(data);
      emit("res-POST-/send-contract", res);
    });

    return () => {
      unlisten_get_account.then((unlistenFn) => unlistenFn());
      unlisten_get_balance.then((unlistenFn) => unlistenFn());
      unlisten_validate_token.then((unlistenFn) => unlistenFn());
      unlisten_sign_message.then((unlistenFn) => unlistenFn());
      unlisten_verify_message.then((unlistenFn) => unlistenFn());
      unlisten_send_contract.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
