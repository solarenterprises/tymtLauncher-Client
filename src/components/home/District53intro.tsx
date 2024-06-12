import { useState, useEffect } from "react";
import { Button, Grid, Box, Stack, Tooltip } from "@mui/material";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import homeStyles from "../../styles/homeStyles";
import "../../fonts/Cobe/Cobe-Regular.ttf";
import districteffect from "../../assets/main/districteffect.svg";
import districteffect1 from "../../assets/main/districteffect1.svg";
import districteffect2 from "../../assets/main/districteffect2.svg";
import { downloadGame, getGameFileSize, isInstalled } from "../../lib/api/Downloads";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import Games from "../../lib/game/Game";
import D53Modal from "./D53Modal";
import { useNotification } from "../../providers/NotificationProvider";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { getDownloadStatus, setDownloadStatus } from "../../features/home/InstallStatusSlice";
import { IDownloadStatus, IInstallStatus } from "../../types/homeTypes";
import { getInstallStatus } from "../../features/home/DownloadStatusSlice";

interface props {
  setImage?: (image: any) => void;
}

const District53intro = ({ setImage }: props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homeclasses = homeStyles();
  const [selected, setSelected] = useState(0);
  const [installed, setInstalled] = useState(false);
  const [d53Open, setD53Open] = useState<boolean>(false);
  const [gameFileSize, setGameFileSize] = useState<string>("");

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const dispatch = useDispatch<AppDispatch>();
  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);
  const installStatusStore: IInstallStatus = useSelector(getInstallStatus);

  const checkInstalled = async () => {
    setInstalled(await isInstalled("district53"));
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
    checkInstalled();
  }, []);

  useEffect(() => {
    const init = async () => {
      const sizeMB = await getGameFileSize("district53");
      if (sizeMB) setGameFileSize(`(${sizeMB} MB)`);
      else setGameFileSize("");
    };
    init();
  }, []);

  return (
    <>
      <Grid
        xs={3}
        sx={{
          flexShrink: 1,
          zIndex: 1,
        }}
      >
        <Grid className={homeclasses.district_content} xs={12}>
          <img
            src={districteffect}
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              zIndex: -1,
            }}
          />
          <img
            src={districteffect1}
            style={{
              position: "absolute",
              left: "0px",
              bottom: "0px",
              zIndex: -1,
            }}
          />
          <img
            src={districteffect2}
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
              zIndex: -1,
            }}
          />
          <Tooltip
            placement="top"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{t("hom-25_click-to-learn")}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Box
              className={"fs-38-bold"}
              sx={{
                color: "white",
                zIndex: 10,
                cursor: "pointer",
              }}
              onClick={() => {
                navigate(`/store/district53`);
              }}
            >
              {t("hom-5_district53")}
            </Box>
          </Tooltip>
          <Box
            className={"fs-16-regular"}
            sx={{
              color: "white",
              textOverflow: "ellipsis",
              overflow: "hidden",
              WebkitLineClamp: 7,
              WebkitBoxOrient: "vertical",
              display: "-webkit-box",
            }}
          >
            {t("hom-6_intro")}
          </Box>
          <Grid xs={12}>
            <Stack direction={"row"} alignItems={"start"} spacing={2} marginTop={"16px"}>
              <Grid xs={12}>
                <Button
                  fullWidth
                  className={"red-button-D53"}
                  disabled={downloadStatusStore.isDownloading && !installed}
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
                          setDownloadStatus({
                            ...downloadStatusStore,
                            isDownloading: true,
                            name: "district53",
                          })
                        );
                        const downloadable = await downloadGame("district53");
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
                          setDownloadStatus({
                            ...downloadStatusStore,
                            isDownloading: false,
                            name: "",
                          })
                        );
                        checkInstalled();
                      } else {
                        setD53Open(true);
                      }
                    }
                  }}
                >
                  {!downloadStatusStore.isDownloading && !installStatusStore.isInstalling && installed && t("hom-7_play-game")}
                  {!downloadStatusStore.isDownloading && !installStatusStore.isInstalling && !installed && t("hom-20_install-game")}
                  {downloadStatusStore.isDownloading && (
                    <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                      <Box className={"fs-14-regular white t-center"}>{`${t("hom-21_downloading")} ${gameFileSize}`}</Box>
                      <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
                    </Stack>
                  )}
                  {!downloadStatusStore.isDownloading && installStatusStore.isInstalling && (
                    <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
                      <Box className={"fs-14-regular white t-center"}>{`${t("hom-26_installing")}`}</Box>
                      <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
                    </Stack>
                  )}
                </Button>
              </Grid>
            </Stack>
          </Grid>
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
            {Games["district53"].images.map((image, index) => (
              <SwiperSlide style={{ width: "150px" }}>
                <img
                  key={`district53-${index}`}
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
      </Grid>
      <D53Modal open={d53Open} setOpen={setD53Open} />
    </>
  );
};

export default District53intro;
