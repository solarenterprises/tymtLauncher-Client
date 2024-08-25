import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { getThreeConfirm } from "../../../features/account/ThreeConfirmSlice";
import { getTempNonCustodial } from "../../../features/account/TempNonCustodialSlice";
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
import { nonCustodialType, threeConfirmType } from "../../../types/accountTypes";
import { AppDispatch } from "../../../store";
import { motion } from "framer-motion";

const NonCustodialSignUp3 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const threeConfirmStore: threeConfirmType = useSelector(getThreeConfirm);
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);
  //@ts-ignore
  const [error, setError] = useState<boolean>(false);
  //@ts-ignore
  const [loading, setLoading] = useState<boolean>(false);

  const handleBackClick = () => {
    navigate("/welcome");
  };

  const handleNextClick = useCallback(async () => {
    navigate("/non-custodial/signup/4");
    // const mnemonicString = tempNonCustodialStore.mnemonic;
    // const mnemonic = mnemonicString.split(" ");
    // console.log(mnemonic, threeConfirmStore, tempNonCustodialStore);
    // if (threeConfirmStore.first === mnemonic[2] && threeConfirmStore.second === mnemonic[5] && threeConfirmStore.third === mnemonic[8]) {
    //   setLoading(true);
    //   dispatch(
    //     getTempAddressesFromMnemonicAsync({
    //       mnemonic: tempNonCustodialStore.mnemonic,
    //     })
    //   ).then(() => {
    //     setLoading(false);
    //     navigate("/non-custodial/signup/4");
    //     dispatch(
    //       setThreeConfirm({
    //         first: "",
    //         second: "",
    //         third: "",
    //         focus: 1,
    //       })
    //     );
    //   });
    // } else {
    //   setError(true);
    // }
  }, [tempNonCustodialStore, threeConfirmStore]);

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
                    <Grid
                      item
                      xs={12}
                      sx={{
                        height: "20px",
                        padding: "8px 6px",
                      }}
                    >
                      {error && <Box className={"fs-16-regular red"}>{"Wrong Mnemonic"}</Box>}
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <MnemonicRandomPad />
                    </Grid>
                    <Grid item xs={12} mt={"48px"}>
                      <AccountNextButton
                        text={t("ncca-44_verify-and-complete")}
                        disabled={loading || threeConfirmStore.first === "" || threeConfirmStore.second === "" || threeConfirmStore.third === ""}
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
