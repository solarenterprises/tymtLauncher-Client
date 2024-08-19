import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { AppDispatch } from "../store";

import { getChain } from "../features/wallet/ChainSlice";
import { getAccount } from "../features/account/AccountSlice";
import { getMultiWallet, refreshChainBalanceAsync } from "../features/wallet/MultiWalletSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";
import { fetchBlockListAsync } from "../features/chat/BlockListSlice";
import { fetchChatroomListAsync } from "../features/chat/ChatroomListSlice";
import { refreshCurrencyAsync } from "../features/wallet/CurrencySlice";
import { ISKey, setSKeyList } from "../features/chat/SKeyListSlice";
import { fetchMutedListAsync } from "../features/chat/MutedListSlice";
import { getRsa } from "../features/chat/RsaSlice";
import { fetchMyInfoAsync } from "../features/account/MyInfoSlice";
import { fetchUnreadMessageListAsync } from "../features/chat/UnreadMessageListSlice";
import { fetchAlertListAsync } from "../features/alert/AlertListSlice";
import { fetchAdminListAsync } from "../features/chat/AdminListSlice";
import { fetchGameListAsync } from "../features/store/GameListSlice";
import { fetchComingGameListAsync } from "../features/store/ComingGameListSlice";
import { rsaDecrypt } from "../features/chat/RsaApi";

import { accountType } from "../types/accountTypes";
import { IChain, multiWalletType } from "../types/walletTypes";
import { IChatroom, IParticipant } from "../types/ChatroomAPITypes";
import { IRsa } from "../types/chatTypes";

const AlertProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const walletStore: multiWalletType = useSelector(getMultiWallet);
  const chainStore: IChain = useSelector(getChain);
  const rsaStore: IRsa = useSelector(getRsa);

  const walletStoreRef = useRef(walletStore);
  const chainStoreRef = useRef(chainStore);

  const initAction = useCallback(async () => {
    try {
      console.log("initAction");

      // Fetch all data
      dispatch(fetchMyInfoAsync(accountStore.uid));
      dispatch(fetchGameListAsync());
      dispatch(fetchComingGameListAsync());
      dispatch(fetchAdminListAsync(["admin"]));
      dispatch(fetchAlertListAsync(accountStore.uid));
      dispatch(fetchContactListAsync());
      dispatch(fetchFriendListAsync());
      dispatch(fetchBlockListAsync());
      dispatch(fetchMutedListAsync());
      dispatch(fetchUnreadMessageListAsync(accountStore?.uid));
      dispatch(fetchChatroomListAsync(accountStore?.uid)).then((action) => {
        try {
          if (action.type.endsWith("/fulfilled")) {
            const newChatroomList = action.payload as IChatroom[];

            const newSKeyArray = newChatroomList.map((chatroom) => {
              if (chatroom.isGlobal) {
                return {
                  roomId: chatroom._id,
                  sKey: "",
                };
              }
              const mySelf: IParticipant = chatroom.participants.find((participant) => participant.userId === accountStore.uid);
              const sKey: ISKey = {
                roomId: chatroom._id,
                sKey: rsaDecrypt(mySelf.userKey, rsaStore.privateKey),
              };
              return sKey;
            });
            dispatch(setSKeyList(newSKeyArray));
          }
        } catch (err) {
          console.error("Failed to newSKeyArray: ", err);
        }
      });
    } catch (err) {
      console.error("Failed to initAction: ", err);
    }
  }, [accountStore]);

  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);

  useEffect(() => {
    chainStoreRef.current = chainStore;
  }, [chainStore]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (accountStore.isLoggedIn) {
      initAction();

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
