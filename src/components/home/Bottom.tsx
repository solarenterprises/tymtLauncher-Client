import { Button, Grid, Box } from "@mui/material";
import property from "../../assets/main/property.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Bottom = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "relative",
        display: " flex",
        justifyContent: "center",
        width: "100%",
        marginTop: "100px",
        marginBottom: "200px",
      }}
    >
      <img
        src={property}
        width={"920px"}
        height={"322px"}
        style={{
          display: "block",
          margin: "auto",
          position: "relative",
          zIndex: 2,
        }}
      />
      <div className={"blue-blur-static"} />
      {/* <img
        src={gradient1}
        style={{
          position: "absolute",
          right: "-5%",
          top: "-150px",
          zIndex: 1,
        }}
      /> */}
      <div className={"red-blur-static"} />
      {/* <img
        src={gradient2}
        style={{
          position: "absolute",
          left: "-10%",
          top: "-100px",
          zIndex: 1,
          opacity: 0.8,
        }}
      /> */}
      <Grid
        container
        justifyContent={"center"}
        flexDirection={"column"}
        width={"353px"}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box className={"fs-38-bold white t-center"}>{t("hom-12_explore-our-store")}</Box>
        <Box className={"fs-18-light white t-center"} width={"353px"}>
          {t("hom-13_browse-by")}
        </Box>
        <Button
          className={"red-button"}
          sx={{
            padding: "10px 18px 10px 18px",
            alignSelf: "center",
            marginTop: "18px",
          }}
          onClick={() => navigate("/store")}
        >
          {t("hom-14_explore")}
        </Button>
      </Grid>
    </div>
  );
};

export default Bottom;
