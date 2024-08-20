import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Box } from "@mui/material";

import LibrarymodeBtn from "../../components/library/Librarymode";
import Multichainbtn from "../../components/store/Multichainbtn";
import Libraryshow from "../../components/library/Libraryshow";
import StoreGameItems from "../../components/store/StoreGameItems";

import { setLibraryMode } from "../../features/library/Librarymode";
import { getLibrarymode } from "../../features/library/Librarymode";

import { librarymodeType } from "../../types/homeTypes";

const Library = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const mode: librarymodeType = useSelector(getLibrarymode);
  const [status, setStatus] = useState<number>(mode.mode);

  useEffect(() => {
    let updateData = { ...mode, mode: status };
    dispatch(setLibraryMode(updateData));
  }, [status]);

  return (
    <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
      <Box className={"fs-60-bold white"}>{t("hom-3_library")}</Box>
      <Grid item xs={12} container display={"flex"} marginTop={"48px"} justifyContent={"space-between"}>
        <LibrarymodeBtn status={status} setStatus={setStatus} />
        <Multichainbtn />
      </Grid>
      <Grid item xs={12} marginTop={"32px"}>
        <Libraryshow />
        {status === 3 && <StoreGameItems />}
      </Grid>
    </Grid>
  );
};

export default Library;
