import { Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BasicGameList } from "../../lib/game/BasicGameList";
import StoreGameCard from "../store/StoreGameCard";

const RecentlyAddedD53 = () => {
  const { t } = useTranslation();

  return (
    <>
      <Grid item xs={12} container sx={{ position: "relative" }}>
        <Grid container sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Box className={"fs-38-bold"} color={"white"} textTransform={"none"}>
            {t("hom-10_recently-added")}
          </Box>
        </Grid>
        <Grid container sx={{ width: "100%", marginTop: "0px" }} spacing={"32px"}>
          {BasicGameList?.map((game, index) => (
            <Grid item key={index}>
              <StoreGameCard game={game} isComing={false} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default RecentlyAddedD53;
