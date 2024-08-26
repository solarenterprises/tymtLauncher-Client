import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";

import "../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../components/account/Back";
import AccountHeader from "../../components/account/AccountHeader";
import AccountNextButton from "../../components/account/AccountNextButton";
import Stepper from "../../components/account/Stepper";
import WalletList from "../../components/account/WalletList";

import AuthAPI from "../../lib/api/AuthAPI";
import tymtCore from "../../lib/core/tymtCore";

import { encrypt, getKeccak256Hash } from "../../lib/api/Encrypt";
import { getReqBodyNonCustodyBeforeSignIn, getReqBodyNonCustodySignIn, getReqBodyNonCustodySignUp } from "../../lib/helper/AuthAPIHelper";

import { AppDispatch } from "../../store";
import { addAccountList } from "../../features/account/AccountListSlice";
import { getTempAccount } from "../../features/account/TempAccountSlice";
import { setWallet } from "../../features/wallet/WalletSlice";
import { getMachineId } from "../../features/account/MachineIdSlice";
import { setAccount } from "../../features/account/AccountSlice";
import { getSaltToken, setSaltToken } from "../../features/account/SaltTokenSlice";
import { addWalletList } from "../../features/wallet/WalletListSlice";
import { getTempWallet } from "../../features/wallet/TempWalletSlice";
import { setLogin } from "../../features/account/LoginSlice";

import tymt2 from "../../assets/account/tymt2.png";

import { IWallet } from "../../types/walletTypes";
import { ISaltToken, IMachineId, IAccount } from "../../types/accountTypes";
import { INonCustodySignUpReq } from "../../types/AuthAPITypes";
import { fetchMyInfoAsync } from "../../features/account/MyInfoSlice";

const ConfirmInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { mode } = useParams();

  const tempAccountStore: IAccount = useSelector(getTempAccount);
  const tempWalletStore: IWallet = useSelector(getTempWallet);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);

  const [loading, setLoading] = useState<boolean>(false);

  const displayWallet: IWallet = useMemo(() => {
    if (mode === "signup") return tempWalletStore;
  }, [tempWalletStore]);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleSignUp = useCallback(async () => {
    try {
      const newAccount: IAccount = {
        ...tempAccountStore,
        password: getKeccak256Hash(tempAccountStore?.password),
        mnemonic: await encrypt(tempAccountStore?.mnemonic, tempAccountStore?.password),
      };

      const body: INonCustodySignUpReq = getReqBodyNonCustodySignUp(newAccount, tempWalletStore);
      await AuthAPI.nonCustodySignUp(body);

      dispatch(setAccount(newAccount));
      dispatch(addAccountList(newAccount));
      // dispatch(
      //   setTempAccount({
      //     avatar: "",
      //     nickName: "",
      //     password: "",
      //     sxpAddress: "",
      //     mnemonic: "",
      //   })
      // );

      dispatch(setWallet(tempWalletStore));
      dispatch(addWalletList(tempWalletStore));
      // dispatch(
      //   setTempWallet({
      //     arbitrum: "",
      //     avalanche: "",
      //     bitcoin: "",
      //     binance: "",
      //     ethereum: "",
      //     optimism: "",
      //     polygon: "",
      //     solana: "",
      //     solar: "",
      //   })
      // );
    } catch (err) {
      console.log("Failed to handleSignUp: ", err);
      if (err?.response?.data?.msg === "User already exists with same sxpAddress!") {
       
      }
    }
  }, [tempAccountStore, tempWalletStore]);

  const handleLogin = useCallback(async () => {
    try {
      const body1 = getReqBodyNonCustodyBeforeSignIn(tempAccountStore, tempAccountStore?.mnemonic);
      const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);
      const salt: string = res1?.data?.salt;

      let token: string = "";
      if (salt !== saltTokenStore?.salt) {
        token = tymtCore.Blockchains.solar.wallet.signToken(salt, tempAccountStore?.mnemonic);
        dispatch(
          setSaltToken({
            salt: salt,
            token: token,
          })
        );
      } else {
        token = saltTokenStore?.token;
      }

      const body2 = getReqBodyNonCustodySignIn(tempAccountStore, machineIdStore, token);
      const res2 = await AuthAPI.nonCustodySignin(body2);
      const uid = res2?.data?._id;

      await dispatch(fetchMyInfoAsync(uid));

      dispatch(setLogin(true));
      navigate("/home");
    } catch (err) {
      console.log("Failed to handleLogin: ", err);
    }
  }, [tempAccountStore, saltTokenStore]);

  const handleConfirmClick = useCallback(async () => {
    setLoading(true);
    if (mode === "signup") await handleSignUp();
    await handleLogin();
    setLoading(false);
  }, [handleSignUp]);

  return (
    <>
      <Grid container className="basic-container">
        <Grid item xs={12} container justifyContent={"center"}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              alignSelf: "center",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={"64px"}>
              <Stack alignItems={"center"} justifyContent={"center"}>
                <Grid container justifyContent={"center"}>
                  <Grid
                    item
                    container
                    sx={{
                      width: "520px",
                      padding: "10px 0px",
                    }}
                  >
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={0} now={0} texts={[t("ncca-48_almost-done-confirm")]} />
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-49_confirm-information")} text={t("ncca-50_welcome-to-kingdom")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <WalletList wallet={displayWallet} />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton text={t("ncca-51_confirm")} onClick={handleConfirmClick} disabled={loading} loading={loading} />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt2}
                sx={{
                  height: "calc(100vh - 64px)",
                }}
              />
            </Stack>
          </motion.div>
        </Grid>
      </Grid>
    </>
  );
};

export default ConfirmInformation;
