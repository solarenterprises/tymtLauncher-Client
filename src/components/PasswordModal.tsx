import { useState } from "react";
import { Box, Stack, Modal, Button, TextField, InputAdornment, CircularProgress } from "@mui/material";
import createKeccakHash from "keccak";
import closeIcon from "../assets/settings/x-icon.svg";
import logo from "../assets/main/foxhead-comingsoon.png";
import solarBlockchainIcon from "../assets/main/solarblockchain.png";
import InputText from "./account/InputText";
import { nonCustodialType } from "../types/accountTypes";
import { useDispatch, useSelector } from "react-redux";
import { getNonCustodial } from "../features/account/NonCustodialSlice";
import { useTranslation } from "react-i18next";
import { decrypt } from "../lib/api/Encrypt";
import tymtCore from "../lib/core/tymtCore";
import { ICurrency, IVotingData, multiWalletType } from "../types/walletTypes";
import { getMultiWallet } from "../features/wallet/MultiWalletSlice";
import FeeSwitchButton from "./FeeSwitchButton";
import SettingStyle from "../styles/SettingStyle";
import { selectWallet, setWallet } from "../features/settings/WalletSlice";
import { walletType } from "../types/settingTypes";
import { getCurrency } from "../features/wallet/CurrencySlice";
import numeral from "numeral";
import { currencySymbols } from "../consts/currency";
import { useNotification } from "../providers/NotificationProvider";
import { translateString } from "../lib/api/Translate";

interface props {
  open: boolean;
  setOpen: (status: boolean) => void;
  voteAsset: IVotingData;
}

const PasswordModal = ({ open, setOpen, voteAsset }: props) => {
  const { t } = useTranslation();
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const walletStore: walletType = useSelector(selectWallet);
  const currencyStore: ICurrency = useSelector(getCurrency);
  const reserve = currencyStore.data[currencyStore.current];
  const symbol: string = currencySymbols[currencyStore.current];

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const classname = SettingStyle();
  const dispatch = useDispatch();

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const validatePassword = () => {
    return createKeccakHash("keccak256").update(password).digest("hex") === nonCustodialStore.password;
  };

  const handleVoteClick = async () => {
    try {
      setLoading(true);
      const passphrase: string = await decrypt(nonCustodialStore.mnemonic, password);
      const res = await tymtCore.Blockchains.solar.wallet.vote(passphrase.normalize("NFD"), multiWalletStore.Solar.chain.wallet, voteAsset, walletStore.fee);
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
  };

  return (
    <Modal
      open={open}
      style={modalStyle}
      onClose={() => setOpen(false)}
      sx={{
        backdropFilter: "blur(4px)",
      }}
    >
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
                value={numeral(Number(walletStore.fee) * Number(reserve)).format("0,0.0000")}
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
                    setWallet({
                      ...walletStore,
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
    </Modal>
  );
};

export default PasswordModal;
