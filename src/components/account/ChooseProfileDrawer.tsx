import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { SwipeableDrawer, Box, Stack, IconButton, Divider } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import RedStrokeButton from "./RedStrokeButton";

import { getAccountList } from "../../features/account/AccountListSlice";

import { IAccountList } from "../../types/accountTypes";

import closeImg from "../../assets/settings/collaps-close-btn.svg";

import SettingStyle from "../../styles/SettingStyle";
import ProfileCard from "./ProfileCard";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
}

const ChooseProfileDrawer = ({ view, setView }: props) => {
  const classname = SettingStyle();
  const navigate = useNavigate();

  const accountListStore: IAccountList = useSelector(getAccountList);

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleAddNewProfileButtonClick = () => {
    navigate("/non-custodial/login/2");
  };

  return (
    <SwipeableDrawer
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
          <Box className="fs-24-regular white">{`Which one do you want to use?`}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
            marginBottom: "24px",
          }}
        />
        <Stack direction={"column"} justifyContent={"space-between"} padding={"0px 16px"} minHeight={"calc(100% - 110px)"}>
          <Stack direction={"column"} gap={"16px"}>
            {accountListStore?.list?.map((one, index) => (
              <ProfileCard account={one} key={index} />
            ))}
          </Stack>
          <Stack mt={"16px"} mb={"16px"}>
            <RedStrokeButton text="Add new profile" onClick={handleAddNewProfileButtonClick} />
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
};

export default ChooseProfileDrawer;
