import { useState } from "react";
import { useTranslation } from "react-i18next";
import storeStyles from "../../styles/StoreStyles";
import { Stack, Box, Button } from "@mui/material";
import { propsmodeType } from "../../types/homeTypes";

const LibrarymodeBtn = ({ status, setStatus }: propsmodeType) => {
  const [mode, setMode] = useState(status);
  const { t } = useTranslation();
  const classes = storeStyles();
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"2px"} className={classes.library_switch_container}>
      <Button
        className={classes.library_switch_button}
        onClick={() => {
          setStatus(0);
          setMode(0);
        }}
        sx={{
          backgroundColor: mode === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: mode === 0 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classes.switch_btn} sx={{ color: mode === 0 ? "#52E1F2" : "white" }}>
          {t("lib-1_your-games")}
        </Box>
      </Button>
      <Button
        className={classes.library_switch_button}
        onClick={() => {
          setStatus(2);
          setMode(2);
        }}
        sx={{
          backgroundColor: mode === 2 ? "rgba(82, 225, 242, 0.10)" : undefined,
          "&:hover": {
            backgroundColor: mode === 2 ? "rgba(82, 225, 242, 0.10)" : undefined,
          },
        }}
      >
        <Box className={classes.switch_btn} sx={{ color: mode === 2 ? "#52E1F2" : "white" }}>
          {t("lib-3_download")}
        </Box>
      </Button>
    </Stack>
  );
};

export default LibrarymodeBtn;
