import translate from "translate";
import { languageType } from "../../types/settingTypes";
import { tymt_version } from "../../configs";
import tymtStorage from "../Storage";

export const i18nGoogle = {
  en: "en",
  jp: "ja",
};

export const translateString = async (origin: string) => {
  const languageStore: languageType = JSON.parse(
    await tymtStorage.get(`language_${tymt_version}`)
  );
  const i18nLang = languageStore.language;
  let translatedMessage: string = "";
  const refinedOrigin = origin.replace(/[&#]/g, " ");
  if (i18nLang !== "en") {
    const googleLang = i18nGoogle[i18nLang];
    translatedMessage = await translate(refinedOrigin, {
      from: "en",
      to: googleLang,
    });
  } else {
    translatedMessage = origin;
  }
  return translatedMessage;
};
