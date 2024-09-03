import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";

import Navbar from "../../components/home/Navbar";

const Layoutchat = () => {
  return (
    <Grid
      xs={12}
      container
      sx={{
        background: "var(--bg-stroke-side-panel-bg, #071516)",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Grid
        xs={12}
        container
        item
        sx={{
          position: "relative",
          justifyContent: "center",
          height: "fixed",
          display: "flex",
        }}
      >
        <Navbar />
        <Grid
          item
          container
          sx={{
            borderTop: "1px solid var(--bg-stroke-white-20-modal-stroke, rgba(255, 255, 255, 0.20))",
            marginTop: "60px",
            width: "100%",
            zIndex: 3,
          }}
        >
          <Outlet />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layoutchat;
