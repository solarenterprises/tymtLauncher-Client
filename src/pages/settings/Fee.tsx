import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";

import { Box, Button, Divider, Stack, InputAdornment, TextField } from "@mui/material";

import FeeSwitchButton from "../../components/FeeSwitchButton";

import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";

import SettingStyle from "../../styles/SettingStyle";

import backIcon from "../../assets/settings/back-icon.svg";

import { IWalletSetting, propsType } from "../../types/settingTypes";
import { ICurrencyList, ICurrentCurrency } from "../../types/walletTypes";

const Fee = ({ view, setView }: propsType) => {
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

  return (
    <>
      {view === "fee" && (
        <Stack direction={"column"}>
          <Stack flexDirection={"row"} justifyContent={"flex-start"} gap={"10px"} alignItems={"center"} textAlign={"center"} sx={{ padding: "20px" }}>
            <Button className={"setting-back-button"} onClick={() => setView("wallet")}>
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-55_transaction-fee")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={"space-between"}>
            <Stack direction={"column"}>
              <Box className="center-align" padding={"30px 10px 10px 10px"}>
                <FeeSwitchButton />
              </Box>
              <Box className="center-align" padding={"10px"}>
                <TextField
                  id="outlined-adornment-weight"
                  placeholder="0.0"
                  InputProps={{
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
        </Stack>
      )}
    </>
  );
};

export default Fee;
