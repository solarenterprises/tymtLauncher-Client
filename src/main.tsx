import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Layout from "./pages/main/Layout";
import Layoutchat from "./pages/main/Layoutchat";

import Splash from "./pages/welcome/Splash";
import GetStarted from "./pages/welcome/GetStarted";
import Start from "./pages/welcome/Start";

import CustodialSignUp1 from "./pages/account/custodial/CustodialSignUp1";
import CustodialSignUp1VerifyEmail from "./pages/account/custodial/CustodialSignUp1VerifyEmail";
import CustodialSignUp2 from "./pages/account/custodial/CustodialSignUp2";
import CustodialSignUp3 from "./pages/account/custodial/CustodialSignUp3";
import CustodialLogin1 from "./pages/account/custodial/CustodialLogin1";
import CustodialLogin2 from "./pages/account/custodial/CustodialLogIn2";
import CustodialReset1 from "./pages/account/custodial/CustodialReset1";
import CustodialReset1ResetLink from "./pages/account/custodial/CustodialReset1ResetLink";
import CustodialReset2 from "./pages/account/custodial/CustodialReset2";
import CustodialReset3 from "./pages/account/custodial/CustodialReset3";

import NonCustodialSignUp1 from "./pages/account/non-custodial/NonCustodialSignUp1";
import NonCustodialSignUp2 from "./pages/account/non-custodial/NonCustodialSignUp2";
import NonCustodialSignUp3 from "./pages/account/non-custodial/NonCustodialSignUp3";
import NonCustodialSignUp4 from "./pages/account/non-custodial/NonCustodialSignUp4";
import NonCustodialLogIn1 from "./pages/account/non-custodial/NonCustodialLogIn1";
import NonCustodialLogIn2 from "./pages/account/non-custodial/NonCustodialLogIn2";
import NonCustodialReset1 from "./pages/account/non-custodial/NonCustodialReset1";
import NonCustodialReset2 from "./pages/account/non-custodial/NonCustodialReset2";
import NonCustodialImport1 from "./pages/account/non-custodial/NonCustodialImport1";
import NonCustodialImport2 from "./pages/account/non-custodial/NonCustodialImport2";
import NonCustodialImport3 from "./pages/account/non-custodial/NonCustodialImport3";
import NonCustodialImport4 from "./pages/account/non-custodial/NonCustodialImport4";

import ConfirmInformation from "./pages/account/ConfirmInformation";

import Homepage from "./pages/main/Homepage";
import Chatroom from "./pages/chat/Chatroom";
import Store from "./pages/main/Store";
import Library from "./pages/main/Library";
import GameOverview from "./components/store/Gameoverview";

import Wallet from "./pages/wallet";
import WalletSendSXP from "./pages/wallet/WalletSendSXP";
import WalletVote from "./pages/wallet/WalletVote";
import WalletBuyCrypto from "./pages/wallet/WalletBuyCrypto";
import WalletPaymentMethod from "./pages/wallet/WalletPaymentMethod";
import WalletPaymentCard from "./pages/wallet/WalletPaymentCard";
import WalletBuyGame from "./pages/wallet/WalletBuyGame";

import { TrayProvider } from "./providers/TrayProvider";
import { FullscreenProvider } from "./providers/FullscreenProvider";
import { Provider as StoreProvider } from "react-redux";
import ChatProvider from "./providers/Chatprovider";
import { AuthProvider } from "./providers/AuthProvider";
import { SocketProvider } from "./providers/SocketProvider";

import store from "./store";

import "../node_modules/swiper/swiper-bundle.min.css";

import "primeicons/primeicons.css";
import "./App.css";
import "./styles/app.scss";
import "./fonts/Cobe/Cobe-Bold.ttf";
import "./fonts/Cobe/Cobe-Regular.ttf";
import "./locale/i18n";

