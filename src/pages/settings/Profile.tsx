import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Box, Button, Divider, Stack, Tooltip } from "@mui/material";

import { useNotification } from "../../providers/NotificationProvider";
import { useSocket } from "../../providers/SocketProvider";

import Avatar from "../../components/home/Avatar";
import InputText from "../../components/account/InputText";

import { AppDispatch } from "../../store";
import { selectNotification } from "../../features/settings/NotificationSlice";
import { fileUpload, updateUserNickname } from "../../features/account/AccountApi";

import { notificationType, propsType } from "../../types/settingTypes";
import { IAccount } from "../../types/accountTypes";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";
import editIcon from "../../assets/settings/edit-icon.svg";
import { ISocketParamsSyncEventsAll } from "../../types/SocketTypes";
import { SyncEventNames } from "../../consts/SyncEventNames";
import { IMyInfo } from "../../types/chatTypes";
import { getMyInfo, setMyInfo } from "../../features/account/MyInfoSlice";
import { getAccount, setAccount } from "../../features/account/AccountSlice";

const Profile = ({ view, setView }: propsType) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const accountStore: IAccount = useSelector(getAccount);
  const notificationStore: notificationType = useSelector(selectNotification);
  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const [nickname, setNickname] = useState(accountStore?.nickName);
  const [error, setError] = useState<string>("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const validationSchema = Yup.string()
    .required(t("cca-63_required"))
    .min(3, t("ncca-59_too-short"))
    .max(50, t("ncca-60_too-long"))
    .matches(/^[a-zA-Z0-9_ !@#$%^&*()\-+=,.?]+$/, t("ncca-61_invalid-characters"));

  const updateAccount = useCallback(async () => {
    try {
      await validationSchema.validate(nickname);
      setError("");

      dispatch(setAccount({ ...accountStore, nickName: nickname }));

      const res = await updateUserNickname(myInfoStore?._id, nickname);
      console.log(res.data, "updateUserNickName");

      setNotificationStatus("success");
      setNotificationTitle(t("alt-1_nickname-saved"));
      setNotificationDetail(t("alt-2_nickname-saved-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      }
      console.log(err);

      setNotificationStatus("failed");
      setNotificationTitle(t("alt-3_nickname-notsaved"));
      setNotificationDetail(t("alt-4_nickname-notsaved-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [nickname, accountStore, myInfoStore]);

  const UploadFile = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const uploadImg = useCallback(() => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    const formData = new FormData();
    formData.append("file", file);
    fileUpload(formData)
      .then((res) => {
        dispatch(
          setMyInfo({
            ...myInfoStore,
            avatar: res.data.avatar,
          })
        );

        if (socket.current && socket.current.connected) {
          const data: ISocketParamsSyncEventsAll = {
            sender_id: myInfoStore?._id,
            instructions: [SyncEventNames.UPDATE_IMAGE_RENDER_TIME],
            is_to_self: true,
          };
          socket.current.emit("sync-events-all", JSON.stringify(data));
          console.log("socket.current.emit > sync-events-all", data);
        }

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
  }, [socket.current, myInfoStore]);

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
                  <Avatar onlineStatus={true} url={myInfoStore?.avatar} size={92} status={!notificationStore.alert ? "donotdisturb" : "online"} />
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
              {error && (
                <Stack mt={"8px"} padding={"0px 6px"} width={"100%"}>
                  <Box className={"fs-16-regular red"}>{error}</Box>
                </Stack>
              )}
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
