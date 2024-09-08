import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { emit } from "@tauri-apps/api/event";
import { useFormik } from "formik";
import * as Yup from "yup";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Box, Button, Divider, Stack } from "@mui/material";

import InputText from "../../components/account/InputText";
import MnemonicRevealPad from "../../components/account/MnemonicRevealPad";

import { getAccount } from "../../features/account/AccountSlice";

import { decrypt, getKeccak256Hash } from "../../lib/api/Encrypt";

import { propsType } from "../../types/settingTypes";
import { INotificationParams } from "../../types/NotificationTypes";
import { IAccount } from "../../types/accountTypes";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";

const Backup = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();

  const accountStore: IAccount = useSelector(getAccount);

  const [passphrase, setPassphrase] = useState<string>("");
  const [blur, setBlur] = useState<boolean>(true);
  const [time, setTime] = useState<number>(10);

  const handleSubmit = useCallback(
    async (password: string) => {
      try {
        const decryptedPassphrase = await decrypt(accountStore?.mnemonic, password);
        setPassphrase(decryptedPassphrase);
        const noti_0: INotificationParams = {
          status: "success",
          title: `Success`,
          message: `Passphrase has been revealed!`,
          link: null,
          translate: true,
        };
        emit(TauriEventNames.NOTIFICATION, noti_0);
      } catch (err) {
        console.error("Failed to handleSubmit: ", err);
        const noti_0: INotificationParams = {
          status: "failed",
          title: `Error`,
          message: `Backup failed during decryption!`,
          link: null,
          translate: true,
        };
        emit(TauriEventNames.NOTIFICATION, noti_0);
      }
    },
    [accountStore]
  );

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("cca-63_required"))
        .test("equals", t("cca-60_wrong-password"), (value) => getKeccak256Hash(value) === accountStore?.password),
    }),
    onSubmit: () => handleSubmit(formik.values.password),
  });

  useEffect(() => {
    if (formik.touched.password && formik.errors.password) {
      setBlur(true);
      setPassphrase("");
      setTime(10);
    }
  }, [formik.touched.password, formik.errors.password]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!blur) {
      intervalId = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1 * 1e3);
    } else {
      if (intervalId) clearInterval(intervalId);
      setTime(10);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [blur]);

  return (
    <>
      {view === "backup" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button
              className={"setting-back-button"}
              onClick={() => {
                setView("security");
                setBlur(true);
                setPassphrase("");
                setTime(10);
                formik.resetForm();
              }}
            >
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-89_backup-passphrase")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Stack direction={"column"} justifyContent={""}>
              <Stack direction={"column"} justifyContent={"flex-start"} padding={"20px"}>
                <Box className="fs-h4 white">
                  <InputText
                    id="old-password"
                    name={"password"}
                    label={t("cca-39_your-password")}
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password ? true : false}
                  />
                </Box>
                {formik.touched.password && formik.errors.password && (
                  <Box className={"fs-16-regular red"} ml={"8px"}>
                    {formik.errors.password}
                  </Box>
                )}
              </Stack>
              <Box>
                <MnemonicRevealPad passphrase={passphrase} blur={blur} setBlur={setBlur} />
              </Box>
              <Box
                className={"fs-16-regular white"}
                sx={{
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  display: "-webkit-box",
                  whiteSpace: "pre-line",
                  margin: "12px 36px",
                }}
              >
                {passphrase && blur && t("set-90_to-reveal-passphrase")}
                {!passphrase && blur && t("set-91_please-input-passphrase")}
                {passphrase && !blur && `${t("set-92_will-blur-again")} ${time} ${t("set-93_seconds")}`}
              </Box>
              <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
                <Button fullWidth className={classname.action_button} disabled={formik.errors.password ? true : false} type="submit">
                  {t("ncca-51_confirm")}
                </Button>
              </Box>
            </Stack>
          </form>
        </Stack>
      )}
    </>
  );
};

export default Backup;
