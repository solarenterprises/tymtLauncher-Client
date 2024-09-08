import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";

import { SwipeableDrawer, Box, Stack, IconButton, Divider, TextField, InputAdornment } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import FeeSwitchButton from "../FeeSwitchButton";

import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

import SettingStyle from "../../styles/SettingStyle";

import closeImg from "../../assets/settings/collaps-close-btn.svg";

import { IWalletSetting } from "../../types/settingTypes";
import { ICurrencyList, ICurrentCurrency } from "../../types/walletTypes";

type Anchor = "right";

interface props {
  view: boolean;
  setView: (param: boolean) => void;
}

const TransactionFeeDrawer = ({ view, setView }: props) => {
  const classname = SettingStyle();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event && event.type === "keydown" && ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <SwipeableDrawer
      key={`transaction-fee-drawer`}
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
          <Box className="fs-24-bold white">{t("set-55_transaction-fee")}</Box>
        </Stack>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
            marginBottom: "24px",
          }}
        />
        <Stack direction={"column"} justifyContent={"space-between"}>
          <Stack direction={"column"}>
            <Box className="center-align" padding={"30px 10px 10px 10px"}>
              <FeeSwitchButton />
            </Box>
            <Box className="center-align" padding={"10px"}>
              <TextField
                type="text"
                id="outlined-adornment-weight"
                placeholder="0.0"
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment position="end" classes={{ root: classname.adornment }}>
                      {symbol}
                    </InputAdornment>
                  ),
                  classes: {
                    input: classname.input,
                  },
                }}
                value={numeral(Number(walletSettingStore?.fee) * Number(reserve)).format("0,0.0000")}
                onChange={(e) => {
                  dispatch(
                    setWalletSetting({
                      ...walletSettingStore,
                      status: "input",
                      fee: Number(e.target.value) / Number(reserve),
                    })
                  );
                }}
                className={classname.input}
              />
            </Box>
            <Box
              className="fs-14-light white p-10"
              sx={{
                whiteSpace: "normal",
              }}
            >
              {t("set-56_transaction-detail")}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </SwipeableDrawer>
  );
};

export default TransactionFeeDrawer;
