import { useEffect, useState } from "react";
import { Grid, Stack, Box, Button, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewType } from "../../types/storeTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import storeStyles from "../../styles/StoreStyles";
import solar from "../../assets/chains/solar.svg";
import Xicon from "../../assets/main/XIcon.png";
import linkicon from "../../assets/main/linkIcon.png";
import facebookicon from "../../assets/main/facebookIcon.png";
import discordicon from "../../assets/main/discordIcon.png";
import gradient1 from "../../assets/main/gradient-gameoverview.svg";
import SwitchBtnGameview from "./SwitchButton";
import { getViewmode } from "../../features/store/Gameview";
import AdviceModal from "./AdviceModal";
import Overview from "./Overview";
import Review from "./Review";
import { downloadGame, getGameFileSize, isInstalled, openLink } from "../../lib/api/Downloads";
import ComingModal from "../ComingModal";
import { processType } from "../../types/homeTypes";
import { getProcess, setProcess } from "../../features/home/InstallprocessSlice";
import { AppDispatch } from "../../store";
import Games, { Game } from "../../lib/game/Game";
import WarningModal from "../home/WarningModal";
import { selectLanguage } from "../../features/settings/LanguageSlice";
import { languageType } from "../../types/settingTypes";
import { removeDir } from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import Loading from "../Loading";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import D53Modal from "../home/D53Modal";
import { tymt_version } from "../../configs";
import { useNotification } from "../../providers/NotificationProvider";
import { platformIconMap } from "../../types/GameTypes";
import { chainIconMap } from "../../types/walletTypes";
import { ThreeDots } from "react-loader-spinner";

