import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";
import { useFormik } from "formik";
import * as Yup from "yup";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";

import { Box, Button, CircularProgress, InputAdornment, Stack, TextField, Tooltip } from "@mui/material";

import InputPasswordNoTooltip from "../../components/account/InputPasswordNoTooltip";
import SwitchChainModal from "../../components/wallet/SwitchChainModal";
import Loading from "../../components/Loading";

import { AppDispatch } from "../../store";
import { setMountedFalse, setMountedTrue } from "../../features/chat/IntercomSupportSlice";
import { selectLanguage } from "../../features/settings/LanguageSlice";
import { INotification, sendCoinAPIAsync } from "../../features/wallet/CryptoSlice";
import { fetchCurrencyListAsync, getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getAccount } from "../../features/account/AccountSlice";
import { getWalletSetting, setWalletSetting } from "../../features/settings/WalletSettingSlice";
import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";
import { getWallet } from "../../features/wallet/WalletSlice";
import { fetchBalanceListAsync, getBalanceList } from "../../features/wallet/BalanceListSlice";
import { fetchPriceListAsync, getPriceList } from "../../features/wallet/PriceListSlice";

import TransactionProviderAPI from "../../lib/api/TransactionProviderAPI";
import { IRecipient, ISendCoin } from "../../features/wallet/CryptoApi";
import { getKeccak256Hash } from "../../lib/api/Encrypt";
import { getCurrentChainWalletAddress, getSupportChainByName, getTokenBalanceBySymbol, getTokenPriceByCmc } from "../../lib/helper/WalletHelper";

import SettingStyle from "../../styles/SettingStyle";

import tymt from "../../assets/main/newlogohead.png";
import close from "../../assets/settings/x-icon.svg";
import d53 from "../../lib/game/district 53/logo.png";

import {
  IBalanceList,
  ICurrencyList,
  ICurrentChain,
  ICurrentCurrency,
  IPriceList,
  ISupportChain,
  ISupportNative,
  ISupportToken,
  IWallet,
} from "../../types/walletTypes";
import { IAccount } from "../../types/accountTypes";
import { IWalletSetting, languageType } from "../../types/settingTypes";
import { ISendTransactionReq } from "../../types/eventParamTypes";
import { ChainNames } from "../../consts/Chains";

