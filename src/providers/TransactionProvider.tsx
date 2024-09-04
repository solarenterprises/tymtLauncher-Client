import { useCallback, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { listen } from "@tauri-apps/api/event";
import { emit } from "@tauri-apps/api/event";

import tymtCore from "../lib/core/tymtCore";

import TransactionProviderAPI from "../lib/api/TransactionProviderAPI";

import { AppDispatch } from "../store";
import { getSaltToken } from "../features/account/SaltTokenSlice";
import { getMnemonic } from "../features/account/MnemonicSlice";
import { getWallet, setWallet } from "../features/wallet/WalletSlice";
import { getAccount, setAccount } from "../features/account/AccountSlice";
import { getWalletList } from "../features/wallet/WalletListSlice";
import { getCurrentChain } from "../features/wallet/CurrentChainSlice";
import { getCurrentToken, setCurrentToken } from "../features/wallet/CurrentTokenSlice";
import { fetchBalanceListAsync } from "../features/wallet/BalanceListSlice";
import { fetchPriceListAsync } from "../features/wallet/PriceListSlice";
import { fetchCurrencyListAsync } from "../features/wallet/CurrencyListSlice";
import { getNativeSymbolByChainName } from "../lib/helper/WalletHelper";
import { fetchTransactionListAsync } from "../features/wallet/TransactionListSlice";
import { getAccountList, setAccountList } from "../features/account/AccountListSlice";

import { IAccount, IAccountList, IMnemonic, ISaltToken } from "../types/accountTypes";
import { IGetAccountReq, IGetBalanceReq, ISendContractReq, ISignMessageReq, IVerifyMessageReq } from "../types/eventParamTypes";
import { ICurrentChain, ICurrentToken, IWallet, IWalletList } from "../types/walletTypes";
import { setLogin } from "../features/account/LoginSlice";
import { fetchAccountListAvatar } from "../features/account/AccountApi";

const TransactionProvider = () => {
  const dispatch = useDispatch<AppDispatch>();

  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const mnemonicStore: IMnemonic = useSelector(getMnemonic);
  const walletListStore: IWalletList = useSelector(getWalletList);
  const accountStore: IAccount = useSelector(getAccount);
  const accountListStore: IAccountList = useSelector(getAccountList);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const currentTokenStore: ICurrentToken = useSelector(getCurrentToken);
  const walletStore: IWallet = useSelector(getWallet);

  const saltTokenStoreRef = useRef(saltTokenStore);
  const mnemonicStoreRef = useRef(mnemonicStore);

  useEffect(() => {
    saltTokenStoreRef.current = saltTokenStore;
  }, [saltTokenStore]);
  useEffect(() => {
    mnemonicStoreRef.current = mnemonicStore;
  }, [mnemonicStore]);

  useEffect(() => {
    const newWallet: IWallet = walletListStore?.list?.find((one) => one?.solar === accountStore?.sxpAddress);
    if (!newWallet) return;
    dispatch(setWallet(newWallet));
    dispatch(setLogin(false));
  }, [accountStore, walletListStore]);

  useEffect(() => {
    console.log("currentChainStore has been changed!");
    dispatch(setCurrentToken(getNativeSymbolByChainName(currentChainStore?.chain)));
    dispatch(fetchBalanceListAsync(walletStore));
    dispatch(fetchPriceListAsync());
    dispatch(fetchCurrencyListAsync());
    dispatch(
      fetchTransactionListAsync({
        walletStore: walletStore,
        chainName: currentChainStore?.chain,
        tokenSymbol: getNativeSymbolByChainName(currentChainStore?.chain),
        page: 1,
      })
    );
  }, [currentChainStore]);

  useEffect(() => {
    console.log("currentTokenStore has been changed!");
    dispatch(
      fetchTransactionListAsync({
        walletStore: walletStore,
        chainName: currentChainStore?.chain,
        tokenSymbol: currentTokenStore?.token,
        page: 1,
      })
    );
  }, [currentTokenStore]);

  const refreshAccountListAvatar = useCallback(async () => {
    try {
      console.log("refreshAccountListAvatar");
      const newAccountList = await fetchAccountListAvatar(accountListStore);
      dispatch(setAccountList(newAccountList));
    } catch (err) {
      console.log("Failed to refreshAccountListAvatar: ", err);
    }
  }, [accountListStore]);

  useEffect(() => {
    refreshAccountListAvatar();
  }, [accountListStore?.list?.length]);

  useEffect(() => {
    const newAccount = accountListStore?.list?.find((one) => one?.uid === accountStore?.uid);
    if (!newAccount && accountListStore?.list?.length > 0) {
      dispatch(setAccount(accountListStore?.list[0]));
      return;
    }
    dispatch(setAccount(newAccount));
  }, [accountListStore]);

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
