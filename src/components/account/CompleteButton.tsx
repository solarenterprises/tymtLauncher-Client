import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";

import { AppDispatch } from "../../store";
import { setTempAccount } from "../../features/account/TempAccountSlice";
import { getSaltToken, setSaltToken } from "../../features/account/SaltTokenSlice";
import { getMachineId } from "../../features/account/MachineIdSlice";
import { fetchMyInfoAsync } from "../../features/account/MyInfoSlice";
import { setSocketHash } from "../../features/chat/SocketHashSlice";
import { setMnemonic } from "../../features/account/MnemonicSlice";
import { getRsaKeyPairAsync } from "../../features/chat/RsaSlice";
import { setLogin } from "../../features/account/LoginSlice";
import { setTempWallet } from "../../features/wallet/TempWalletSlice";
import { getWallet } from "../../features/wallet/WalletSlice";

import { generateSocketHash } from "../../features/chat/SocketHashApi";

import { getNonCustodySignInToken, getReqBodyNonCustodyBeforeSignIn, getReqBodyNonCustodySignIn } from "../../lib/helper/AuthAPIHelper";
import { decrypt } from "../../lib/api/Encrypt";

import AuthAPI from "../../lib/api/AuthAPI";

import { IAccount, IMachineId, ISaltToken } from "../../types/accountTypes";
import { IWallet } from "../../types/walletTypes";

export interface IPropsCompleteButton {
  account: IAccount;
}

const CompleteButton = ({ account }: IPropsCompleteButton) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);
  const walletStore: IWallet = useSelector(getWallet);

  const handleCompleteButton = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        e.preventDefault();
        e.stopPropagation();

        const decryptedMnemonic: string = await decrypt(account?.mnemonic, "");

        const body1 = getReqBodyNonCustodyBeforeSignIn(account, decryptedMnemonic);
        const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);

        const salt: string = res1?.data?.salt;
        const token: string = getNonCustodySignInToken(salt, saltTokenStore, decryptedMnemonic);
        dispatch(
          setSaltToken({
            salt: salt,
            token: token,
          })
        );

        const body2 = getReqBodyNonCustodySignIn(account, machineIdStore, token);
        const res2 = await AuthAPI.nonCustodySignin(body2);

        const uid = res2?.data?._id;
        await dispatch(fetchMyInfoAsync(uid));

        const newSocketHash = generateSocketHash(decryptedMnemonic);
        dispatch(setSocketHash(newSocketHash));
        dispatch(setMnemonic(decryptedMnemonic));
        dispatch(getRsaKeyPairAsync(decryptedMnemonic));

        dispatch(setLogin(true));

        dispatch(setTempAccount(account));
        dispatch(setTempWallet(walletStore));

        navigate("/guest/complete/password");
        console.log("handleCompleteButton");
      } catch (err) {
        console.log("Failed to handleCompleteButton: ", err);
      }
    },
    [saltTokenStore, machineIdStore, walletStore]
  );

  return (
    <Button
      onClick={handleCompleteButton}
      sx={{
        padding: "5px 6px",
        color: "#52e1f2",
        fontFamily: "Cobe",
        fontSize: "14px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        borderRadius: "12px",
        border: "1px solid #ef4444",
        backgroundColor: "transparent",
        textTransform: "none",
        alignSelf: "flex-end",
        "&:hover": {
          backgroundColor: "#992727",
          border: "1px solid #992727",
          color: "white",
        },
        "&.Mui-disabled": {
          border: "1px solid #2a2525",
          color: "#7c7c7c",
        },
      }}
    >
      {t("ncca-62_complete")}
    </Button>
  );
};

export default CompleteButton;
