import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import MoneyReceivedSnackbar from "../components/snackbars/MoneyReceivedSnackbar";
import GuestCompleteSnackbar from "../components/snackbars/GuestCompleteSnackbar";

import { AppDispatch } from "../store";
import { fetchGlobalChatroomListAsync } from "../features/chat/GlobalChatroomListSlice";
import { fetchPublicChatroomListAsync } from "../features/chat/PublicChatroomListSlice";
import { fetchBalanceListAsync } from "../features/wallet/BalanceListSlice";
import { fetchPriceListAsync } from "../features/wallet/PriceListSlice";
import { fetchCurrencyListAsync } from "../features/wallet/CurrencyListSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";
import { fetchBlockListAsync } from "../features/chat/BlockListSlice";
import { fetchChatroomListAsync } from "../features/chat/ChatroomListSlice";
import { ISKey, setSKeyList } from "../features/chat/SKeyListSlice";
import { fetchMutedListAsync } from "../features/chat/MutedListSlice";
import { getRsa } from "../features/chat/RsaSlice";
import { fetchMyInfoAsync, getMyInfo } from "../features/account/MyInfoSlice";
import { fetchUnreadMessageListAsync } from "../features/chat/UnreadMessageListSlice";
import { fetchAlertListAsync } from "../features/alert/AlertListSlice";
import { fetchAdminListAsync } from "../features/chat/AdminListSlice";
import { fetchAllGameListAsync } from "../features/store/GameListSlice";
// import { fetchAllComingGameListAsync } from "../features/store/ComingGameListSlice";
import { getWallet } from "../features/wallet/WalletSlice";
import { getCurrentChain } from "../features/wallet/CurrentChainSlice";
import { fetchTransactionListAsync } from "../features/wallet/TransactionListSlice";
import { getLogin } from "../features/account/LoginSlice";
import { getAccount } from "../features/account/AccountSlice";

import { rsaDecrypt } from "../features/chat/RsaApi";

import { getNativeSymbolByChainName } from "../lib/helper/WalletHelper";

import { IChatroom, IParticipant } from "../types/ChatroomAPITypes";
import { IMyInfo, IRsa } from "../types/chatTypes";
import { ICurrentChain, IWallet } from "../types/walletTypes";
import { IAccount, ILogin } from "../types/accountTypes";
import FirstFundModal from "../components/modals/FirstFundModal";
import { useSocket } from "./SocketProvider";

const AlertProvider = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const rsaStore: IRsa = useSelector(getRsa);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);
  const walletStore: IWallet = useSelector(getWallet);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const loginStore: ILogin = useSelector(getLogin);
  const accountStore: IAccount = useSelector(getAccount);

  const getSKeyArray = (chatroomArray: IChatroom[]) => {
    const newSKeyArray: ISKey[] = chatroomArray?.map((chatroom) => {
      if (chatroom?.isGlobal) {
        return {
          roomId: chatroom?._id,
          sKey: "",
        };
      }
      const mySelf: IParticipant = chatroom?.participants?.find((participant) => participant?.userId === myInfoStore?._id);
      const sKey: ISKey = {
        roomId: chatroom._id,
        sKey: rsaDecrypt(mySelf?.userKey, rsaStore?.privateKey),
      };
      return sKey;
    });
    return newSKeyArray;
  };

  const timerAction = useCallback(async () => {
    try {
      // Wallet
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
      // ~ Wallet

      // SDK
      dispatch(fetchAllGameListAsync({ socket, userId: myInfoStore?._id }));
      // dispatch(fetchAllComingGameListAsync());
      // ~ SDK

      // Chat
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
            const newSKeyArray = getSKeyArray(newChatroomList);
            dispatch(setSKeyList(newSKeyArray));
          }
        } catch (err) {
          console.error("Failed to newSKeyArray: ", err);
        }
      });
      // ~ Chat
    } catch (err) {
      console.log("Failed to timerAction: ", err);
    }
  }, [walletStore, currentChainStore, myInfoStore]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (loginStore?.isLoggedIn) {
      timerAction();
      intervalId = setInterval(() => {
        timerAction();
      }, 120 * 1e3);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loginStore]);

  useEffect(() => {
    dispatch(fetchMyInfoAsync(accountStore?.uid));
  }, [accountStore]);

  return (
    <>
      <Outlet />
      <GuestCompleteSnackbar />
      <MoneyReceivedSnackbar />
      <FirstFundModal />
    </>
  );
};

export default AlertProvider;
