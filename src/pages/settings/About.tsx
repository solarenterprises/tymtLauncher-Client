import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

import backIcon from "../../assets/settings/back-icon.svg";
import externalIcon from "../../assets/settings/external-link.svg";
import twitterIcon from "../../assets/settings/twitter-icon.svg";
import discordIcon from "../../assets/settings/discord-icon.svg";
import { propsType } from "../../types/settingTypes";
import { openLink } from "../../lib/helper/DownloadHelper";
import { tymtlinks } from "../../lib/setting/tymtlinks";
import Tymtlinks from "../../lib/setting/tymtlinks";
import { tymt_version } from "../../configs";

const About = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const tymtlinks: tymtlinks = Tymtlinks;
  return (
    <>
      {view === "about" && (
        <>
          <Stack direction={"column"}>
            <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} className="p-20">
              <Button className={"setting-back-button"} onClick={() => setView("general")}>
                <Box component={"img"} src={backIcon}></Box>
              </Button>
              <Box className="fs-h3 white">{t("set-50_about")}</Box>
            </Stack>
            <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
            <Stack direction={"column"} justifyContent={""}>
              <Button
                className="common-btn"
                sx={{ padding: "20px" }}
                onClick={() => {
                  openLink(tymtlinks.links.documentation);
                }}
              >
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white">{t("set-51_documentation")}</Box>
                  <Box className="center-align">
                    <img src={externalIcon} />
                  </Box>
                </Stack>
              </Button>
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              <Button
                className="common-btn"
                sx={{ padding: "20px" }}
                onClick={() => {
                  openLink(tymtlinks.links.policy);
                }}
              >
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white">{t("set-52_privacy-policy")}</Box>
                  <Box className="center-align">
                    <img src={externalIcon} />
                  </Box>
                </Stack>
              </Button>
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              {/* <Button
                className="common-btn"
                sx={{ padding: "20px" }}
                onClick={() => {
                  openLink(tymtlinks.links.termsofservice);
                }}
              >
                <Stack direction={"row"} justifyContent={"space-between"} textAlign={"center"}>
                  <Box className="fs-h4 white">{t("set-53_terms-service")}</Box>
                  <Box className="center-align">
                    <img src={externalIcon} />
                  </Box>
                </Stack>
              </Button> */}
              <Divider variant="fullWidth" sx={{ backgroundColor: "#FFFFFF1A" }} />
              <Stack direction={"column"} justifyContent={"flex-start"} textAlign={"left"} gap={"20px"} padding={"20px"}>
                <Box className="fs-h4 white">{t("set-54_follow-us")}</Box>
                <Stack direction={"row"} justifyContent={"flex-start"} gap={"10px"}>
                  <Button
                    className="button_navbar_common"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      openLink(tymtlinks.links.twitter);
                    }}
                  >
                    <Box className="center-align">
                      <img src={twitterIcon} />
                    </Box>
                  </Button>
                  <Button
                    className="button_navbar_common"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      openLink(tymtlinks.links.discord);
                    }}
                  >
                    <Box className="center-align">
                      <img src={discordIcon} />
                    </Box>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Box
            className="fs-16-regular light"
            sx={{
              position: "absolute",
              bottom: "40px",
              left: "16px",
            }}
          >
            {`${t("set-84_app-version")} v${tymt_version}`}
          </Box>
        </>
      )}
    </>
  );
};

export default About;
