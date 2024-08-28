import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Divider, Stack } from "@mui/material";

import { AppDispatch } from "../../store";
import { selectLanguage, setLanguage } from "../../features/settings/LanguageSlice";

import backIcon from "../../assets/settings/back-icon.svg";
import checkImg from "../../assets/settings/check-icon.svg";

import { propsType } from "../../types/settingTypes";
import { languageType } from "../../types/settingTypes";
import { setCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

const Language = ({ view, setView }: propsType) => {
  const dispatch = useDispatch<AppDispatch>();
  const language: languageType = useSelector(selectLanguage);

  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();

  const setLang = useCallback(
    (lang: string) => {
      dispatch(setLanguage({ ...language, language: lang }));
    },
    [language]
  );
  useEffect(() => {
    changeLanguage(language.language);
  }, [language.language]);

  return (
    <>
      {view === "language" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("general")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-16_application-language")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setLang("en");
                dispatch(setCurrentCurrency("USD"));
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-9_english")}</Box>
                <Box className="center-align">{language.language == "en" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Button
              className="common-btn"
              sx={{ padding: "20px" }}
              onClick={() => {
                setLang("jp");
                dispatch(setCurrentCurrency("JPY"));
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                <Box className="fs-h4 white">{t("set-17_japanese")}</Box>
                <Box className="center-align">{language.language == "jp" && <img src={checkImg} />}</Box>
              </Stack>
            </Button>
            <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Language;
