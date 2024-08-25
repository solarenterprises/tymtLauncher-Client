import { Stack } from "@mui/material";

import mailIcon from "../../assets/account/mail.png";
import facebookIcon from "../../assets/account/facebook-icon.svg";
import googleIcon from "../../assets/account/google-icon.svg";
import discordIcon from "../../assets/account/discord-icon.svg";
import binanceIcon from "../../assets/account/binance-icon.svg";
import AuthIconButton from "./AuthIconButton";

const list = [
  {
    icon: mailIcon,
  },
  {
    icon: googleIcon,
  },
  {
    icon: facebookIcon,
  },
  {
    icon: discordIcon,
  },
  {
    icon: binanceIcon,
  },
];

const AuthIconButtons = () => {
  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {list.map((one) => (
          <AuthIconButton icon={one.icon} />
        ))}
      </Stack>
    </>
  );
};

export default AuthIconButtons;
