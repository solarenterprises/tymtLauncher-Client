import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { motion } from "framer-motion";

import { Grid, Box, Stack, Divider } from "@mui/material";

import AccountHeader from "../../components/account/AccountHeader";
import SignModeButton from "../../components/account/SignModeButton";
import CreateAccountForm from "../../components/account/CreateAccountForm";
import AuthIconButtons from "../../components/account/AuthIconButtons";
import OrLine from "../../components/account/OrLine";

import { addAccountList } from "../../features/account/AccountListSlice";
import { setAccount } from "../../features/account/AccountSlice";

import { getMnemonic, getWalletAddressFromPassphrase } from "../../lib/helper/WalletHelper";

import { IWallet } from "../../types/walletTypes";
import { IAccount } from "../../types/accountTypes";

import tymt1 from "../../assets/account/tymt1.png";
import GuestIcon from "../../assets/account/Guest.svg";
import ImportIcon from "../../assets/account/Import.svg";
import { encrypt, getKeccak256Hash } from "../../lib/api/Encrypt";

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const handlePlayGuest = async () => {
    try {
      setLoading(true);
      const newPassphrase: string = getMnemonic(12);
      const newWalletAddress: IWallet = await getWalletAddressFromPassphrase(newPassphrase);
      const newPassword: string = "";
      const encryptedPassword: string = getKeccak256Hash(newPassword);
      const encryptedPassphrase: string = await encrypt(newPassphrase, newPassword);
      const newAccount: IAccount = {
        avatar: "",
        nickName: "Guest",
        password: encryptedPassword,
        sxpAddress: newWalletAddress?.solar,
        mnemonic: encryptedPassphrase,
      };
      dispatch(setAccount(newAccount));
      dispatch(addAccountList(newAccount));
      navigate("/home");
      setLoading(false);
    } catch (err) {
      console.log("Failed to handlePlayGuest: ", err);
      setLoading(false);
    }
  };

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
                      <AccountHeader title={"Hello!"} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                        <SignModeButton icon={GuestIcon} text={"Play as a guest"} onClick={handlePlayGuest} loading={loading} />
                        <SignModeButton icon={ImportIcon} text={"Import wallet"} onClick={() => navigate("/non-custodial/login/2")} />
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
