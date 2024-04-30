import { configureStore } from "@reduxjs/toolkit";

import languageReducer from "./features/settings/LanguageSlice";
import notificationReducer from "./features/settings/NotificationSlice";
import addressReducer from "./features/settings/AddressSlice";
import chatReducer from "./features/settings/ChatSlice";
import walletReducer from "./features/settings/WalletSlice";
import accountReducer from "./features/account/AccountSlice";
import nonCustodialReducer from "./features/account/NonCustodialSlice";
import custodialReducer from "./features/account/CustodialSlice";
import tempNonCustodialReducer from "./features/account/TempNonCustodialSlice";
import tempCustodialReducer from "./features/account/TempCustodialSlice";
import threeConfirmReducer from "./features/account/ThreeConfirmSlice";
import currentPartnerReducer from "./features/chat/Chat-currentPartnerSlice";
import chatHistoryReducer from "./features/chat/Chat-historySlice";
import chatuserlistReducer from "./features/chat/Chat-userlistSlice";
import chainReducer from "./features/wallet/ChainSlice";
import multiWalletReducer from "./features/wallet/MultiWalletSlice";
import tempMultiWalletReducer from "./features/wallet/TempMultiWalletSlice";
import navigationReducer from "./features/home/Navigation";
import tymtlogoReducer from "./features/home/Tymtlogo";
import librarymodeReducer from "./features/library/Librarymode";
import chatnotificationReducer from "./features/chat/Chat-notificationSlice";
import cryptoReducer from "./features/wallet/CryptoSlice";
import gameoverviewReducer from "./features/store/Gameview";
import installprocessReducer from "./features/home/InstallprocessSlice";
import selecteduserReducer from "./features/chat/Chat-selecteduserSlice";
import tymtReducer from "./features/account/TymtSlice";
import alertReducer from "./features/chat/Chat-alertSlice";
import d53PasswordReducer from "./features/wallet/D53PasswordSlice";
import tempD53PasswordReducer from "./features/wallet/TempD53PasswordSlice";
import currencyReducer from "./features/wallet/CurrencySlice";
import scrolldownReducer from "./features/chat/Chat-scrollDownSlice";
import chatfriendlistReducer from "./features/chat/Chat-friendlistSlice";
import alertbadgeReducer from "./features/alert/AlertbadgeSlice";
import encryptionReducer from "./features/chat/Chat-encryptionkeySlice";
import machineIdReducer from "./features/account/MachineIdSlice";
import socketHashReducer from "./features/chat/SocketHashSlice";

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
    chatuserlist: chatuserlistReducer,
    chain: chainReducer,
    multiWallet: multiWalletReducer,
    tempMultiWallet: tempMultiWalletReducer,
    navigation: navigationReducer,
    tymtlogo: tymtlogoReducer,
    librarymode: librarymodeReducer,
    chatnotification: chatnotificationReducer,
    crypto: cryptoReducer,
    gameoverview: gameoverviewReducer,
    installprocess: installprocessReducer,
    selecteduser: selecteduserReducer,
    tymt: tymtReducer,
    alert: alertReducer,
    d53Password: d53PasswordReducer,
    tempD53Password: tempD53PasswordReducer,
    currency: currencyReducer,
    scrolldown: scrolldownReducer,
    chatfriendlist: chatfriendlistReducer,
    alertbadge: alertbadgeReducer,
    encryption: encryptionReducer,
    machineId: machineIdReducer,
    socketHash: socketHashReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
