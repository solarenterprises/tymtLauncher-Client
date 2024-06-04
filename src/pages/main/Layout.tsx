import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Grid } from "@mui/material";

import Navbar from "../../components/home/Navbar";
import Menu from "../../components/home/Menu";
import bgblur from "../../assets/main/BGblur.svg";

const Layout = () => {
  const location = useLocation();
  const [background, setBackground] = useState(location.pathname);
  const [display, setDisplay] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname.indexOf("wallet") !== -1) {
      setBackground("var(--BG, linear-gradient(180deg, #342223 0%, #0B0B0B 100%))");
      setDisplay("none");
    } else {
      setBackground("var(--BG, linear-gradient(180deg, #0E1E20 0%, #0B0B0B 100%))");
      setDisplay("block");
    }
  }, [location]);

  return (
    <Grid
      container
      sx={{
        background: background,
        height: "100vh",
        overflowY: "auto",
        position: "relative",
        zIndex: 1,
        "&::-webkit-scrollbar": {
          borderRadius: "100px",
          width: "5px",
          backgroundColor: "none",
        },
      }}
    >
      <img
        src={bgblur}
        style={{
          position: "fixed",
          width: "100%",
          zIndex: -1,
          left: "0",
          display: display,
        }}
      />

      <Grid
        item
        xs={12}
        container
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
            marginTop: "120px",
            width: "95.5%",
            zIndex: 3,
          }}
        >
          <Grid
            xs={12}
            item
            sx={{
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Menu />
            <Grid
              sx={{
                paddingLeft: "2%",
                left: "18%",
                width: "82%",
                position: "sticky",
                top: "0",
                zIndex: 0,
              }}
            >
              <Outlet />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Layout;
