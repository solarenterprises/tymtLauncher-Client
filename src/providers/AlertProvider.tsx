import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../store";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";
import { fetchBlockListAsync } from "../features/chat/BlockListSlice";
import { getMultiWallet, refreshBalancesAsync } from "../features/wallet/MultiWalletSlice";
import { refreshCurrencyAsync } from "../features/wallet/CurrencySlice";
import { multiWalletType } from "../types/walletTypes";

const AlertProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const walletStore: multiWalletType = useSelector(getMultiWallet);

  const walletStoreRef = useRef(walletStore);

  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (accountStore.isLoggedIn) {
      dispatch(fetchContactListAsync());
      dispatch(fetchFriendListAsync());
      dispatch(fetchBlockListAsync());

      if (!id) {
        id = setInterval(async () => {
          dispatch(
            refreshBalancesAsync({
              _multiWalletStore: walletStoreRef.current,
            })
          ).then(() => dispatch(refreshCurrencyAsync()));
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