const GameOverview = () => {
  const viewmode: viewType = useSelector(getViewmode);
  const dispatch = useDispatch<AppDispatch>();
  const classes = storeStyles();
  const param = useParams();
  const id: string = param.gameid ?? "";
  const game: Game = Games[id];
  const processStore: processType = useSelector(getProcess);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [selected, setSelected] = useState(0);
  const [image, setImage] = useState(Games[id].images[0]);
  const [view, setView] = useState(false);
  const [warningView, setWarningView] = useState<boolean>(false);
  const langStore: languageType = useSelector(selectLanguage);
  const lang = langStore.language;
  const [loading, setLoading] = useState<boolean>(false);
  const [d53Open, setD53Open] = useState<boolean>(false);
  const [gameFileSize, setGameFileSize] = useState<string>("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const checkInstalled = async (_id: string) => {
    setInstalled(await isInstalled(_id));
  };

  const checkOnline = async (): Promise<boolean> => {
    try {
      await fetch("https://www.google.com", {
        mode: "no-cors",
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    checkInstalled(id);
  }, [id]);

  useEffect(() => {
    const init = async () => {
      const sizeMB = await getGameFileSize(id);
      if (sizeMB) setGameFileSize(`(${sizeMB} MB)`);
      else setGameFileSize("");
    };
    init();
  }, [id]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Grid item xs={12} container className={classes.gameoverview_container}>
            <img src={gradient1} style={{ position: "absolute", right: 0, top: 0 }} />
            <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
              <Grid item xs={8} flexDirection={"row"} justifyContent={"space-between"} display={"flex"} paddingRight={"20px"}>
                <Stack flexDirection={"row"} alignItems={"center"}>
                  <Box
                    component={"img"}
                    height={game.name === "Veloren" ? "55px" : "84px"}
                    src={game.logo}
                    sx={{
                      borderRadius: "16px",
                    }}
                  />
                  <Box className="m-10">
                    <Box className={"fs-40-bold white"}>{game.name}</Box>
                  </Box>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <img src={solar} width={"24px"} />
                  <Box className={"fs-20-regular white"}>0.0</Box>
                  <Box className={classes.chip_free}>{t("hom-15_free")}</Box>
                </Stack>
              </Grid>
              <Grid item xs={4} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} paddingLeft={"10px"}>
                <Grid item xs={9}>
                  <Button
                    className={"red-button-Gameoverview"}
                    fullWidth
                    disabled={processStore.inprogress && !installed}
                    onClick={async () => {
                      const online = await checkOnline();
                      if (!online) {
                        setNotificationStatus("failed");
                        setNotificationTitle(t("alt-26_internet-error"));
                        setNotificationDetail(t("alt-27_you-not-connected"));
                        setNotificationOpen(true);
                        setNotificationLink(null);
                      } else {
                        if (!installed) {
                          setNotificationStatus("success");
                          setNotificationTitle(t("alt-28_download-start"));
                          setNotificationDetail(t("alt-29_wait-for-a-few"));
                          setNotificationOpen(true);
                          setNotificationLink(null);
                          dispatch(
                            setProcess({
                              ...processStore,
                              inprogress: true,
                              name: id,
                            })
                          );
                          const downloadable = await downloadGame(id);
                          if (!downloadable) {
                            setNotificationStatus("failed");
                            setNotificationTitle(t("alt-5_os-not-support"));
                            setNotificationDetail(t("alt-6_os-not-support-intro"));
                            setNotificationOpen(true);
                            setNotificationLink(null);
                          } else {
                            setNotificationStatus("success");
                            setNotificationTitle(t("alt-7_download-finish"));
                            setNotificationDetail(t("alt-8_now-play-game"));
                            setNotificationOpen(true);
                            setNotificationLink(null);
                          }
                          dispatch(
                            setProcess({
                              ...processStore,
                              inprogress: false,
                              name: "",
                            })
                          );
                          await checkInstalled(id);
                        } else {
                          if (id === "district53") {
                            setD53Open(true);
                          } else {
                            setWarningView(true);
                          }
                        }
                      }
                    }}
                  >
                    {installed && t("hom-7_play-game")}
                    {!processStore.inprogress && !installed && t("hom-20_install-game")}
                    {processStore.inprogress && !installed && (
                      <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                        <Box className={"fs-14-regular white t-center"}>{`${t("hom-21_downloading")} ${gameFileSize}`}</Box>
                        <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
                      </Stack>
                    )}
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    className="button_navbar_common"
                    disabled={!installed}
                    onClick={async () => {
                      setLoading(true);
                      await removeDir((await appDataDir()) + `v${tymt_version}/games/${id}`, {
                        recursive: true,
                      });
                      setNotificationStatus("success");
                      setNotificationTitle(t("alt-30_game-removed"));
                      setNotificationDetail(t("alt-31_game-removed-intro"));
                      setNotificationOpen(true);
                      setNotificationLink(null);
                      await checkInstalled(id);
                      setLoading(false);
                    }}
                  >
                    <DeleteOutlineRoundedIcon
                      sx={{
                        color: "white",
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} container display={"flex"} justifyContent={"space-between"} marginTop={"32px"}>
              <Grid item paddingRight={"25px"} sx={{ width: "calc(100% - 320px)" }}>
                <Grid item xs={12}>
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
                <Grid
                  xs={12}
                  sx={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "left",
                    overflow: "hidden",
                  }}
                >
                  <Swiper spaceBetween={15} slidesPerView={"auto"} loop={true}>
                    {game.images.map((image, index) => (
                      <SwiperSlide style={{ width: "150px" }}>
                        <img
                          key={`${id}-${index}`}
                          src={image}
                          width={`150px`}
                          height={`120px`}
                          onClick={() => {
                            setSelected(index);
                            setImage(image);
                          }}
                          style={{
                            cursor: "pointer",
                            opacity: selected === index ? 1 : 0.7,
                            border: selected === index ? "2px solid #52e1f2" : "none",
                            borderRadius: "16px",
                            marginRight: "10px",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Grid>

                <Grid item xs={12} marginTop={"32px"}>
                  <Box>
                    <SwitchBtnGameview />
                  </Box>
                  {viewmode.mode === "overview" && <Overview />}
                  {viewmode.mode === "review" && <Review />}
                </Grid>
              </Grid>
              <Grid item sx={{ width: "320px" }}>
                <Box
                  className={"fs-16-regular"}
                  sx={{
                    color: "white",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    WebkitLineClamp: 8,
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
                <Box gap={1.5} marginTop={"30px"} display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
                  {game.tabs.map((tab) => (
                    <Box className="fs-14-regular white card_genre_label_GO">{tab}</Box>
                  ))}
                </Box>
                <Box marginTop={"24px"}>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{t("sto-4_platform")}</Box>
                    <Box>
                      {game.platforms.map((os) => (
                        <img src={platformIconMap.get(os)} width={"16px"} className={classes.platform} />
                      ))}
                    </Box>
                  </Box>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{`${t("sto-2_chains")}: ${game.chains.length}`}</Box>
                    <Stack direction={"row"}>
                      {game.chains.map((element) => (
                        <img src={chainIconMap.get(element)} width={"16px"} style={{ marginRight: "-4px" }} />
                      ))}
                    </Stack>
                  </Box>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{t("ga-1_developer")}</Box>
                    <Box className={"fs-14-regular white"}>{game.developers}</Box>
                  </Box>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{t("ga-2_publisher")}</Box>
                    <Box className={"fs-14-regular white"}>{game.publisher}</Box>
                  </Box>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{t("sto-1_release-date")}</Box>
                    <Box className={"fs-14-regular white"}>{game.release}</Box>
                  </Box>
                  <Box className={classes.box_gameoption}>
                    <Box className={"fs-14-regular gray"}>{t("ga-3_recommended-age")}</Box>
                    <Box className={"fs-14-regular white"}>12</Box>
                  </Box>
                </Box>
                {id === "district53" && (
                  <Box marginTop={"24px"} borderBottom={"1px solid rgba(255, 255, 255, 0.10)"} paddingBottom={"16px"}>
                    <Box className={"fs-20-regular white"}>{t("ga-5_follow-game-on")}</Box>

                    <Box marginTop={"16px"} display={"flex"} flexDirection={"row"} gap={2}>
                      <Tooltip
                        key={`tooltip-website`}
                        title={t("ga-17_open-website")}
                        classes={{ tooltip: classes.tooltip }}
                        PopperProps={{
                          placement: "bottom",
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [8, -1],
                              },
                            },
                          ],
                        }}
                      >
                        <Button
                          className="button_navbar_common"
                          onClick={() => {
                            openLink(game.links.website);
                          }}
                        >
                          <img src={linkicon} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        key={`tooltip-twitter`}
                        title={t("ga-19_go-x")}
                        classes={{ tooltip: classes.tooltip }}
                        PopperProps={{
                          placement: "bottom",
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [8, -1],
                              },
                            },
                          ],
                        }}
                      >
                        <Button
                          className="button_navbar_common"
                          onClick={() => {
                            openLink(game.links.twitter);
                          }}
                        >
                          <img src={Xicon} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        key={`tooltip-facebook`}
                        title={t("ga-20_go-facebook")}
                        classes={{ tooltip: classes.tooltip }}
                        PopperProps={{
                          placement: "bottom",
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [8, -1],
                              },
                            },
                          ],
                        }}
                      >
                        <Button
                          className="button_navbar_common"
                          onClick={() => {
                            openLink(game.links.facebook);
                          }}
                        >
                          <img src={facebookicon} />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        key={`tooltip-discord`}
                        title={t("ga-21_go-discord")}
                        classes={{ tooltip: classes.tooltip }}
                        PopperProps={{
                          placement: "bottom",
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [8, -1],
                              },
                            },
                          ],
                        }}
                      >
                        <Button
                          className="button_navbar_common"
                          onClick={() => {
                            openLink(game.links.discord);
                          }}
                        >
                          <img src={discordicon} />
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                )}

                <Box marginTop={"16px"} borderBottom={"1px solid rgba(255, 255, 255, 0.10)"} paddingBottom={"16px"}>
                  <Box className={"fs-20-regular white"}>{t("ga-28_minimum-requirement")}</Box>
                  <Box className={"fs-16 white"} marginTop={"14px"}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: game.requirement.replace(/\n/g, "<br>"),
                      }}
                    ></div>
                  </Box>
                </Box>
                {id === "district53" && (
                  <Box marginTop={"24px"} paddingBottom={"16px"}>
                    <Box className={"fs-20-regular white"}>{t("ga-6_permissions")}</Box>
                    <Box className={"fs-16 white"} marginTop={"14px"}>
                      {t("ga-7_this-game-will")}
                    </Box>
                  </Box>
                )}
                {/* <Stack marginTop={"16px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box className={"fs-20-regular white"}>{t("ga-6_permissions")}</Box>
                  <Button className={classes.modal_btn_left} onClick={() => setView(true)}>
                    <Box className={"fs-18-bold"} color={"var(--Main-Blue, #52E1F2)"}>
                      {t("ga-9_report")}
                    </Box>
                  </Button>
                </Stack> */}
              </Grid>
            </Grid>
            <AdviceModal open={open} setOpen={setOpen} />
          </Grid>
        </motion.div>
      </AnimatePresence>
      <ComingModal open={view} setOpen={setView} />
      <WarningModal open={warningView} setOpen={setWarningView} id={id} />
      <D53Modal open={d53Open} setOpen={setD53Open} />
      {loading && <Loading />}
    </>
  );
};

export default GameOverview;