const WalletD53Transaction = () => {
  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();
  const classname = SettingStyle();
  const dispatch = useDispatch<AppDispatch>();

  const langStore: languageType = useSelector(selectLanguage);
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const accountStore: IAccount = useSelector(getAccount);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const walletStore: IWallet = useSelector(getWallet);
  const priceListStore: IPriceList = useSelector(getPriceList);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);

  const currentSupportChain: ISupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);
  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);

  const [copied, setCopied] = useState<boolean>(false);
  const [chain, setChain] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [token, setToken] = useState<ISupportNative | ISupportToken>();
  const [loading, setLoading] = useState<boolean>(false);
  const [blur, setBlur] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [jsonData, setJsonData] = useState<ISendTransactionReq>();
  const [switchChainModalOpen, setSwitchChainModalOpen] = useState<boolean>(false);

  const tokenPrice = useMemo(() => getTokenPriceByCmc(priceListStore, token?.cmc), [priceListStore, token]);
  const tokenBalance = useMemo(() => getTokenBalanceBySymbol(balanceListStore, token?.symbol), [balanceListStore, token]);

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (componentRef.current) {
      const height = componentRef.current.offsetHeight;
      appWindow.setSize(new LogicalSize(445, height));
    }
  }, [note, memo, amount, to, chain]);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("cca-63_required"))
        .test("checks", t("cca-65_please-signup-import"), (_value) => accountStore?.password !== "" && accountStore?.mnemonic !== "")
        .test("equals", t("cca-60_wrong-password"), (value) => getKeccak256Hash(value) === accountStore?.password),
    }),
    onSubmit: () => {
      handleApproveClick();
    },
  });

  const handleApproveClick = async () => {
    try {
      setLoading(true);
      let res: INotification;

      if (chain === ChainNames.SOLAR || chain === ChainNames.BITCOIN || chain === ChainNames.SOLANA) {
        res = await TransactionProviderAPI.sendTransaction(jsonData, formik.values.password, walletSettingStore?.fee);
        emit("res-POST-/send-transaction", res);
      } else {
        const recipients: IRecipient[] = [
          {
            address: to,
            amount: amount,
          },
        ];
        const tx = {
          passphrase: formik.values.password,
          recipients: recipients,
          fee: walletSettingStore?.fee,
          vendorField: memo,
        };
        const temp: ISendCoin = {
          currentTokenSymbol: currentChainStore?.chain,
          data: tx,
        };
        dispatch(sendCoinAPIAsync(temp)).then((action) => {
          if (action.type.endsWith("/fulfilled")) {
            res = action.payload as INotification;
            res.title = `Send ${currentChainStore?.chain}`;
            emit("res-POST-/send-transaction", res);
          }
        });
      }

      setTo("");
      setAmount("");
      setChain("");
      setNote("");
      setMemo("");
      setToken(null);
      invoke("hide_transaction_window");
      setLoading(false);
      setExpired(true);
      setTimeLeft(120);
      setSwitchChainModalOpen(false);
    } catch (err) {
      console.log("Failed to TransactionProviderAPI.sendTransaction: ", err);
      const res: INotification = {
        status: "failed",
        title: `Send ${currentSupportChain?.chain?.symbol}`,
        message: err.toString(),
      };
      emit("res-POST-/send-transaction", res);
      setTo("");
      setAmount("");
      setChain("");
      setNote("");
      setMemo("");
      setToken(null);
      invoke("hide_transaction_window");
      setLoading(false);
      setExpired(true);
      setTimeLeft(120);
      setSwitchChainModalOpen(false);
    }
  };

  const handleRejectClick = useCallback(async () => {
    try {
      await TransactionProviderAPI.updateTransactionStatus(jsonData, "rejected");
    } catch (err) {
      console.error("Failed to update tx status as rejected: ", err);
    }
    let res = {
      status: "failed",
      title: `Send ${currentSupportChain?.chain?.symbol}`,
      message: "Request rejected",
    };
    emit("res-POST-/send-transaction", res);
    setTo("");
    setAmount("");
    setChain("");
    setNote("");
    setMemo("");
    setToken(null);
    invoke("hide_transaction_window");
    setExpired(true);
    setTimeLeft(120);
    setSwitchChainModalOpen(false);
  }, [jsonData, currentSupportChain]);

  const getShortAddr: (_: string) => string = (_wallet: string) => {
    return _wallet.substring(0, 10) + "..." + _wallet.substring(_wallet.length - 10);
  };

  useEffect(() => {
    changeLanguage(langStore.language);
  }, [langStore.language]);

  useEffect(() => {
    dispatch(setMountedTrue());

    return () => {
      dispatch(setMountedFalse());
    };
  }, []);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  useEffect(() => {
    const unlisten_send_transaction = listen("POST-/send-transaction", async (event) => {
      setBlur(true);
      const json_data: ISendTransactionReq = JSON.parse(event.payload as string);
      setJsonData(json_data);

      let isValid: boolean = await TransactionProviderAPI.validateTransaction(json_data);
      if (!isValid) {
        invoke("hide_transaction_window");
        try {
          await TransactionProviderAPI.updateTransactionStatus(json_data, "fail");
        } catch (err) {
          console.log("Failed to update transaction status as fail: ", err);
        }
        return;
      }

      if (currentChainStore?.chain !== TransactionProviderAPI.getChainName(json_data.chain)) {
        setSwitchChainModalOpen(true);
      } else {
        await dispatch(fetchBalanceListAsync(walletStore));
        await dispatch(fetchCurrencyListAsync());
        await dispatch(fetchPriceListAsync());
      }

      setChain(TransactionProviderAPI.getChainName(json_data.chain));
      setTo(json_data.transfers[0].to);
      const totalAmount: number = json_data.transfers.reduce((sum, transfer) => {
        return (sum + Number(transfer.amount)) as number;
      }, 0);
      setAmount(numeral(totalAmount).format("0,0.00"));
      setNote(json_data.note);
      setMemo(json_data.memo ?? "");
      setToken(await TransactionProviderAPI.getToken(json_data));
      setExpired(false);
      setTimeLeft(120);
      setBlur(false);
    });

    return () => {
      unlisten_send_transaction.then((unlistenFn) => unlistenFn());
    };
  }, []);

  useEffect(() => {
    if (!expired) {
      let checkActivityIntervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1 * 1e3);

      return () => {
        clearInterval(checkActivityIntervalId);
      };
    }
  }, [expired]);

  useEffect(() => {
    if (timeLeft < 0) {
      handleRejectClick();
    }
  }, [timeLeft]);

  return (
    <Stack
      ref={componentRef}
      width={"440px"}
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.20)",
        background: "#071516",
        boxShadow: "0px 0px 4px 0px rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(10px)",
      }}
    >
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} height={"64px"} padding={"0px 16px"}>
          <Box component={"img"} src={tymt} width={"40px"} height={"38px"} />
          <Tooltip
            placement="bottom"
            title={
              <Stack
                spacing={"10px"}
                sx={{
                  marginBottom: "-20px",
                  backgroundColor: "rgb(49, 53, 53)",
                  padding: "6px 8px",
                  borderRadius: "32px",
                  border: "1px solid rgb(71, 76, 76)",
                }}
              >
                <Box className="fs-12-regular white">{getCurrentChainWalletAddress(walletStore, currentChainStore?.chain)}</Box>
              </Stack>
            }
            PopperProps={{
              sx: {
                [`& .MuiTooltip-tooltip`]: {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
              },
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              padding={"8px"}
              gap={"8px"}
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.10)",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <Box component={"img"} src={getSupportChainByName(currentChainStore?.chain)?.chain?.logo} width={"16px"} height={"16px"} />
              <Box className={"fs-16-regular white"}>{getShortAddr(getCurrentChainWalletAddress(walletStore, currentChainStore?.chain))}</Box>
            </Stack>
          </Tooltip>
          <Box
            component={"img"}
            src={close}
            width={"24px"}
            height={"24px"}
            onClick={handleRejectClick}
            sx={{
              cursor: "pointer",
            }}
          />
        </Stack>
        <Stack
          sx={{
            padding: "24px",
            gap: "24px",
            borderRadius: "16px",
            background: "rgb(16, 30, 30)",
          }}
        >
          <Box className={"fs-24-regular white t-center"}>{t("wal-61_tx-request")}</Box>
          <Stack
            sx={{
              padding: "24px 16px",
              gap: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(50px)",
            }}
          >
            <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
              <Box component={"img"} src={d53} width={"60px"} height={"40px"} />
              <Box className={"fs-20-regular white"}>{`D53 Metaverse`}</Box>
            </Stack>
            <Box className={"fs-16-regular white"}>{note}</Box>
            <Stack
              sx={{
                borderTop: "1px solid rgba(255, 255, 255, 0.10)",
              }}
            />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Box className={"fs-16-regular light"}>{t("wal-69_memo")}</Box>
              <Box className={"fs-16-regular white t-right"} sx={{ textOverflow: "ellipsis", whiteSpace: "normal", wordWrap: "anywhere" }}>
                {memo}
              </Box>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
              <Box className={"fs-16-regular light"}>{t("wal-62_recipient")}</Box>
              <Tooltip
                placement="bottom"
                title={
                  <Stack
                    spacing={"10px"}
                    sx={{
                      marginBottom: "-20px",
                      backgroundColor: "rgb(49, 53, 53)",
                      padding: "6px 8px",
                      borderRadius: "32px",
                      border: "1px solid rgb(71, 76, 76)",
                    }}
                  >
                    <Box className="fs-12-regular white">
                      {!copied && to}
                      {copied && t("wal-66_copied-to-clipboard")}
                    </Box>
                  </Stack>
                }
                PopperProps={{
                  sx: {
                    [`& .MuiTooltip-tooltip`]: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  },
                }}
              >
                <Box
                  className={"fs-16-regular white"}
                  onClick={() => {
                    navigator.clipboard.writeText(getCurrentChainWalletAddress(walletStore, currentChainStore?.chain));
                    setCopied(true);
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {getShortAddr(to)}
                </Box>
              </Tooltip>
            </Stack>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Box className={"fs-16-regular light"}>{t("wal-63_amount")}</Box>
              <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
                <Stack>
                  <Box
                    className={"fs-16-regular white t-right"}
                    onClick={() => {
                      navigator.clipboard.writeText(amount);
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                  >{`${amount} ${token?.symbol ?? ""}`}</Box>
                  <Box className={"fs-14-regular light t-right"}>{`${symbol} ${numeral(Number(amount) * Number(tokenPrice ?? 0) * Number(reserve)).format(
                    "0,0.000"
                  )}`}</Box>
                </Stack>
                <Box component={"img"} src={token?.logo ?? currentSupportChain?.chain?.logo ?? ""} width={"30px"} height={"30px"} />
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            sx={{
              padding: "16px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(50px)",
            }}
          >
            <Box className={"fs-16-regular light"}>{`${t("wal-64_gas-fee")}:`}</Box>
            <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
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
            </Stack>
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box className={"fs-16-regular light"}>{t("wal-67_total-spend")}</Box>
            <Stack>
              <Box className={"fs-16-regular white t-right"}>{`${numeral(
                (Number(amount) as number) + (Number(walletSettingStore?.fee) as number) / (Number(tokenPrice ?? 0) as number)
              ).format("0,0.0000")} ${token?.symbol ?? ""}`}</Box>
            </Stack>
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box className={"fs-16-regular light"}>{t("wal-68_balance")}</Box>
            <Stack>
              <Box
                className={"fs-16-regular t-right"}
                sx={{
                  color:
                    (Number(tokenBalance ?? 0) as number) -
                      ((Number(amount) as number) + (Number(walletSettingStore?.fee) as number) / (Number(tokenPrice ?? 0) as number)) <
                    0
                      ? "#EF4444"
                      : "#FFFFFF",
                }}
              >{`${numeral(Number(tokenBalance ?? 0) as number).format("0,0.0000")} ${token?.symbol ?? ""} -> ${numeral(
                (Number(tokenBalance ?? 0) as number) -
                  ((Number(amount) as number) + (Number(walletSettingStore?.fee) as number) / (Number(tokenPrice ?? 0) as number))
              ).format("0,0.0000")} ${token?.symbol ?? ""}`}</Box>
            </Stack>
          </Stack>
          <InputPasswordNoTooltip
            id="non-custodial-login"
            label={t("ncl-4_your-password")}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password ? true : false}
          />
          <Stack gap={"16px"}>
            <Button
              fullWidth
              type="submit"
              disabled={
                formik.errors.password ||
                Number(walletSettingStore?.fee) < 0 ||
                loading ||
                !formik.touched.password ||
                (Number(tokenBalance ?? 0) as number) -
                  ((Number(amount) as number) + (Number(walletSettingStore?.fee) as number) / (Number(tokenPrice ?? 0) as number)) <
                  0
                  ? true
                  : false
              }
              className="red-button"
            >
              {!loading && <Box className={"fs-16-regular"}>{t("wal-34_approve")}</Box>}
              {loading && (
                <CircularProgress
                  sx={{
                    color: "#F5EBFF",
                  }}
                />
              )}
            </Button>
            <Button
              fullWidth
              onClick={handleRejectClick}
              disabled={
                formik.errors.password ||
                Number(walletSettingStore?.fee) < 0 ||
                loading ||
                !formik.touched.password ||
                (Number(tokenBalance ?? 0) as number) -
                  ((Number(amount) as number) + (Number(walletSettingStore?.fee) as number) / (Number(tokenPrice ?? 0) as number)) <
                  0
                  ? true
                  : false
              }
              className="red-border-button"
            >
              <Box className={"fs-16-regular"}>{`${t("wal-65_reject")} (${timeLeft} s)`}</Box>
            </Button>
          </Stack>
        </Stack>
      </form>
      {blur && <Loading />}
      <SwitchChainModal
        open={switchChainModalOpen}
        setOpen={setSwitchChainModalOpen}
        handleRejectClick={handleRejectClick}
        switchChain={async () => {}}
        chain={chain}
      />
    </Stack>
  );
};

export default WalletD53Transaction;
