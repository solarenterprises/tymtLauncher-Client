import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { motion } from "framer-motion";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Grid, Box, Stack, Divider } from "@mui/material";

import AccountHeader from "../../components/account/AccountHeader";
import SignModeButton from "../../components/account/SignModeButton";
import CreateAccountForm from "../../components/account/CreateAccountForm";
import AuthIconButtons from "../../components/account/AuthIconButtons";
import OrLine from "../../components/account/OrLine";

import { AppDispatch } from "../../store";
import { getMachineId, setMachineId } from "../../features/account/MachineIdSlice";
import { addAccountList, getAccountList } from "../../features/account/AccountListSlice";
import { setAccount } from "../../features/account/AccountSlice";
import { getSaltToken, setSaltToken } from "../../features/account/SaltTokenSlice";
import { fetchMyInfoAsync } from "../../features/account/MyInfoSlice";
import { setMnemonic } from "../../features/account/MnemonicSlice";
import { setLogin } from "../../features/account/LoginSlice";
import { setWallet } from "../../features/wallet/WalletSlice";
import { addWalletList } from "../../features/wallet/WalletListSlice";
import { getRsaKeyPairAsync } from "../../features/chat/RsaSlice";
import { setSocketHash } from "../../features/chat/SocketHashSlice";

import AuthAPI from "../../lib/api/AuthAPI";

import { getRsaKeyPair } from "../../features/chat/RsaApi";
import { generateSocketHash } from "../../features/chat/SocketHashApi";
import { encrypt, getKeccak256Hash } from "../../lib/api/Encrypt";
import { getMnemonic, getWalletAddressFromPassphrase } from "../../lib/helper/WalletHelper";
import {
  getNonCustodySignInToken,
  getReqBodyNonCustodyBeforeSignIn,
  getReqBodyNonCustodySignIn,
  getReqBodyNonCustodySignUp,
} from "../../lib/helper/AuthAPIHelper";

import { IWallet } from "../../types/walletTypes";
import { IAccount, IAccountList, IMachineId, ISaltToken } from "../../types/accountTypes";
import { INonCustodyBeforeSignInReq, INonCustodySignUpReq } from "../../types/AuthAPITypes";
import { INotificationParams } from "../../types/NotificationTypes";

import tymt1 from "../../assets/account/tymt1.png";
import GuestIcon from "../../assets/account/Guest.svg";
import ImportIcon from "../../assets/account/Import.svg";

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);
  const accountListStore: IAccountList = useSelector(getAccountList);

  const hasGuest: boolean = useMemo(
    () => accountListStore?.list?.some((one) => one?.nickName === "Guest" && one?.password === getKeccak256Hash("")),
    [accountListStore]
  );

  const [loading, setLoading] = useState<boolean>(false);

  const handlePlayGuest = useCallback(async () => {
    try {
      if (hasGuest) {
        const noti: INotificationParams = {
          status: "warning",
          title: "Warning",
          message: "You already have a Guest account!",
          link: null,
          translate: true,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
        navigate("/start");
        return;
      }

      setLoading(true);
      const newPassphrase: string = getMnemonic(12);
      const newWalletAddress: IWallet = await getWalletAddressFromPassphrase(newPassphrase);
      const newPassword: string = "";
      const encryptedPassword: string = getKeccak256Hash(newPassword);
      const encryptedPassphrase: string = await encrypt(newPassphrase, newPassword);
      const newRsaPubKey: string = (await getRsaKeyPair(newPassphrase))?.publicKey;

      let newAccount: IAccount = {
        uid: "",
        avatar: "",
        nickName: "Guest",
        password: encryptedPassword,
        sxpAddress: newWalletAddress?.solar,
        mnemonic: encryptedPassphrase,
        rsaPubKey: newRsaPubKey,
      };

      const body0: INonCustodySignUpReq = getReqBodyNonCustodySignUp(newAccount, newWalletAddress, newPassphrase);
      const res0 = await AuthAPI.nonCustodySignUp(body0);

      newAccount = {
        ...newAccount,
        uid: res0?.data?._id,
      };

      dispatch(setAccount(newAccount));
      dispatch(addAccountList(newAccount));
      dispatch(setWallet(newWalletAddress));
      dispatch(addWalletList(newWalletAddress));

      const body1: INonCustodyBeforeSignInReq = getReqBodyNonCustodyBeforeSignIn(newAccount, newPassphrase);
      const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);

      const salt: string = res1?.data?.salt;
      const token: string = getNonCustodySignInToken(salt, saltTokenStore, newPassphrase);
      dispatch(
        setSaltToken({
          salt: salt,
          token: token,
        })
      );

      const body2 = getReqBodyNonCustodySignIn(newAccount, machineIdStore, token);
      const res2 = await AuthAPI.nonCustodySignin(body2);

      const uid = res2?.data?._id;
      await dispatch(fetchMyInfoAsync(uid));

      const newSocketHash = generateSocketHash(newPassphrase);
      dispatch(setSocketHash(newSocketHash));
      dispatch(setMnemonic(newPassphrase));
      dispatch(getRsaKeyPairAsync(newPassphrase));

      dispatch(setLogin(true));
      navigate("/home");
      setLoading(false);
    } catch (err) {
      console.log("Failed to handlePlayGuest: ", err);
      setLoading(false);
    }
  }, [saltTokenStore, machineIdStore, hasGuest]);

  useEffect(() => {
    invoke("get_machine_id")
      .then((hwid) => {
        console.log("Unique Machine ID:", hwid);
        dispatch(
          setMachineId({
            machineId: hwid,
          })
        );
      })
      .catch((err) => {
        console.log("Error getting Machine ID:", err);
      });
  }, []);

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
                    <Grid item xs={12}>
                      <AccountHeader title={t("ncca-63_hello")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                        <SignModeButton icon={GuestIcon} text={t("ncca-64_play-as-guest")} onClick={handlePlayGuest} loading={loading} />
                        <SignModeButton icon={ImportIcon} text={t("ncl-8_import-wallet")} onClick={() => navigate("/non-custodial/login/2")} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <CreateAccountForm />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <OrLine />
                    </Grid>
                    <Grid item xs={12} mt={"32px"}>
                      <AuthIconButtons />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt1}
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

export default Welcome;
