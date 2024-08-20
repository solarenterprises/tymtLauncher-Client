import { useState, useEffect } from "react";
import { Grid, Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getLibrarymode } from "../../features/library/Librarymode";
import { useSelector } from "react-redux";
import nogames from "../../assets/main/nogames.png";
import { librarymodeType } from "../../types/homeTypes";
import Games from "../../lib/game/Game";
import { isInstalled } from "../../lib/api/Downloads";
import { useNavigate } from "react-router-dom";
import solar from "../../assets/chains/solar.svg";
import Loading from "../Loading";
import AnimatedComponent from "../AnimatedComponent";

const Libraryshow = () => {
  const { t } = useTranslation();
  const data: librarymodeType = useSelector(getLibrarymode);
  const navigate = useNavigate();
  const [installList, setInstallList] = useState<string[]>([]);
  const [uninstallList, setUninstallList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await checkInstalled();
      setLoading(false);
    };
    init();
  }, []);

  const checkInstalled = async () => {
    const list: string[] = Object.keys(Games).map((rowKey, _index) => rowKey);
    const tempInstallList: string[] = [];
    const tempUninstallList: string[] = [];
    for (let i = 0; i < list.length; i++) {
      if (await isInstalled(list[i])) {
        tempInstallList.push(list[i]);
      } else {
        tempUninstallList.push(list[i]);
      }
    }
    setInstallList(tempInstallList);
    setUninstallList(tempUninstallList);
  };

  return (
    <>
      <Grid item xs={12}>
        {data.mode === 0 && <Box className={"fs-40-bold white"}>{t("lib-1_your-games")}</Box>}
        {data.mode === 1 && <Box className={"fs-40-bold white"}>{t("lib-2_wishlist")}</Box>}
        {data.mode === 2 && <Box className={"fs-40-bold white"}>{t("lib-3_download")}</Box>}
        {data.mode === 3 && <Box className={"fs-40-bold white"}>{t("lib-5_coming")}</Box>}
      </Grid>
      <Grid item xs={12} container spacing={"32px"} mt={"32px"}>
        {loading && <Loading />}
        {data.mode === 0 &&
          installList.map((rowKey) => (
            <Grid item>
              <AnimatedComponent>
                <Box className="card_freegame_container" onClick={() => navigate(`/store/${rowKey}`)}>
                  <Stack>
                    <img src={Games[rowKey].thumbnail} width={"100%"} height={"180px"} style={{ borderRadius: "16px" }} />
                  </Stack>
                  <Box padding={"16px 14px 14px"}>
                    <Box className={"fs-20-regular white"}>{Games[rowKey].name}</Box>
                    <Grid item xs={12} container mt={"8px"} spacing={"8px"}>
                      {Games[rowKey].tabs.map((tab) => (
                        <Grid item>
                          <Box className="fs-14-regular white card_genre_label">{tab}</Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Stack direction={"row"} alignItems={"center"} spacing={1} mt={"16px"}>
                      <Box component={"img"} width={"20px"} height={"20px"} src={solar} />
                      <Box className={"fs-16-regular white"}>0.0</Box>
                    </Stack>
                  </Box>
                </Box>
              </AnimatedComponent>
            </Grid>
          ))}
        {data.mode === 0 && installList.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={nogames} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
        {data.mode === 2 &&
          uninstallList.map((rowKey) => (
            <Grid item>
              <AnimatedComponent>
                <Box className="card_freegame_container" onClick={() => navigate(`/store/${rowKey}`)}>
                  <Stack>
                    <img src={Games[rowKey].thumbnail} width={"100%"} height={"180px"} style={{ borderRadius: "16px" }} />
                  </Stack>
                  <Box padding={"16px 14px 14px"}>
                    <Box className={"fs-20-regular white"}>{Games[rowKey].name}</Box>
                    <Grid item xs={12} container mt={"8px"} spacing={"8px"}>
                      {Games[rowKey].tabs.map((tab) => (
                        <Grid item>
                          <Box className="fs-14-regular white card_genre_label">{tab}</Box>
                        </Grid>
                      ))}
                    </Grid>
                    <Stack direction={"row"} alignItems={"center"} spacing={1} mt={"16px"}>
                      <Box component={"img"} width={"20px"} height={"20px"} src={solar} />
                      <Box className={"fs-16-regular white"}>0.0</Box>
                    </Stack>
                  </Box>
                </Box>
              </AnimatedComponent>
            </Grid>
          ))}
        {data.mode === 2 && uninstallList.length === 0 && (
          <Grid item xs={12} container justifyContent={"center"} marginTop={"32px"}>
            <AnimatedComponent>
              <Stack flexDirection={"column"} justifyContent={"center"}>
                <Box component={"img"} src={nogames} width={"300px"} height={"300px"} alignSelf={"center"} />
                <Box className={"fs-18-regular white"} sx={{ alignSelf: "center", marginTop: "24px" }}>
                  {t("sto-36_no-games")}
                </Box>
              </Stack>
            </AnimatedComponent>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Libraryshow;
