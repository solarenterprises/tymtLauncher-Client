import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";
import Avatar from "../../components/home/Avatar";
import InputText from "../../components/account/InputText";

import { AppDispatch } from "../../store";
import { getNonCustodial, setNonCustodial } from "../../features/account/NonCustodialSlice";
import { getCustodial, setCustodial } from "../../features/account/CustodialSlice";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { setAccount, getAccount } from "../../features/account/AccountSlice";
import { fileUpload, updateUserNickname } from "../../features/account/AccountApi";

import { notificationType, propsType } from "../../types/settingTypes";
import { accountType, custodialType, nonCustodialType, walletEnum } from "../../types/accountTypes";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";

const Profile = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const account: accountType = useSelector(getAccount);
  const nonCustodial: nonCustodialType = useSelector(getNonCustodial);
  const custodial: custodialType = useSelector(getCustodial);
  const notificationStore: notificationType = useSelector(selectNotification);
  const userStore = account.wallet === walletEnum.noncustodial ? nonCustodial : custodial;
  const [nickname, setNickname] = useState(userStore.nickname);

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const updateAccount = useCallback(async () => {
    try {
      account.wallet === walletEnum.noncustodial
        ? dispatch(setNonCustodial({ ...nonCustodial, nickname: nickname }))
        : dispatch(setCustodial({ ...custodial, nickname: nickname }));
      const res = await updateUserNickname(account.uid, nickname);
      console.log(res.data, "updateUserNickName");
      setNotificationStatus("success");
      setNotificationTitle(t("alt-1_nickname-saved"));
      setNotificationDetail(t("alt-2_nickname-saved-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
    } catch (err) {
      console.log(err);
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-3_nickname-notsaved"));
      setNotificationDetail(t("alt-4_nickname-notsaved-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [nickname, nonCustodial, custodial, account]);

  const UploadFile = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const uploadImg = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    const formData = new FormData();
    formData.append("file", file);
    fileUpload(formData)
      .then((res) => {
        dispatch(
          setAccount({
            ...account,
            avatar: res.data.avatar,
          })
        );
        dispatch(
          setNonCustodial({
            ...nonCustodial,
            avatar: res.data.avatar,
          })
        );
        setNotificationStatus("success");
        setNotificationTitle(t("alt-32_avatar-saved"));
        setNotificationDetail(t("alt-33_avatar-saved-intro"));
        setNotificationOpen(true);
        setNotificationLink(null);
      })
      .catch((err) => {
        console.log(err);
        setNotificationStatus("failed");
        setNotificationTitle(t("alt-34_avatar-notsaved"));
        setNotificationDetail(t("alt-35_avatar-notsaved-intro"));
        setNotificationOpen(true);
        setNotificationLink(null);
      });
  };

  return (
    <>
      {view === "profile" && (
        <Stack direction={"column"}>
          <input type="file" id="file-input" onChange={uploadImg} style={{ display: "none" }} />
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-10_profile")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"}>
            <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"30px"}>
              <Stack direction={"row"} justifyContent={"center"} textAlign={"right"} alignItems={"center"} gap={"10px"}>
                <Box className="center-align">
                  {/* <img src={avatar} /> */}
                  <Avatar onlineStatus={true} url={account.avatar} size={92} status={!notificationStore.alert ? "donotdisturb" : "online"} />
                </Box>
                <Box className="fs-h5 white">{t("set-68_change-avatar")}</Box>
              </Stack>
              <Box className="center-align">
                <Box sx={{ display: "flex" }} className="common-btn" onClick={UploadFile}>
                  <Tooltip title={t("set-82_edit")} classes={{ tooltip: classname.tooltip }}>
                    <img src={editIcon} style={{ cursor: "pointer" }} />
                  </Tooltip>
                </Box>
              </Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"center"} padding={"20px"}>
              <Box className="fs-h4 white">
                <InputText id="change-nickname" label={t("set-69_change-nickname")} type="text" value={nickname} setValue={setNickname} />
              </Box>
              <Box textAlign={"left"} className="fs-14-light gray p-t-10">
                {t("set-70_nickname-detail")}
              </Box>
            </Stack>
            <Box padding={"20px"} width={"90%"} sx={{ position: "absolute", bottom: "30px" }}>
              <Button fullWidth className={classname.action_button} onClick={updateAccount}>
                {t("set-57_save")}
              </Button>
            </Box>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Profile;
