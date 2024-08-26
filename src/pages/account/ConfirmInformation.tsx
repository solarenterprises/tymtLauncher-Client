import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import "../../global.css";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../components/account/Back";
import AccountHeader from "../../components/account/AccountHeader";
import AccountNextButton from "../../components/account/AccountNextButton";
import Stepper from "../../components/account/Stepper";
import WalletList from "../../components/account/WalletList";

import { AppDispatch } from "../../store";
import { addAccountList } from "../../features/account/AccountListSlice";
import { getTempAccount, setTempAccount } from "../../features/account/TempAccountSlice";
import { setWallet } from "../../features/wallet/WalletSlice";
import { getMachineId } from "../../features/account/MachineIdSlice";
import { setAccount } from "../../features/account/AccountSlice";
import { getSaltToken } from "../../features/account/SaltTokenSlice";

import tymt2 from "../../assets/account/tymt2.png";

import { IWallet } from "../../types/walletTypes";
import { ISaltToken, IMachineId, IAccount } from "../../types/accountTypes";
import { addWalletList } from "../../features/wallet/WalletListSlice";
import { getTempWallet, setTempWallet } from "../../features/wallet/TempWalletSlice";
import { encrypt, getKeccak256Hash } from "../../lib/api/Encrypt";
import { setLogin } from "../../features/account/LoginSlice";

const ConfirmInformation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { mode } = useParams();

  const tempAccountStore: IAccount = useSelector(getTempAccount);
  const tempWalletStore: IWallet = useSelector(getTempWallet);

  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const saltTokenRef = useRef(saltTokenStore);
  const machineIdStore: IMachineId = useSelector(getMachineId);
  const machineIdStoreRef = useRef(machineIdStore);
  const [loading, setLoading] = useState<boolean>(false);

  const displayWallet: IWallet = useMemo(() => {
    if (mode === "signup") return tempWalletStore;
  }, [tempWalletStore]);

  useEffect(() => {
    saltTokenRef.current = saltTokenStore;
  }, [saltTokenStore]);
  useEffect(() => {
    machineIdStoreRef.current = machineIdStore;
  }, [machineIdStore]);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleSignUp = useCallback(async () => {
    const newAccount: IAccount = {
      ...tempAccountStore,
      password: getKeccak256Hash(tempAccountStore?.password),
      mnemonic: await encrypt(tempAccountStore?.mnemonic, tempAccountStore?.password),
    };

    dispatch(setAccount(newAccount));
    dispatch(addAccountList(newAccount));
    dispatch(
      setTempAccount({
        avatar: "",
        nickName: "",
        password: "",
        sxpAddress: "",
        mnemonic: "",
      })
    );

    dispatch(setWallet(tempWalletStore));
    dispatch(addWalletList(tempWalletStore));
    dispatch(
      setTempWallet({
        arbitrum: "",
        avalanche: "",
        bitcoin: "",
        binance: "",
        ethereum: "",
        optimism: "",
        polygon: "",
        solana: "",
        solar: "",
      })
    );
  }, [tempAccountStore, tempWalletStore]);

  const handleLogin = useCallback(async () => {
    dispatch(setLogin(true));
    navigate("/home");
  }, []);

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
