import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Layout from "./pages/main/Layout";
import Layoutchat from "./pages/main/Layoutchat";

import Splash from "./pages/welcome/Splash";
import Start from "./pages/account/Start";
import Welcome from "./pages/account/Welcome";

import NonCustodialSignUp2 from "./pages/account/non-custodial/NonCustodialSignUp2";
import NonCustodialSignUp3 from "./pages/account/non-custodial/NonCustodialSignUp3";
import NonCustodialSignUp4 from "./pages/account/non-custodial/NonCustodialSignUp4";
import NonCustodialLogIn2 from "./pages/account/non-custodial/NonCustodialLogIn2";
import NonCustodialImport1 from "./pages/account/non-custodial/NonCustodialImport1";

import GuestCompletePassword from "./pages/account/non-custodial/GuestCompletePassword";
import GuestCompletePassphrase from "./pages/account/non-custodial/GuestCompletePassphrase";
import GuestCompleteNickname from "./pages/account/non-custodial/GuestCompleteNickname";

import ConfirmInformation from "./pages/account/ConfirmInformation";

import Homepage from "./pages/main/Homepage";
import Chatroom from "./pages/chat/Chatroom";
import Store from "./pages/main/Store";
import Library from "./pages/main/Library";
import ComingGameOverview from "./components/store/ComingGameOverview";

import Wallet from "./pages/wallet/index";
import WalletSendSXP from "./pages/wallet/WalletSendSXP";
import WalletVote from "./pages/wallet/WalletVote";
import WalletBuyCrypto from "./pages/wallet/WalletBuyCrypto";
import WalletPaymentMethod from "./pages/wallet/WalletPaymentMethod";
import WalletPaymentCard from "./pages/wallet/WalletPaymentCard";
import WalletBuyGame from "./pages/wallet/WalletBuyGame";
import WalletD53Transaction from "./pages/wallet/WalletD53Transaction";

import { AuthProvider } from "./providers/AuthProvider";
import { TrayProvider } from "./providers/TrayProvider";
import { FullscreenProvider } from "./providers/FullscreenProvider";
import { Provider as StoreProvider } from "react-redux";
import { SocketProvider } from "./providers/SocketProvider";
import { NotificationProvider } from "./providers/NotificationProvider";

import ChatProvider from "./providers/Chatprovider";
import AlertProvider from "./providers/AlertProvider";
import UpdateProvider from "./providers/UpdateProvider";
import TransactionProvider from "./providers/TransactionProvider";

import store from "./store";

import "../node_modules/swiper/swiper-bundle.min.css";

import "primeicons/primeicons.css";
import "./App.css";
import "./styles/app.scss";
import "./fonts/Cobe/Cobe-Bold.ttf";
import "./fonts/Cobe/Cobe-Regular.ttf";
import "./locale/i18n";

import { Buffer } from "buffer";

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <FullscreenProvider>
        <BrowserRouter>
          <TrayProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<UpdateProvider />}>
                  <Route path="/" element={<TransactionProvider />}>
                    <Route path="/" element={<Splash />} />
                    <Route path="/start" element={<Start />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/non-custodial/signup/2" element={<NonCustodialSignUp2 />} />
                    <Route path="/non-custodial/signup/3" element={<NonCustodialSignUp3 />} />
                    <Route path="/non-custodial/signup/4" element={<NonCustodialSignUp4 />} />
                    <Route path="/non-custodial/login/2" element={<NonCustodialLogIn2 />} />
                    <Route path="/non-custodial/import/1" element={<NonCustodialImport1 />} />
                    <Route path="/guest/complete/password" element={<GuestCompletePassword />} />
                    <Route path="/guest/complete/passphrase" element={<GuestCompletePassphrase />} />
                    <Route path="/guest/complete/nickname" element={<GuestCompleteNickname />} />
                    <Route path="/confirm-information/:mode" element={<ConfirmInformation />} />
                    <Route path="/" element={<SocketProvider />}>
                      <Route path="/" element={<ChatProvider />}>
                        <Route path="/" element={<AlertProvider />}>
                          <Route element={<AuthProvider />}>
                            <Route path="/" element={<Layout />}>
                              <Route path="/wallet" element={<Wallet />} />
                              <Route path="/wallet/send-sxp" element={<WalletSendSXP />} />
                              <Route path="/wallet/vote" element={<WalletVote />} />
                              <Route path="/wallet/buy-crypto" element={<WalletBuyCrypto />} />
                              <Route path="/wallet/payment-method" element={<WalletPaymentMethod />} />
                              <Route path="/wallet/payment-card" element={<WalletPaymentCard />} />
                              <Route path="/wallet/buy-game" element={<WalletBuyGame />} />
                              <Route path="/home" element={<Homepage />} />
                              <Route path="/store" element={<Store />} />
                              <Route path="/coming/:gameid" element={<ComingGameOverview />} />
                              <Route path="/library" element={<Library />} />
                            </Route>
                            <Route path="/" element={<Layoutchat />}>
                              <Route path="/chat" element={<Chatroom />} />
                              <Route path="/chat/:chatroomId" element={<Chatroom />} />
                            </Route>
                          </Route>
                        </Route>
                      </Route>
                    </Route>
                    <Route path="/d53-transaction" element={<WalletD53Transaction />} />
                  </Route>
                </Route>
              </Routes>
            </NotificationProvider>
          </TrayProvider>
        </BrowserRouter>
      </FullscreenProvider>
    </StoreProvider>
  </React.StrictMode>
);
