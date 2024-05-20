import { Outlet } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";
import { IGetAccountReq, IGetBalanceReq } from "../types/eventParamTypes";
import TransactionProviderAPI from "../lib/api/TransactionProviderAPI";
import { accountType, nonCustodialType } from "../types/accountTypes";
import { useDispatch, useSelector } from "react-redux";
import { getNonCustodial } from "../features/account/NonCustodialSlice";
import { getAccount } from "../features/account/AccountSlice";
import { AppDispatch } from "../store";
import {
  getMultiWallet,
  refreshBalancesAsync,
} from "../features/wallet/MultiWalletSlice";
import { refreshCurrencyAsync } from "../features/wallet/CurrencySlice";
import { IChain, multiWalletType } from "../types/walletTypes";
import { getChain } from "../features/wallet/ChainSlice";
import { walletType } from "../types/settingTypes";
import { selectWallet, setWallet } from "../features/settings/WalletSlice";

const TransactionProvider = () => {
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const accountStore: accountType = useSelector(getAccount);
  const chainStore: IChain = useSelector(getChain);
  const walletStore: walletType = useSelector(selectWallet);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      nonCustodialStore.mnemonic !== "" &&
      nonCustodialStore.password !== ""
    ) {
      dispatch(
        refreshBalancesAsync({
          _multiWalletStore: multiWalletStore,
          _accountStore: accountStore,
        })
      ).then(() => {
        dispatch(refreshCurrencyAsync()).then(() => {});
      });
    }
  }, [nonCustodialStore.mnemonic, nonCustodialStore.password]);

  useEffect(() => {
    if (chainStore.chain.symbol === "SXP") {
      dispatch(
        setWallet({
          ...walletStore,
          status: "minimum",
          fee: "0.0183",
        })
      );
    } else if (chainStore.chain.symbol === "BTC") {
      dispatch(
        setWallet({
          ...walletStore,
          status: "minimum",
          fee: "7.5",
        })
      );
    }
  }, [chainStore]);

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

    return () => {
      unlisten_get_account.then((unlistenFn) => unlistenFn());
      unlisten_get_balance.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
