import { Box, Button, Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import backIcon from "../../assets/settings/back-icon.svg";
import checkImg from "../../assets/settings/check-icon.svg";

import { propsType } from "../../types/settingTypes";
import { ICurrency } from "../../types/walletTypes";
import {
  getCurrency,
  refreshCurrencyAsync,
  setCurrency,
} from "../../features/wallet/CurrencySlice";
import { AppDispatch } from "../../store";
import { currencyFlags } from "../../consts/currency";

const Currency = ({ view, setView }: propsType) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currencyStore: ICurrency = useSelector(getCurrency);

  const handleCurrencyClick = (_currency: string) => {
    dispatch(refreshCurrencyAsync()).then(() => {
      dispatch(
        setCurrency({
          ...currencyStore,
          current: _currency,
        })
      );
    });
  };

  return (
    <>
      {view === "currency" && (
        <Stack direction={"column"}>
          <Stack
            flexDirection={"row"}
            justifyContent={"flex-start"}
            gap={"10px"}
            alignItems={"center"}
            textAlign={"center"}
            padding={"20px"}
          >
            <Button
              className={"setting-back-button"}
              onClick={() => setView("wallet")}
            >
              <Box component={"img"} src={backIcon}></Box>
            </Button>
            <Box className="fs-h3 white">{t("set-34_currency")}</Box>
          </Stack>
          <Divider variant="middle" sx={{ backgroundColor: "#FFFFFF1A" }} />
          <Stack direction={"column"} justifyContent={""}>
            {Object.keys(currencyStore.data).map((currency) => (
              <>
                <Button
                  className="common-btn"
                  sx={{ padding: "20px" }}
                  onClick={() => {
                    handleCurrencyClick(currency);
                  }}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    textAlign={"center"}
                  >
                    <Stack
                      direction={"row"}
                      justifyContent={"center"}
                      textAlign={"right"}
                      alignItems={"center"}
                      gap={"5px"}
                    >
                      <Box
                        className="center-align"
                        component={"img"}
                        src={currencyFlags[currency]}
                        width={"24px"}
                        height={"24px"}
                        sx={{
                          borderRadius: "12px",
                        }}
                      />
                      <Box className="fs-h5 white">{currency}</Box>
                    </Stack>
                    <Box className="center-align">
                      {currencyStore.current == currency && (
                        <img src={checkImg} />
                      )}
                    </Box>
                  </Stack>
                </Button>
                <Divider
                  variant="fullWidth"
                  sx={{ backgroundColor: "#FFFFFF1A" }}
                />
              </>
            ))}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default Currency;
