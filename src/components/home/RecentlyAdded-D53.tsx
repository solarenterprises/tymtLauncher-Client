import { Grid, Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import solar from "../../assets/chains/solar.svg";

import Games from "../../lib/game/Game";

const RecentlyAddedD53 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Grid
      item
      xs={12}
      container
      sx={{ position: "relative", marginTop: "10px" }}
    >
      <Grid
        xs={12}
        container
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
          {t("hom-10_recently-added")}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{ width: "100%", marginTop: "32px" }}
        spacing={"32px"}
      >
        {Object.keys(Games).map((rowKey) => (
          <Grid item>
            <Box
              className="card_freegame_container"
              onClick={() => navigate(`/store/${rowKey}`)}
            >
              <Stack>
                <img
                  src={Games[rowKey].thumbnail}
                  width={"100%"}
                  height={"180px"}
                  style={{ borderRadius: "16px" }}
                />
              </Stack>
              <Box padding={"16px 14px 14px"}>
                <Box className={"fs-20-regular white"}>
                  {Games[rowKey].name}
                </Box>
                <Grid item xs={12} container mt={"8px"} spacing={"8px"}>
                  {Games[rowKey].tabs.map((tab) => (
                    <Grid item>
                      <Box className="fs-14-regular white card_genre_label">
                        {tab}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  spacing={1}
                  mt={"16px"}
                >
                  <Box
                    component={"img"}
                    width={"20px"}
                    height={"20px"}
                    src={solar}
                  />
                  <Box className={"fs-16-regular white"}>0.0</Box>
                </Stack>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default RecentlyAddedD53;
