import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import numeral from "numeral";

import tymtCore from "../lib/core/tymtCore";

import { currencySymbols } from "../consts/SupportCurrency";

import { Box, Stack, Modal, Button, TextField, InputAdornment, CircularProgress, Fade } from "@mui/material";

import { useNotification } from "../providers/NotificationProvider";

import InputText from "./account/InputText";
import FeeSwitchButton from "./FeeSwitchButton";

import { getCurrentCurrency } from "../features/wallet/CurrentCurrencySlice";
import { getCurrencyList } from "../features/wallet/CurrencyListSlice";
import { getWalletSetting, setWalletSetting } from "../features/settings/WalletSettingSlice";
import { getWallet } from "../features/wallet/WalletSlice";
import { getAccount } from "../features/account/AccountSlice";

import { translateString } from "../lib/api/Translate";
import { decrypt, getKeccak256Hash } from "../lib/api/Encrypt";

import { ICurrencyList, ICurrentCurrency, IVotingData, IWallet } from "../types/walletTypes";
import { IAccount } from "../types/accountTypes";
import { IWalletSetting } from "../types/settingTypes";

import SettingStyle from "../styles/SettingStyle";

import closeIcon from "../assets/settings/x-icon.svg";
import logo from "../assets/main/foxhead-comingsoon.png";
import solarBlockchainIcon from "../assets/main/solarblockchain.png";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
  voteAsset: IVotingData;
}

const PasswordModal = ({ open, setOpen, voteAsset }: props) => {
  const classname = SettingStyle();

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const walletStore: IWallet = useSelector(getWallet);
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const accountStore: IAccount = useSelector(getAccount);

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const validatePassword = useCallback(() => {
    return getKeccak256Hash(password) === accountStore?.password;
  }, [password, accountStore]);

  const handleVoteClick = useCallback(async () => {
    try {
      setLoading(true);
      const passphrase: string = await decrypt(accountStore?.mnemonic, password);
      const res = await tymtCore.Blockchains.solar.wallet.vote(passphrase.normalize("NFD"), walletStore?.solar, voteAsset, walletSettingStore?.fee);
      if (res.data.data.invalid[0]) {
        const temp = res.data.data.invalid[0];
        const err = res.data.errors[temp].message;
        const translated = await translateString(err);
        setNotificationStatus("failed");
        setNotificationTitle(t("wal-49_vote-failed"));
        setNotificationDetail(translated);
        setNotificationOpen(true);
        setNotificationLink(null);
      } else {
        setNotificationStatus("success");
        setNotificationTitle(t("wal-50_congratulations"));
        setNotificationDetail(t("wal-48_successfully-voted"));
        setNotificationOpen(true);
        setNotificationLink(null);
      }
      setOpen(false);
      setPassword("");
      setLoading(false);
    } catch (err) {
      console.error("Failed to Vote: ", err);
      setOpen(false);
      setPassword("");
      setLoading(false);
      const translated = await translateString(err.toString());
      setNotificationStatus("failed");
      setNotificationTitle(t("wal-49_vote-failed"));
      setNotificationDetail(translated);
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  }, [walletStore, accountStore, walletSettingStore, password]);

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
      <Fade in={open}>
        <Box className="modal-content oauth-modal">
          <img src={closeIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
          <img
            src={logo}
            alt="tymt icon"
            className="tymt-top-left-icon"
            style={{
              width: "30px",
              height: "30px",
            }}
          />
          <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
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
                  // onBlur={(e) => {
                  //   dispatch(
                  //     setWallet({
                  //       ...walletStore,
                  //       status: "input",
                  //       fee: Number(e.target.value) / Number(reserve),
                  //     })
                  //   );
                  // }}
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
            <Box className="center-align">
              <img width={200} src={solarBlockchainIcon} />
            </Box>
            <Stack direction={"column"} justifyContent={"center"} alignItems={"center"} textAlign={"center"} gap={"10px"}>
              <InputText
                id="password"
                label={t("cca-3_password")}
                type="password"
                name="password"
                value={password}
                setValue={setPassword}
                error={validatePassword()}
              />
              <Button fullWidth className="red-button" onClick={handleVoteClick} disabled={!validatePassword() || loading}>
                <Box className="fs-18-bold white" padding={"10px 18px"}>
                  {loading && (
                    <CircularProgress
                      sx={{
                        color: "#F5EBFF",
                      }}
                    />
                  )}
                  {!loading && t("ncca-51_confirm")}
                </Box>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

export default PasswordModal;
