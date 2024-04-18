import { Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Games, { Game } from "../../lib/game/Game";
import { languageType } from "../../types/settingTypes";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../features/settings/LanguageSlice";

const Overview = () => {
  const param = useParams();
  const id: string = param.gameid ?? "";
  const game: Game = Games[id];
  const { t } = useTranslation();
  const [select, setSelect] = useState(0);
  const [image, setImage] = useState(game.images[0]);
  const langStore: languageType = useSelector(selectLanguage);
  const lang = langStore.language;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const temp = (select + 1) % game.images.length;
      setSelect(temp);
      setImage(game.images[temp]);
    }, 3 * 1000);

    return () => clearInterval(intervalId);
  }, [game.images.length, select]);

  return (
    <>
      <Box className={"fs-40-bold white"} marginTop={"24px"}>
        {t("ga-10_overview")}
      </Box>
      <Box className={"fs-24-bold white"} marginTop={"32px"}>
        {t("ga-12_introduction")}
      </Box>
      <Box
        className={"fs-16-light"}
        sx={{
          marginTop: "16px",
          color: "white",
          textOverflow: "ellipsis",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: game.introduction[lang].replace(/\n/g, "<br>"),
          }}
        ></div>
      </Box>
      <Box className={"fs-24-bold white"} marginTop={"32px"}>
        {t("ga-13_heroes")}
      </Box>
      <Box
        className={"fs-16-light"}
        sx={{
          marginTop: "16px",
          color: "white",
          textOverflow: "ellipsis",
          overflow: "hidden",
          WebkitBoxOrient: "vertical",
          display: "-webkit-box",
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: game.heroes[lang].replace(/\n/g, "<br>"),
          }}
        ></div>
      </Box>
      <Box className={"fs-24-bold white"} marginTop={"32px"}>
        {t("ga-14_screens")}
        <Grid item xs={12} marginTop={"20px"}>
          <img
            className="District53"
            src={image}
            width={"100%"}
            style={{
              aspectRatio: "1.78",
              borderRadius: "16px",
              opacity: 1,
              flexShrink: 1,
            }}
            loading="lazy"
          />
        </Grid>
      </Box>
    </>
  );
};

export default Overview;
