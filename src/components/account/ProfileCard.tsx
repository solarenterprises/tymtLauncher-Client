import { useDispatch } from "react-redux";

import { Button, Stack, Box } from "@mui/material";

import Avatar from "../home/Avatar";

import { IAccount } from "../../types/accountTypes";
import { setAccount } from "../../features/account/AccountSlice";

export interface IPropsProfileCard {
  account: IAccount;
}

const ProfileCard = ({ account }: IPropsProfileCard) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setAccount(account));
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          textTransform: "none",
          width: "100%",
          border: "1px solid #FFFFFF1A",
          padding: "12px 8px 6px",
          borderRadius: "16px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          background: "#8080801A",
          textAlign: "left",
          "&:hover": {
            background: "#8080804D",
            border: "1px solid #7C7C7C",
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap="12px" width={"100%"}>
          <Avatar url={account?.avatar} size={64} />
          <Stack>
            <Box className={"fs-16-regular white"}>{account?.nickName}</Box>
            <Box className={"fs-14-regular light"}>{`non custodial wallet account`}</Box>
            <Box className={"fs-12-regular blue"}>{account?.sxpAddress}</Box>
          </Stack>
        </Stack>
      </Button>
    </>
  );
};

export default ProfileCard;
