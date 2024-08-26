import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getThreeConfirm } from "../../../features/account/ThreeConfirmSlice";
import { setThreeConfirm } from "../../../features/account/ThreeConfirmSlice";
import { Grid, Box, Stack } from "@mui/material";
import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import MnemonicRandomPad from "../../../components/account/MnemonicRandomPad";
import MnemonicConfirm from "../../../components/account/MnemonicConfirm";
// import { getTempAddressesFromMnemonicAsync } from "../../../features/wallet/TempMultiWalletSlice";
import tymt3 from "../../../assets/account/tymt3.png";
import "../../../global.css";
import { IAccount, threeConfirmType } from "../../../types/accountTypes";
import { AppDispatch } from "../../../store";
import { motion } from "framer-motion";
import { getTempAccount, setTempAccount } from "../../../features/account/TempAccountSlice";
import { getWalletAddressFromPassphrase } from "../../../lib/helper/WalletHelper";
import { setTempWallet } from "../../../features/wallet/TempWalletSlice";

const NonCustodialSignUp3 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  const threeConfirmStore: threeConfirmType = useSelector(getThreeConfirm);
  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const [loading, setLoading] = useState<boolean>(false);

  const mnemonic = useMemo(() => tempAccountStore?.mnemonic?.split(" "), [tempAccountStore]);
  const compare = useMemo(() => {
    if (threeConfirmStore?.first === mnemonic[2] && threeConfirmStore?.second === mnemonic[5] && threeConfirmStore?.third === mnemonic[8]) return true;
    return false;
  }, [mnemonic, threeConfirmStore]);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleNextClick = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWalletAddressFromPassphrase(tempAccountStore?.mnemonic);
      dispatch(setTempWallet(res));
      dispatch(
        setTempAccount({
          ...tempAccountStore,
          sxpAddress: res?.solar,
        })
      );
      navigate("/non-custodial/signup/4");
      setLoading(false);
    } catch (err) {
      console.log("Failed to handleNextClick: ", err);
      setLoading(false);
    }
  }, [tempAccountStore]);

  useEffect(() => {
    dispatch(
      setThreeConfirm({
        first: "",
        second: "",
        third: "",
        focus: 1,
      })
    );
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
                    <Grid item xs={12} container justifyContent={"space-between"}>
                      <Back onClick={handleBackClick} />
                      <Stepper all={4} now={3} texts={["", "", t("ncca-30_confirm-recovery-phrase"), ""]} />
                    </Grid>

                    <Grid item xs={12} mt={"80px"}>
                      <AccountHeader title={t("ncca-13_secure-passphrase")} text={t("ncca-14_here-your-mnemonic")} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <MnemonicConfirm />
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <MnemonicRandomPad passphrase={tempAccountStore?.mnemonic} />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        text={t("ncca-44_verify-and-complete")}
                        disabled={loading || threeConfirmStore?.first === "" || threeConfirmStore?.second === "" || threeConfirmStore?.third === "" || !compare}
                        loading={loading}
                        onClick={handleNextClick}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Stack>
              <Box
                component={"img"}
                src={tymt3}
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

export default NonCustodialSignUp3;
