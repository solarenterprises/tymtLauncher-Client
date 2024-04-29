import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { getThreeConfirm } from "../../../features/account/ThreeConfirmSlice";
import { getTempNonCustodial } from "../../../features/account/TempNonCustodialSlice";
import { setThreeConfirm } from "../../../features/account/ThreeConfirmSlice";

import { Grid, Box, Stack } from "@mui/material";

import Back from "../../../components/account/Back";
import AccountHeader from "../../../components/account/AccountHeader";
import AccountNextButton from "../../../components/account/AccountNextButton";
import Stepper from "../../../components/account/Stepper";
import HaveAccount from "../../../components/account/HaveAccount";
import MnemonicRandomPad from "../../../components/account/MnemonicRandomPad";
import MnemonicConfirm from "../../../components/account/MnemonicConfirm";
import { getTempAddressesFromMnemonicAsync } from "../../../features/wallet/TempMultiWalletSlice";

import tymt3 from "../../../assets/account/tymt3.png";

import "../../../global.css";
import {
  nonCustodialType,
  threeConfirmType,
} from "../../../types/accountTypes";
import { AppDispatch } from "../../../store";

const NonCustodialSignUp3 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const threeConfirmStore: threeConfirmType = useSelector(getThreeConfirm);
  const tempNonCustodialStore: nonCustodialType =
    useSelector(getTempNonCustodial);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBackClick = () => {
    navigate("/start");
  };

  const handleNextClick = async () => {
    const mnemonicString = tempNonCustodialStore.mnemonic;
    const mnemonic = mnemonicString.split(" ");
    if (
      threeConfirmStore.first === mnemonic[2] &&
      threeConfirmStore.second === mnemonic[5] &&
      threeConfirmStore.third === mnemonic[8]
    ) {
      setLoading(true);
      dispatch(
        getTempAddressesFromMnemonicAsync({
          mnemonic: tempNonCustodialStore.mnemonic,
        })
      ).then(() => {
        setLoading(false);
        navigate("/non-custodial/signup/4");
        dispatch(
          setThreeConfirm({
            first: "",
            second: "",
            third: "",
            focus: 1,
          })
        );
      });
    } else {
      setError(true);
    }
  };

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
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"64px"}
          >
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
                    <Stepper
                      all={4}
                      now={3}
                      texts={["", "", t("ncca-30_confirm-recovery-phrase"), ""]}
                    />
                  </Grid>

                  <Grid item xs={12} mt={"80px"}>
                    <AccountHeader
                      title={t("ncca-13_secure-passphrase")}
                      text={t("ncca-14_here-your-mnemonic")}
                    />
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
                    {error && (
                      <Box className={"fs-16-regular red"}>
                        {"Wrong Mnemonic"}
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} mt={"40px"}>
                    <MnemonicRandomPad />
                  </Grid>
                  <Grid item xs={12} mt={"48px"}>
                    <AccountNextButton
                      text={t("ncca-44_verify-and-complete")}
                      disabled={
                        loading ||
                        threeConfirmStore.first === "" ||
                        threeConfirmStore.second === "" ||
                        threeConfirmStore.third === ""
                      }
                      loading={loading}
                      onClick={handleNextClick}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    mt={length === 12 ? "91px" : "40px"}
                  >
                    <HaveAccount />
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
        </Grid>
      </Grid>
    </>
  );
};

export default NonCustodialSignUp3;
