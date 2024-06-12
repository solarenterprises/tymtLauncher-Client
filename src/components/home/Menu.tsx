import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Grid, List, ListItem, ListItemButton, ListItemIcon, Box, Tooltip, Stack } from "@mui/material";
import home from "../../assets/main/home.svg";
import library from "../../assets/main/library.svg";
import store from "../../assets/main/store.svg";
import chevronleftdouble from "../../assets/main/chevronleftdouble.svg";
import chevronrightdouble from "../../assets/main/chevronrightdouble.svg";
import homeStyles from "../../styles/homeStyles";
import { getCurrentPage, setCurrentPage } from "../../features/home/Navigation";
import { PaginationType } from "../../types/homeTypes";
import { TymtlogoType } from "../../types/homeTypes";
import { getCurrentLogo, setCurrentLogo } from "../../features/home/Tymtlogo";
import InstallingProcess from "./InstallingProcess";

const Menu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const homeclasses = homeStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentpage: PaginationType = useSelector(getCurrentPage);
  const tymtlogo: TymtlogoType = useSelector(getCurrentLogo);
  const [selectedItem, setSelectedItem] = useState<number>(currentpage.index);
  const [isDrawerExpanded, setDrawerExpanded] = useState<boolean>(tymtlogo.isDrawerExpanded);

  const handleChevronClick = () => {
    setDrawerExpanded((prevExpanded) => !prevExpanded);
    dispatch(
      setCurrentLogo({
        ...tymtlogo,
        isDrawerExpanded: !tymtlogo.isDrawerExpanded,
      })
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1400) {
        setDrawerExpanded(false);
        dispatch(setCurrentLogo({ ...tymtlogo, isDrawerExpanded: false }));
      } else {
        setDrawerExpanded(true);
        dispatch(setCurrentLogo({ ...tymtlogo, isDrawerExpanded: true }));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setSelectedItem(currentpage.index);
  });
  useEffect(() => {
    {
      location.pathname === "/home" &&
        dispatch(
          setCurrentPage({
            ...currentpage,
            index: 0,
            page: "home",
          })
        );
    }
    {
      location.pathname.startsWith("/store") &&
        dispatch(
          setCurrentPage({
            ...currentpage,
            index: 1,
            page: "store",
          })
        );
    }
    {
      location.pathname === "/library" &&
        dispatch(
          setCurrentPage({
            ...currentpage,
            index: 2,
            page: "library",
          })
        );
    }
  }, [location]);

  return (
    <Grid
      className={homeclasses.menu_bar}
      container
      sx={{
        width: isDrawerExpanded ? `203px` : "95px",
      }}
    >
      <Grid item xs={12}>
        <Grid
          container
          sx={{
            width: "85%",
            height: "540px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <List sx={{ bgcolor: "none", marginTop: "20px" }}>
            {[`${t("hom-1_home")}`, `${t("hom-2_store")}`, `${t("hom-3_library")}`].map((text, index) => (
              <Tooltip
                key={index}
                title={
                  <Stack
                    spacing={"10px"}
                    sx={{
                      padding: "6px 8px 6px 8px",
                      borderRadius: "30px",
                      border: "1px",
                      borderColor: "#FFFFFF1A",
                      backgroundColor: "#8080804D",
                    }}
                  >
                    <Box className="fs-14-regular white">{text}</Box>
                  </Stack>
                }
                PopperProps={{
                  placement: "right",
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 5],
                      },
                    },
                  ],
                  sx: {
                    display: isDrawerExpanded ? "none" : "block",
                    [`& .MuiTooltip-tooltip`]: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  },
                }}
              >
                <ListItem
                  className={homeclasses.menu_listitem}
                  key={text}
                  disablePadding
                  sx={{
                    background: selectedItem === index ? "linear-gradient(112deg, rgba(255, 255, 255, 0.24) 0%,rgba(255, 255, 255, 0.00) 100%)" : "transparent",
                    borderLeft: selectedItem === index ? "solid white 3px" : "transparent",
                  }}
                >
                  <ListItemButton
                    className={homeclasses.menu_listbutton}
                    sx={{
                      "&:hover": {
                        background:
                          selectedItem === index
                            ? "transparent"
                            : "linear-gradient(112deg, rgba(239, 68, 68, 0.00) 0%, rgba(239, 68, 68, 0.24) 51.82%, rgba(239, 68, 68, 0.00) 98.49%)",
                      },
                    }}
                    onClick={() => {
                      dispatch(
                        setCurrentPage({
                          ...currentpage,
                          index: index,
                          page: text?.toLowerCase(),
                        })
                      );
                      setSelectedItem(index);
                      const path = index % 3 === 0 ? "/home" : index % 3 === 1 ? "/store" : "/library";

                      navigate(path);
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                      }}
                    >
                      <>
                        {index % 3 === 0 && <img src={home} />}
                        {index % 3 === 1 && <img src={store} />}
                        {index % 3 === 2 && <img src={library} />}
                      </>
                    </ListItemIcon>
                    {isDrawerExpanded && (
                      <Box sx={{ opacity: 1, color: "white" }} className={"fs-16-regular"} textTransform={"none"}>
                        {text}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          <InstallingProcess />
        </Grid>
        <Button className="menu_chevron_button" onClick={handleChevronClick}>
          {!isDrawerExpanded && <img src={chevronrightdouble}></img>}
          {isDrawerExpanded && <img src={chevronleftdouble}></img>}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Menu;
