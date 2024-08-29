import { configureStore } from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";

import languageReducer from "./features/settings/LanguageSlice";
import notificationReducer from "./features/settings/NotificationSlice";
import addressReducer from "./features/settings/AddressSlice";

// Auth
import loginReducer from "./features/account/LoginSlice";
import accountReducer from "./features/account/AccountSlice";
import accountListReducer from "./features/account/AccountListSlice";
import TempAccountReducer from "./features/account/TempAccountSlice";
import walletReducer from "./features/wallet/WalletSlice";
import walletListReducer from "./features/wallet/WalletListSlice";
import tempWalletReducer from "./features/wallet/TempWalletSlice";
import myInfoReducer from "./features/account/MyInfoSlice";
import saltTokenReducer from "./features/account/SaltTokenSlice";
import mnemonicReducer from "./features/account/MnemonicSlice";
import machineIdReducer from "./features/account/MachineIdSlice";
import threeConfirmReducer from "./features/account/ThreeConfirmSlice";
// ~ Auth

// Wallet
import currentChainReducer from "./features/wallet/CurrentChainSlice";
import currentTokenReducer from "./features/wallet/CurrentTokenSlice";
import currentCurrencyReducer from "./features/wallet/CurrentCurrencySlice";
import currencyListReducer from "./features/wallet/CurrencyListSlice";
import priceListReducer from "./features/wallet/PriceListSlice";
import balanceListReducer from "./features/wallet/BalanceListSlice";
import transactionListReducer from "./features/wallet/TransactionListSlice";
import currencyReducer from "./features/wallet/CurrencyListSlice";
import cryptoReducer from "./features/wallet/CryptoSlice";
// ~ Wallet

// Setting
import walletSettingReducer from "./features/settings/WalletSettingSlice";
// ~ Setting

import navigationReducer from "./features/home/Navigation";
import tymtlogoReducer from "./features/home/Tymtlogo";
import tymtReducer from "./features/account/TymtSlice";
import d53PasswordReducer from "./features/wallet/D53PasswordSlice";
import tempD53PasswordReducer from "./features/wallet/TempD53PasswordSlice";

// Chat
import socketHashReducer from "./features/chat/SocketHashSlice";
import chatmountedReducer from "./features/chat/IntercomSupportSlice";
import friendListReducer from "./features/chat/FriendListSlice";
import contactListReducer from "./features/chat/ContactListSlice";
import blockListReducer from "./features/chat/BlockListSlice";
import chatroomListReducer from "./features/chat/ChatroomListSlice";
import globalChatroomListReducer from "./features/chat/GlobalChatroomListSlice";
import publicChatroomListReducer from "./features/chat/PublicChatroomListSlice";
import chatHistoryReducer from "./features/chat/ChatHistorySlice";
import chatReducer from "./features/settings/ChatSlice";
import alertListReducer from "./features/alert/AlertListSlice";
import rsaReducer from "./features/chat/RsaSlice";
import currentChatroomReducer from "./features/chat/CurrentChatroomSlice";
import currentChatroomMembersReducer from "./features/chat/CurrentChatroomMembersSlice";
import sKeyListReducer from "./features/chat/SKeyListSlice";
import activeUserListReducer from "./features/chat/ActiveUserListSlice";
import mutedListReducer from "./features/chat/MutedListSlice";
import unreadMessageListReducer from "./features/chat/UnreadMessageListSlice";
import renderTimeReducer from "./features/account/RenderTimeSlice";
import adminListReducer from "./features/chat/AdminListSlice";
import historicalChatroomMembersReducer from "./features/chat/HistoricalChatroomMembersSlice";
// ~ Chat

// SDK
import gameListReducer from "./features/store/GameListSlice";
import comingGameListReducer from "./features/store/ComingGameListSlice";
import removeStatusReducer from "./features/home/RemoveStatusSlice";
import downloadStatusReducer from "./features/home/DownloadStatusSlice";
import installStatusReducer from "./features/home/InstallStatusSlice";
import librarymodeReducer from "./features/library/Librarymode";
import gameoverviewReducer from "./features/store/Gameview";
// ~ SDK

const blacklistActionTypes = ["intercomsupport/setChatMounted", "intercomsupport/setMountedTrue", "intercomsupport/setMountedFalse"];

const stateSyncConfig = {
  blacklist: blacklistActionTypes,
};

const stateSyncMiddleware = createStateSyncMiddleware(stateSyncConfig);

const store = configureStore({
  reducer: {
    language: languageReducer,
    notification: notificationReducer,
    address: addressReducer,
    chat: chatReducer,

    // Auth
    login: loginReducer,
    account: accountReducer,
    accountList: accountListReducer,
    tempAccount: TempAccountReducer,
    wallet: walletReducer,
    walletList: walletListReducer,
    tempWallet: tempWalletReducer,
    threeConfirm: threeConfirmReducer,
    mnemonic: mnemonicReducer,
    saltToken: saltTokenReducer,
    rsa: rsaReducer,
    machineId: machineIdReducer,
    socketHash: socketHashReducer,
    myInfo: myInfoReducer,
    // ~ Auth

    // Wallet
    currentChain: currentChainReducer,
    currentToken: currentTokenReducer,
    currentCurrency: currentCurrencyReducer,
    priceList: priceListReducer,
    balanceList: balanceListReducer,
    currencyList: currencyListReducer,
    transactionList: transactionListReducer,
    crypto: cryptoReducer,
    currency: currencyReducer,
    // ~ Wallet

    // Setting
    walletSetting: walletSettingReducer,
    // ~ Setting

    // Chat
    chatHistory: chatHistoryReducer,
    contactList: contactListReducer,
    friendList: friendListReducer,
    blockList: blockListReducer,
    chatroomList: chatroomListReducer,
    globalChatroomList: globalChatroomListReducer,
    publicChatroomList: publicChatroomListReducer,
    currentChatroom: currentChatroomReducer,
    currentChatroomMembers: currentChatroomMembersReducer,
    sKeyList: sKeyListReducer,
    historicalChatroomMembers: historicalChatroomMembersReducer,
    adminList: adminListReducer,
    mutedList: mutedListReducer,
    alertList: alertListReducer,
    activeUserList: activeUserListReducer,
    unreadMessageList: unreadMessageListReducer,
    // ~ Chat

    // SDK
    gameList: gameListReducer,
    comingGameList: comingGameListReducer,
    removeStatus: removeStatusReducer,
    downloadStatus: downloadStatusReducer,
    installStatus: installStatusReducer,
    librarymode: librarymodeReducer,
    gameoverview: gameoverviewReducer,
    // ~ SDK

    navigation: navigationReducer,
    tymtlogo: tymtlogoReducer,
    tymt: tymtReducer,
    d53Password: d53PasswordReducer,
    tempD53Password: tempD53PasswordReducer,
    chatmounted: chatmountedReducer,
    renderTime: renderTimeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stateSyncMiddleware),
});

initMessageListener(store);

export type AppDispatch = typeof store.dispatch;
export default store;
