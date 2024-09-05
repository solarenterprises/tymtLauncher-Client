import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid, Box } from "@mui/material";

import LibrarymodeBtn from "../../components/library/Librarymode";
import Multichainbtn from "../../components/store/Multichainbtn";
import Libraryshow from "../../components/library/Libraryshow";
import StoreComingGameItems from "../../components/store/StoreComingGameItems";

const Library = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<number>(0);

  return (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Box className={"fs-60-bold white"}>{t("hom-3_library")}</Box>
      <Grid item xs={12} container display={"flex"} marginTop={"48px"} justifyContent={"space-between"}>
        <LibrarymodeBtn status={status} setStatus={setStatus} />
        {false && <Multichainbtn />}
      </Grid>
      <Grid item xs={12} marginTop={"32px"}>
        <Libraryshow status={status} />
        {status === 3 && <StoreComingGameItems />}
      </Grid>
    </Grid>
  );
};

export default Library;
