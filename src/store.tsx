import { configureStore } from "@reduxjs/toolkit";
import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";

import languageReducer from "./features/settings/LanguageSlice";
import notificationReducer from "./features/settings/NotificationSlice";
import addressReducer from "./features/settings/AddressSlice";
import walletReducer from "./features/settings/WalletSlice";
import accountReducer from "./features/account/AccountSlice";
import nonCustodialReducer from "./features/account/NonCustodialSlice";
import custodialReducer from "./features/account/CustodialSlice";
import tempNonCustodialReducer from "./features/account/TempNonCustodialSlice";
import tempCustodialReducer from "./features/account/TempCustodialSlice";
import threeConfirmReducer from "./features/account/ThreeConfirmSlice";
import chainReducer from "./features/wallet/ChainSlice";
import multiWalletReducer from "./features/wallet/MultiWalletSlice";
import tempMultiWalletReducer from "./features/wallet/TempMultiWalletSlice";
import navigationReducer from "./features/home/Navigation";
import tymtlogoReducer from "./features/home/Tymtlogo";
import librarymodeReducer from "./features/library/Librarymode";
import cryptoReducer from "./features/wallet/CryptoSlice";
import gameoverviewReducer from "./features/store/Gameview";
import tymtReducer from "./features/account/TymtSlice";
import d53PasswordReducer from "./features/wallet/D53PasswordSlice";
import tempD53PasswordReducer from "./features/wallet/TempD53PasswordSlice";
import currencyReducer from "./features/wallet/CurrencySlice";
import scrolldownReducer from "./features/chat/Chat-scrollDownSlice";
import machineIdReducer from "./features/account/MachineIdSlice";
import mnemonicReducer from "./features/account/MnemonicSlice";
import saltTokenReducer from "./features/account/SaltTokenSlice";
import downloadStatusReducer from "./features/home/DownloadStatusSlice";
import installStatusReducer from "./features/home/InstallStatusSlice";

// chat
import socketHashReducer from "./features/chat/SocketHashSlice";
import chatmountedReducer from "./features/chat/Chat-intercomSupportSlice";
import chathistoryperUserReducer from "./features/chat/Chat-historyperUserSlice";
import friendListReducer from "./features/chat/FriendListSlice";
import contactListReducer from "./features/chat/ContactListSlice";
import blockListReducer from "./features/chat/BlockListSlice";
import encryptionReducer from "./features/chat/Chat-encryptionkeySlice";
import currentPartnerReducer from "./features/chat/CurrentPartnerSlice";
import chatHistoryReducer from "./features/chat/Chat-historySlice";
import selecteduserReducer from "./features/chat/Chat-selecteduserSlice";
import chatnotificationReducer from "./features/chat/Chat-notificationSlice";
import alertReducer from "./features/chat/Chat-alertSlice";
import chatReducer from "./features/settings/ChatSlice";
import alertListReducer from "./features/alert/AlertListSlice";

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
    account: accountReducer,
    custodial: custodialReducer,
    nonCustodial: nonCustodialReducer,
    tempNonCustodial: tempNonCustodialReducer,
    tempCustodial: tempCustodialReducer,
    threeConfirm: threeConfirmReducer,
    wallet: walletReducer,
    currentPartner: currentPartnerReducer,
    chatHistory: chatHistoryReducer,
    contactList: contactListReducer,
    chain: chainReducer,
    multiWallet: multiWalletReducer,
    tempMultiWallet: tempMultiWalletReducer,
    navigation: navigationReducer,
    tymtlogo: tymtlogoReducer,
    librarymode: librarymodeReducer,
    chatnotification: chatnotificationReducer,
    crypto: cryptoReducer,
    downloadStatus: downloadStatusReducer,
    installStatus: installStatusReducer,
    gameoverview: gameoverviewReducer,
    selecteduser: selecteduserReducer,
    tymt: tymtReducer,
    alert: alertReducer,
    d53Password: d53PasswordReducer,
    tempD53Password: tempD53PasswordReducer,
    currency: currencyReducer,
    scrolldown: scrolldownReducer,
    friendList: friendListReducer,
    blockList: blockListReducer,
    encryption: encryptionReducer,
    machineId: machineIdReducer,
    socketHash: socketHashReducer,
    chatmounted: chatmountedReducer,
    chathistoryperUser: chathistoryperUserReducer,
    mnemonic: mnemonicReducer,
    saltToken: saltTokenReducer,
    alertList: alertListReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stateSyncMiddleware),
});

initMessageListener(store);

export type AppDispatch = typeof store.dispatch;
export default store;
