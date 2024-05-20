import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { appWindow } from "@tauri-apps/api/window";

import { Grid, Box, Stack } from "@mui/material";

import item1 from "../../assets/account/item1.svg";
import item2 from "../../assets/account/item2.svg";
import item3 from "../../assets/account/item3.svg";
import item4 from "../../assets/account/item4.svg";
import tymt1 from "../../assets/account/tymt1.png";

import AccountNextButton from "../../components/account/AccountNextButton";
import AccountHeader from "../../components/account/AccountHeader";
import AccountIconBar from "../../components/account/AccountIconBar";

import { selectLanguage } from "../../features/settings/LanguageSlice";
import { languageType } from "../../types/settingTypes";
import { AppDispatch } from "../../store";

import { getAccount, setAccount } from "../../features/account/AccountSlice";
import { IMachineId, accountType, loginEnum } from "../../types/accountTypes";

import {
  getMachineId,
  setMachineId,
} from "../../features/account/MachineIdSlice";
import { invoke } from "@tauri-apps/api/tauri";

const GetStarted = () => {
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
        accessToken: "",
        isLoggedIn: false,
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
                  <Grid item xs={12}>
                    <AccountHeader
                      title={t("wc-1_welcome-player")}
                      text={t("wc-2_tymt-definition")}
                    />
                  </Grid>
                  <Grid item xs={12} container spacing={"32px"} mt={"12px"}>
                    <Grid item xs={12}>
                      <AccountIconBar
                        icon={item1}
                        text={t("wc-3_manage-game-assets")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountIconBar
                        icon={item2}
                        text={t("wc-4_enjoy-traditional-games")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountIconBar
                        icon={item3}
                        text={t("wc-5_browse-game-library")}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AccountIconBar
                        icon={item4}
                        text={t("wc-6_keep-your-assets")}
                      />
                    </Grid>
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
        </Grid>
      </Grid>
    </>
  );
};

export default GetStarted;
