import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { SwipeableDrawer, Box, Stack, Button, Divider, IconButton } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import closeImg from "../../assets/settings/collaps-close-btn.svg";

import SettingStyle from "../../styles/SettingStyle";

import { selectAddress } from "../../features/settings/AddressSlice";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
  setAddress: (address: string) => void;
}

const AddressBookDrawer = ({ view, setView, setAddress }: props) => {
  const classname = SettingStyle();
  const { t } = useTranslation();
  const addressData = useSelector(selectAddress);
  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      key={`address-book-drawer`}
      anchor="right"
      open={view}
      onClose={() => setView(false)}
      onOpen={toggleDrawer("right", true)}
      classes={{ paper: classname.setting_container }}
      slotProps={{
        backdrop: {
          onClick: toggleDrawer("right", false),
        },
      }}
    >
      <Box className={classname.collaps_pan}>
        <img src={closeImg} className={classname.close_icon} onClick={() => setView(false)} />
      </Box>
      <Box className={classname.setting_pan}>
        <Stack direction={"row"} alignItems={"center"} spacing={"16px"} padding={"18px 16px"}>
          <IconButton
            className="icon-button"
            sx={{
              width: "24px",
              height: "24px",
              padding: "4px",
            }}
            onClick={() => setView(false)}
          >
            <ArrowBackOutlinedIcon className="icon-button" />
          </IconButton>
          <Box className="fs-24-bold white">{t("set-32_address-book")}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />
        {addressData.map((data, index) => (
          <>
            <Button
              fullWidth
              sx={{
                textTransform: "none",
              }}
              onClick={() => {
                setAddress(data.address);
                setView(false);
              }}
              key={`${index}-${index}`}
            >
              <Stack padding={"16px"} width={"100%"}>
                <Box className="fs-18-regular white t-left">{data.name}</Box>
                <Box className="fs-14-regular light t-left">{data.address}</Box>
              </Stack>
            </Button>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
              }}
            />
          </>
        ))}
      </Box>
    </SwipeableDrawer>
  );
};

export default AddressBookDrawer;