import { Buffer } from "buffer";
import { NotificationProvider } from "./providers/NotificationProvider";
import TransactionProvider from "./providers/TransactionProvider";

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <FullscreenProvider>
        <BrowserRouter>
          <TrayProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/start" element={<Start />} />
                <Route
                  path="/non-custodial/signup/1"
                  element={<NonCustodialSignUp1 />}
                />
                <Route
                  path="/non-custodial/signup/2"
                  element={<NonCustodialSignUp2 />}
                />
                <Route
                  path="/non-custodial/signup/3"
                  element={<NonCustodialSignUp3 />}
                />
                <Route
                  path="/non-custodial/signup/4"
                  element={<NonCustodialSignUp4 />}
                />
                <Route
                  path="/non-custodial/login/1"
                  element={<NonCustodialLogIn1 />}
                />
                <Route
                  path="/non-custodial/login/2"
                  element={<NonCustodialLogIn2 />}
                />
                <Route
                  path="/non-custodial/reset/1"
                  element={<NonCustodialReset1 />}
                />
                <Route
                  path="/non-custodial/reset/2"
                  element={<NonCustodialReset2 />}
                />
                <Route
                  path="/non-custodial/import/1"
                  element={<NonCustodialImport1 />}
                />
                <Route
                  path="/non-custodial/import/2"
                  element={<NonCustodialImport2 />}
                />
                <Route
                  path="/non-custodial/import/3"
                  element={<NonCustodialImport3 />}
                />
                <Route
                  path="/non-custodial/import/4"
                  element={<NonCustodialImport4 />}
                />
                <Route
                  path="/custodial/signup/1"
                  element={<CustodialSignUp1 />}
                />
                <Route
                  path="/custodial/signup/1/verify-email"
                  element={<CustodialSignUp1VerifyEmail />}
                />
                <Route
                  path="/custodial/signup/2"
                  element={<CustodialSignUp2 />}
                />
                <Route
                  path="/custodial/signup/3"
                  element={<CustodialSignUp3 />}
                />
                <Route
                  path="/custodial/login/1"
                  element={<CustodialLogin1 />}
                />
                <Route
                  path="/custodial/login/2"
                  element={<CustodialLogin2 />}
                />
                <Route
                  path="/custodial/reset/1"
                  element={<CustodialReset1 />}
                />
                <Route
                  path="/custodial/reset/1/reset-link"
                  element={<CustodialReset1ResetLink />}
                />
                <Route
                  path="/custodial/reset/2"
                  element={<CustodialReset2 />}
                />
                <Route
                  path="/custodial/reset/3"
                  element={<CustodialReset3 />}
                />
                <Route
                  path="/confirm-information"
                  element={<ConfirmInformation />}
                />

                <Route element={<AuthProvider />}>
                  <Route path="/" element={<SocketProvider />}>
                    <Route path="/" element={<ChatProvider />}>
                      <Route path="/" element={<TransactionProvider />}>
                        <Route path="/" element={<Layout />}>
                          <Route path="/wallet" element={<Wallet />} />
                          <Route
                            path="/wallet/send-sxp"
                            element={<WalletSendSXP />}
                          />
                          <Route path="/wallet/vote" element={<WalletVote />} />
                          <Route
                            path="/wallet/buy-crypto"
                            element={<WalletBuyCrypto />}
                          />
                          <Route
                            path="/wallet/payment-method"
                            element={<WalletPaymentMethod />}
                          />
                          <Route
                            path="/wallet/payment-card"
                            element={<WalletPaymentCard />}
                          />
                          <Route
                            path="/wallet/buy-game"
                            element={<WalletBuyGame />}
                          />

                          <Route path="/home" element={<Homepage />} />
                          <Route path="/store" element={<Store />} />
                          <Route
                            path="/store/:gameid"
                            element={<GameOverview />}
                          />
                          <Route path="/library" element={<Library />} />
                        </Route>
                        <Route path="/" element={<Layoutchat />}>
                          <Route path="/chat" element={<Chatroom />} />
                        </Route>
                      </Route>
                    </Route>
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
