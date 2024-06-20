import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../store";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";
import { fetchBlockListAsync } from "../features/chat/BlockListSlice";
import { getMultiWallet, refreshChainBalanceAsync } from "../features/wallet/MultiWalletSlice";
import { refreshCurrencyAsync } from "../features/wallet/CurrencySlice";
import { IChain, multiWalletType } from "../types/walletTypes";
import { getChain } from "../features/wallet/ChainSlice";

const AlertProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const walletStore: multiWalletType = useSelector(getMultiWallet);
  const chainStore: IChain = useSelector(getChain);

  const walletStoreRef = useRef(walletStore);
  const chainStoreRef = useRef(chainStore);

  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);

  useEffect(() => {
    chainStoreRef.current = chainStore;
  }, [chainStore]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (accountStore.isLoggedIn) {
      dispatch(fetchContactListAsync());
      dispatch(fetchFriendListAsync());
      dispatch(fetchBlockListAsync());

      if (!id) {
        id = setInterval(async () => {
          dispatch(
            refreshChainBalanceAsync({
              _multiWalletStore: walletStoreRef.current,
              _chain: chainStoreRef.current.chain.name,
            })
          )
            .then(() =>
              dispatch(refreshCurrencyAsync()).catch((err) => {
                console.error("Failed to refreshCurrencyAsync: ", err);
              })
            )
            .catch((err) => {
              console.error("Failed to refreshChainBalanceAsync: ", err);
            });
        }, 60 * 1e3);
      }
    } else {
      if (id) {
        clearInterval(id);
      }
    }

    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [accountStore]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AlertProvider;
