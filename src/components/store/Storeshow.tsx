import { Grid, Stack, Box } from "@mui/material";

import Games from "../../lib/game/Game";

import solar from "../../assets/chains/solar.svg";
import { useNavigate } from "react-router-dom";

const Storeshow = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        item
        xs={12}
        container
        spacing={"32px"}
        sx={{ width: "100%", marginTop: "32px" }}
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
    </>
  );
};

export default Storeshow;
