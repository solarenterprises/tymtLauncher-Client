import { Outlet } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";
import { emit } from "@tauri-apps/api/event";
import { IGetAccountReq, IGetBalanceReq } from "../types/eventParamTypes";
import TransactionProviderAPI from "../lib/api/TransactionProviderAPI";
import { IMnemonic, ISaltToken, nonCustodialType } from "../types/accountTypes";
import { useDispatch, useSelector } from "react-redux";
import { getNonCustodial } from "../features/account/NonCustodialSlice";
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
import { getSaltToken } from "../features/account/SaltTokenSlice";
import tymtCore from "../lib/core/tymtCore";
import { getMnemonic } from "../features/account/MnemonicSlice";

const TransactionProvider = () => {
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const chainStore: IChain = useSelector(getChain);
  const walletStore: walletType = useSelector(selectWallet);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const saltTokenRef = useRef(saltTokenStore);
  const mnemonicStore: IMnemonic = useSelector(getMnemonic);
  const mnemonicRef = useRef(mnemonicStore);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    saltTokenRef.current = saltTokenStore;
  }, [saltTokenStore]);

  useEffect(() => {
    mnemonicRef.current = mnemonicStore;
  }, [mnemonicStore]);

  useEffect(() => {
    if (
      nonCustodialStore.mnemonic !== "" &&
      nonCustodialStore.password !== "" &&
      saltTokenRef.current.token !== ""
    ) {
      dispatch(
        refreshBalancesAsync({
          _multiWalletStore: multiWalletStore,
        })
      ).then(() => {
        dispatch(refreshCurrencyAsync()).then(() => {});
      });
    }
  }, [nonCustodialStore.mnemonic, nonCustodialStore.password, saltTokenStore, mnemonicStore]);

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

    const unlisten_validate_token = listen("validate-token", async (event) => {
      const token: string = event.payload as string;
      const saltTokenStore: ISaltToken = saltTokenRef.current;
      if (
        !mnemonicRef.current.mnemonic ||
        !token ||
        token !== saltTokenStore.token
      ) {
        emit("res-validate-token", false);
        return;
      }
      const publicKey: string =
        await tymtCore.Blockchains.solar.wallet.getPublicKey(
          mnemonicRef.current.mnemonic
        );
      const res: boolean = tymtCore.Blockchains.solar.wallet.verifyMessage(
        saltTokenRef.current.salt,
        publicKey,
        token
      );
      emit("res-validate-token", res);
    });

    return () => {
      unlisten_get_account.then((unlistenFn) => unlistenFn());
      unlisten_get_balance.then((unlistenFn) => unlistenFn());
      unlisten_validate_token.then((unlistenFn) => unlistenFn());
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
