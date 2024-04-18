import { Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import foxhead from "../../assets/main/foxhead-comingsoon.png";

import ellipse from "../../assets/main/ellipse.svg";

const ComingSoonD53 = () => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12} container sx={{ marginTop: "80px" }}>
      <Box className="card_coming_container">
        <img
          src={ellipse}
          style={{
            width: "100%",
            position: "absolute",
            left: "0",
            bottom: "0px",
            zIndex: -1,
          }}
        />
        <Grid
          xs={12}
          container
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-11_coming-soon")}
          </Box>
        </Grid>

        <Box
          sx={{ justifyContent: "center", display: "flex", marginTop: "32px" }}
        >
          <img src={foxhead} width={"220px"} />
        </Box>
        <Box
          className={"fs-24-regular white"}
          textAlign={"center"}
          marginBottom={"30px"}
        >
          {t("hom-19_more-games")}
        </Box>
      </Box>
    </Grid>
  );
};

export default ComingSoonD53;
