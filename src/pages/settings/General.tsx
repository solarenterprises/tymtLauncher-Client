import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import backIcon from "../../assets/settings/back-icon.svg";
import arrowImg from "../../assets/settings/arrow-right.svg";
import { selectLanguage } from "../../features/settings/LanguageSlice";
import { propsType } from "../../types/settingTypes";

const General = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const language = useSelector(selectLanguage);

  return (
    <>
      {view === "general" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} className="p-20">
            <Button className={"setting-back-button"} onClick={() => setView("main")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-6_settings")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"}>
            <Button className="common-btn" onClick={() => setView("language")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Stack direction={"column"} justifyContent={"flex-start"} gap={1} textAlign={"left"}>
                  <Box className="fs-h4 white">{t("set-7_language")}</Box>
                  <Box className="fs-16-regular gray">{t("set-8_choose-application-language")}</Box>
                </Stack>
                <Stack direction={"row"} justifyContent={"flex-end"} textAlign={"center"} gap={1}>
                  <Box className="fs-16-regular center-align gray">
                    {language == "en" && t("set-9_english")}
                    {language == "jp" && t("set-17_japanese")}
                  </Box>
                  <Box className="center-align">
                    <img src={arrowImg} />
                  </Box>
                </Stack>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" onClick={() => setView("profile")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-10_profile")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              onClick={() => {
                setView("notification");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-11_notifications")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button className="common-btn" onClick={() => setView("chat")}>
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-12_chat")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              onClick={() => {
                setView("wallet");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-13_wallet")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />

            <Button
              className="common-btn"
              onClick={() => {
                setView("security");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-14_security-privacy")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />

            <Button
              className="common-btn"
              onClick={() => {
                setView("about");
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"} padding={"15px"}>
                <Box className="fs-h4 white">{t("set-15_about")}</Box>
                <Box className="center-align">
                  <img src={arrowImg} />
                </Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default General;
