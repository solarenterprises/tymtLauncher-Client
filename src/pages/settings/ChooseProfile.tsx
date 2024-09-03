import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Stack, Divider, IconButton } from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import RedStrokeButton from "../../components/account/RedStrokeButton";
import ProfileCard from "../../components/account/ProfileCard";

import { getAccountList } from "../../features/account/AccountListSlice";

import SettingStyle from "../../styles/SettingStyle";

import { IAccountList } from "../../types/accountTypes";

export interface IPropsChooseProfile {
  view: string;
  setView: (_: string) => void;
}

const ChooseProfile = ({ view, setView }: IPropsChooseProfile) => {
  const classname = SettingStyle();
  const navigate = useNavigate();

  const accountListStore: IAccountList = useSelector(getAccountList);

  const handleAddNewProfileButtonClick = () => {
    navigate("/non-custodial/login/2");
  };

  return (
    view === "chooseProfile" && (
      <>
        <Box className={classname.setting_pan}>
          <Stack direction={"row"} alignItems={"center"} spacing={"16px"} padding={"18px 16px"}>
            <IconButton
              className="icon-button"
              sx={{
                width: "24px",
                height: "24px",
                padding: "4px",
              }}
              onClick={() => setView("main")}
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
            <RedStrokeButton text="Add new profile" onClick={handleAddNewProfileButtonClick} />
          </Stack>
        </Box>
      </>
    )
  );
};

export default ChooseProfile;
