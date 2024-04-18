import { Button, Box, Grid, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import storeStyles from "../../styles/StoreStyles";
import x from "../../assets/chat/x.svg";

const FilterOptions = () => {
  const { t } = useTranslation();
  const classes = storeStyles();
  return (
    <>
      <Grid
        item
        xs={12}
        container
        sx={{
          display: "flex",
          marginTop: "24px",
          gap: 2,
          flexDirection: "row",
        }}
      >
        <Button className={classes.filter_btn}>
          <Box className={"fs-16 white"}>{t("sto-1_release-date")}</Box>
          <img src={x} style={{ marginLeft: "8px" }} />
        </Button>
        <Button className={classes.filter_btn}>
          <Box className={"fs-16 white"}>{t("sto-2_chains")}</Box>
          <img src={x} style={{ marginLeft: "8px" }} />
        </Button>
        <Button className={classes.filter_btn}>
          <Box className={"fs-16 white"}>{t("sto-3_genre")}</Box>
          <img src={x} style={{ marginLeft: "8px" }} />
        </Button>
        <Button className={classes.filter_btn}>
          <Box className={"fs-16 white"}>{t("sto-4_platform")}</Box>
          <img src={x} style={{ marginLeft: "8px" }} />
        </Button>
        <Button className={classes.filter_btn}>
          <Box className={"fs-16 white"}>{t("sto-5_ranking")}</Box>
          <img src={x} style={{ marginLeft: "8px" }} />
        </Button>
        <Button className={classes.filter_btn_clear}>
          <Box className={"fs-16 white"}>{t("sto-34_clear-all-filters")}</Box>
        </Button>
      </Grid>
      <Divider
        sx={{
          backgroundColor: "#FFFFFF1A",
          marginTop: "24px",
        }}
      />
    </>
  );
};

export default FilterOptions;
