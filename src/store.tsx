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
// ~ Auth

// Wallet
import currentChainReducer from "./features/wallet/CurrentChainSlice";
import currentTokenReducer from "./features/wallet/CurrentTokenSlice";
import currentCurrencyReducer from "./features/wallet/CurrentCurrencySlice";
import currencyListReducer from "./features/wallet/CurrencyListSlice";
import priceListReducer from "./features/wallet/PriceListSlice";
import balanceListReducer from "./features/wallet/BalanceListSlice";
// ~ Wallet

// Setting
import walletSettingReducer from "./features/settings/WalletSettingSlice";
// ~ Setting

import nonCustodialReducer from "./features/account/NonCustodialSlice";
import custodialReducer from "./features/account/CustodialSlice";
import tempNonCustodialReducer from "./features/account/TempNonCustodialSlice";
import tempCustodialReducer from "./features/account/TempCustodialSlice";
import threeConfirmReducer from "./features/account/ThreeConfirmSlice";
import navigationReducer from "./features/home/Navigation";
import tymtlogoReducer from "./features/home/Tymtlogo";
import librarymodeReducer from "./features/library/Librarymode";
import cryptoReducer from "./features/wallet/CryptoSlice";
import gameoverviewReducer from "./features/store/Gameview";
import tymtReducer from "./features/account/TymtSlice";
import d53PasswordReducer from "./features/wallet/D53PasswordSlice";
import tempD53PasswordReducer from "./features/wallet/TempD53PasswordSlice";
import currencyReducer from "./features/wallet/CurrencyListSlice";
import machineIdReducer from "./features/account/MachineIdSlice";
import mnemonicReducer from "./features/account/MnemonicSlice";
import saltTokenReducer from "./features/account/SaltTokenSlice";
import downloadStatusReducer from "./features/home/DownloadStatusSlice";
import installStatusReducer from "./features/home/InstallStatusSlice";

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
    // ~ Auth

    // Wallet
    currentChain: currentChainReducer,
    currentToken: currentTokenReducer,
    currentCurrency: currentCurrencyReducer,
    priceList: priceListReducer,
    balanceList: balanceListReducer,
    currencyList: currencyListReducer,
    // ~ Wallet

    // Setting
    walletSetting: walletSettingReducer,
    // ~ Setting

    custodial: custodialReducer,
    nonCustodial: nonCustodialReducer,
    tempNonCustodial: tempNonCustodialReducer,
    tempCustodial: tempCustodialReducer,
    threeConfirm: threeConfirmReducer,
    chatHistory: chatHistoryReducer,
    contactList: contactListReducer,
    navigation: navigationReducer,
    tymtlogo: tymtlogoReducer,
    librarymode: librarymodeReducer,
    crypto: cryptoReducer,
    downloadStatus: downloadStatusReducer,
    installStatus: installStatusReducer,
    gameoverview: gameoverviewReducer,
    tymt: tymtReducer,
    d53Password: d53PasswordReducer,
    tempD53Password: tempD53PasswordReducer,
    currency: currencyReducer,
    friendList: friendListReducer,
    blockList: blockListReducer,
    chatroomList: chatroomListReducer,
    globalChatroomList: globalChatroomListReducer,
    publicChatroomList: publicChatroomListReducer,
    machineId: machineIdReducer,
    socketHash: socketHashReducer,
    chatmounted: chatmountedReducer,
    mnemonic: mnemonicReducer,
    saltToken: saltTokenReducer,
    alertList: alertListReducer,
    rsa: rsaReducer,
    currentChatroom: currentChatroomReducer,
    currentChatroomMembers: currentChatroomMembersReducer,
    sKeyList: sKeyListReducer,
    activeUserList: activeUserListReducer,
    mutedList: mutedListReducer,
    myInfo: myInfoReducer,
    unreadMessageList: unreadMessageListReducer,
    renderTime: renderTimeReducer,
    adminList: adminListReducer,
    historicalChatroomMembers: historicalChatroomMembersReducer,
    gameList: gameListReducer,
    comingGameList: comingGameListReducer,
    removeStatus: removeStatusReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stateSyncMiddleware),
});

initMessageListener(store);

export type AppDispatch = typeof store.dispatch;
export default store;
