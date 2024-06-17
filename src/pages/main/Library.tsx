import { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import LibrarymodeBtn from "../../components/library/Librarymode";
import Multichainbtn from "../../components/store/Multichainbtn";
import { getLibrarymode } from "../../features/library/Librarymode";
import Libraryshow from "../../components/library/Libraryshow";
import { librarymodeType } from "../../types/homeTypes";
import { setLibraryMode } from "../../features/library/Librarymode";
import AnimatedComponent from "../../components/AnimatedComponent";

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
    <AnimatedComponent>
      <Grid item xs={12} sx={{ display: "flex", flexDirection: "column" }}>
        <Box className={"fs-60-bold white"}>{t("hom-3_library")}</Box>
        <Grid item xs={12} container display={"flex"} marginTop={"48px"} justifyContent={"space-between"}>
          <LibrarymodeBtn status={status} setStatus={setStatus} />
          <Multichainbtn />
        </Grid>
        <Grid item xs={12} marginTop={"32px"}>
          <Libraryshow />
        </Grid>
      </Grid>
    </AnimatedComponent>
  );
};

export default Library;
