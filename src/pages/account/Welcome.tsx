import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

import { motion } from "framer-motion";

import { Grid, Box, Stack } from "@mui/material";

import AccountNextButton from "../../components/account/AccountNextButton";
import AccountHeader from "../../components/account/AccountHeader";
import SignModeButton from "../../components/account/SignModeButton";

import { AppDispatch } from "../../store";
import { selectLanguage } from "../../features/settings/LanguageSlice";
import { getAccount, setAccount } from "../../features/account/AccountSlice";
import { getMachineId, setMachineId } from "../../features/account/MachineIdSlice";
import { setMnemonic } from "../../features/account/MnemonicSlice";

import { languageType } from "../../types/settingTypes";
import { IMachineId, accountType, loginEnum } from "../../types/accountTypes";

import tymt1 from "../../assets/account/tymt1.png";

import GuestIcon from "../../assets/account/Guest.svg";
import ImportIcon from "../../assets/account/Import.svg";

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);
  const machineIdStore: IMachineId = useSelector(getMachineId);

  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();
  const languageStore: languageType = useSelector(selectLanguage);

  useEffect(() => {
    changeLanguage(languageStore.language);
  }, [changeLanguage, languageStore.language]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "F11") {
        e.preventDefault();
        const isFullscreen = await appWindow.isFullscreen();
        if (isFullscreen) {
          await appWindow.setFullscreen(false);
        } else {
          await appWindow.setFullscreen(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    invoke("get_machine_id")
      .then((hwid) => {
        console.log("Unique Machine ID:", hwid);
        dispatch(
          setMachineId({
            ...machineIdStore,
            machineId: hwid,
          })
        );
      })
      .catch((error) => {
        console.error("Error getting Machine ID:", error);
      });
    dispatch(
      setAccount({
        ...accountStore,
        mode: loginEnum.login,
        isLoggedIn: false,
      })
    );
    dispatch(setMnemonic({ mnemonic: "" }));
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
                      <AccountHeader title={"Hello!"} />
                    </Grid>
                    <Grid item xs={12} mt={"12px"}>
                      <Stack direction={"row"} alignItems={"center"} gap={"16px"}>
                        <SignModeButton icon={GuestIcon} text={"Play as a guest"} />
                        <SignModeButton icon={ImportIcon} text={"Import wallet"} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <Box className={"fs-18-light light"}>
                        {t("wc-7_if-you-already")}
                        <br /> <br />
                        {t("wc-8_you-create-account")}
                      </Box>
                    </Grid>
                    <Grid item xs={12} mt={"40px"}>
                      <AccountNextButton
                        text={t("wc-9_get-started")}
                        onClick={() => {
                          navigate("/start");
                        }}
                      />
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
