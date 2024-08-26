import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { AppDispatch } from "../store";

import { getChain } from "../features/wallet/ChainSlice";
import { getMultiWallet, refreshChainBalanceAsync } from "../features/wallet/MultiWalletSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";
import { fetchBlockListAsync } from "../features/chat/BlockListSlice";
import { fetchChatroomListAsync } from "../features/chat/ChatroomListSlice";
import { refreshCurrencyAsync } from "../features/wallet/CurrencySlice";
import { ISKey, setSKeyList } from "../features/chat/SKeyListSlice";
import { fetchMutedListAsync } from "../features/chat/MutedListSlice";
import { getRsa } from "../features/chat/RsaSlice";
import { fetchMyInfoAsync, getMyInfo } from "../features/account/MyInfoSlice";
import { fetchUnreadMessageListAsync } from "../features/chat/UnreadMessageListSlice";
import { fetchAlertListAsync } from "../features/alert/AlertListSlice";
import { fetchAdminListAsync } from "../features/chat/AdminListSlice";
import { fetchGameListAsync } from "../features/store/GameListSlice";
import { fetchComingGameListAsync } from "../features/store/ComingGameListSlice";
import { rsaDecrypt } from "../features/chat/RsaApi";

import { IChain, multiWalletType } from "../types/walletTypes";
import { IChatroom, IParticipant } from "../types/ChatroomAPITypes";
import { IMyInfo, IRsa } from "../types/chatTypes";
import { fetchGlobalChatroomListAsync } from "../features/chat/GlobalChatroomListSlice";
import { fetchPublicChatroomListAsync } from "../features/chat/PublicChatroomListSlice";

const AlertProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const walletStore: multiWalletType = useSelector(getMultiWallet);
  const chainStore: IChain = useSelector(getChain);
  const rsaStore: IRsa = useSelector(getRsa);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const walletStoreRef = useRef(walletStore);
  const chainStoreRef = useRef(chainStore);

  const initAction = useCallback(async () => {
    try {
      console.log("initAction");

      // Fetch all data
      dispatch(fetchMyInfoAsync(myInfoStore?._id));
      dispatch(fetchGameListAsync());
      dispatch(fetchComingGameListAsync());
      dispatch(fetchAdminListAsync(["admin"]));
      dispatch(fetchAlertListAsync(myInfoStore?._id));
      dispatch(fetchContactListAsync());
      dispatch(fetchFriendListAsync());
      dispatch(fetchBlockListAsync());
      dispatch(fetchMutedListAsync());
      dispatch(fetchUnreadMessageListAsync(myInfoStore?._id));
      dispatch(fetchGlobalChatroomListAsync());
      dispatch(fetchPublicChatroomListAsync());
      dispatch(fetchChatroomListAsync(myInfoStore?._id)).then((action) => {
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
              const mySelf: IParticipant = chatroom.participants.find((participant) => participant.userId === myInfoStore?._id);
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
  }, [myInfoStore]);

  useEffect(() => {
    walletStoreRef.current = walletStore;
  }, [walletStore]);

  useEffect(() => {
    chainStoreRef.current = chainStore;
  }, [chainStore]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (false) {
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
  }, [myInfoStore]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AlertProvider;
