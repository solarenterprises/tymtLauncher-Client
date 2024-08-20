import { Grid, Box, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Multichainbtn from "../../components/store/Multichainbtn";
import Releasebtn from "../../components/store/Releasebtn";
import Platformbtn from "../../components/store/Platformbtn";
import Genrebtn from "../../components/store/Genre";
import Rankingbtn from "../../components/store/Ranking";
import Storeshow from "../../components/store/Storeshow";
import StoreGameItems from "../../components/store/StoreGameItems";

const Store = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={12}>
        <Box className={"fs-60-bold white"}>{t("hom-2_store")}</Box>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: "32px",
            paddingTop: "16px",
            paddingBottom: "24px",
          }}
        >
          <Releasebtn />
          <Multichainbtn />
          <Genrebtn />
          <Platformbtn />
          <Rankingbtn />
        </Grid>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{
          display: "flex",
          marginTop: "32px",
        }}
      >
        <Storeshow />
        <StoreGameItems />
      </Grid>
    </>
  );
};

export default Store;
