import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import tymt from "../../assets/main/newlogohead.png";
import close from "../../assets/settings/x-icon.svg";
import d53 from "../../lib/game/district 53/logo.png";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  setMountedFalse,
  setMountedTrue,
} from "../../features/chat/Chat-intercomSupportSlice";
import {
  selectNotification,
  setNotification,
} from "../../features/settings/NotificationSlice";
import {
  languageType,
  notificationType,
  walletType,
} from "../../types/settingTypes";
import {
  IChain,
  ICurrency,
  INative,
  IToken,
  chainEnum,
  chainIconMap,
  multiWalletType,
} from "../../types/walletTypes";
import { getMultiWallet } from "../../features/wallet/MultiWalletSlice";
import { invoke } from "@tauri-apps/api/tauri";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { nonCustodialType } from "../../types/accountTypes";
import { getNonCustodial } from "../../features/account/NonCustodialSlice";
import createKeccakHash from "keccak";
import { getCurrency } from "../../features/wallet/CurrencySlice";
import { currencySymbols } from "../../consts/currency";
import numeral from "numeral";
import { selectWallet, setWallet } from "../../features/settings/WalletSlice";
import SettingStyle from "../../styles/SettingStyle";
import { ISendTransactionReq } from "../../types/eventParamTypes";
import { emit, listen } from "@tauri-apps/api/event";
import TransactionProviderAPI from "../../lib/api/TransactionProviderAPI";
import { selectLanguage } from "../../features/settings/LanguageSlice";
import InputPasswordNoTooltip from "../../components/account/InputPasswordNoTooltip";
import { getChain, setChainAsync } from "../../features/wallet/ChainSlice";
import {
  INotification,
  sendCoinAPIAsync,
} from "../../features/wallet/CryptoSlice";
import { IRecipient, ISendCoin } from "../../features/wallet/CryptoApi";
import Loading from "../../components/Loading";
import SwitchChainModal from "../../components/wallet/SwitchChainModal";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

const WalletD53Transaction = () => {
  const {
    t,
    i18n: { changeLanguage },
  } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const notificationStore: notificationType = useSelector(selectNotification);
  const multiWalletStore: multiWalletType = useSelector(getMultiWallet);
  const nonCustodialStore: nonCustodialType = useSelector(getNonCustodial);
  const currencyStore: ICurrency = useSelector(getCurrency);
  const walletStore: walletType = useSelector(selectWallet);
  const langStore: languageType = useSelector(selectLanguage);
  const chainStore: IChain = useSelector(getChain);
  const reserve: number = currencyStore.data[currencyStore.current] as number;
  const symbol: string = currencySymbols[currencyStore.current];
  const classname = SettingStyle();
  const [copied, setCopied] = useState<boolean>(false);
  const [chain, setChain] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [token, setToken] = useState<IToken | INative | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [blur, setBlur] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [icon, setIcon] = useState<string>("");
  const [jsonData, setJsonData] = useState<ISendTransactionReq>();
  const multiWalletRef = useRef(multiWalletStore);
  const chainStoreRef = useRef(chainStore);
  const [switchChainModalOpen, setSwitchChainModalOpen] =
    useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (componentRef.current) {
      const height = componentRef.current.offsetHeight;
      appWindow.setSize(new LogicalSize(445, height));
    }
  }, [note, memo, icon, amount, to, chain]);

  useEffect(() => {
    multiWalletRef.current = multiWalletStore;
  }, [multiWalletStore]);

  useEffect(() => {
    chainStoreRef.current = chainStore;
  }, [chainStore]);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("cca-63_required"))
        .test(
          "checks",
          t("cca-65_please-signup-import"),
          (_value) =>
            nonCustodialStore.password !== "" &&
            nonCustodialStore.mnemonic !== ""
        )
        .test(
          "equals",
          t("cca-60_wrong-password"),
          (value) =>
            createKeccakHash("keccak256").update(value).digest("hex") ===
            nonCustodialStore.password
        ),
    }),
    onSubmit: () => {
      handleApproveClick();
    },
  });

  const handleApproveClick = async () => {
    setLoading(true);
    let res: INotification;
    try {
      if (chain === "solar" || chain === "bitcoin" || chain === "solana") {
        res = await TransactionProviderAPI.sendTransaction(
          jsonData,
          formik.values.password,
          walletStore.fee
        );
        emit("res-POST-/send-transaction", res);
      } else {
        // EVM chains
        const recipients: IRecipient[] = [
          {
            address: to,
            amount: amount,
          },
        ];
        const tx = {
          passphrase: formik.values.password,
          recipients: recipients,
          fee: walletStore.fee,
          vendorField: memo,
        };
        const temp: ISendCoin = {
          chain: chainStore,
          data: tx,
        };
        dispatch(sendCoinAPIAsync(temp)).then((action) => {
          if (action.type.endsWith("/fulfilled")) {
            res = action.payload as INotification;
            res.title = `Send ${chainStore.currentToken}`;
            emit("res-POST-/send-transaction", res);
          }
        });
      }
    } catch (err) {
      console.error("Failed to TransactionProviderAPI.sendTransaction: ", err);
      res = {
        status: "failed",
        title: `Send ${chainStore.chain.symbol}`,
        message: err.toString(),
      };
      emit("res-POST-/send-transaction", res);
    }
    setTo("");
    setAmount("");
    setChain("");
    setNote("");
    setMemo("");
    setToken(undefined);
    invoke("hide_transaction_window");
    setLoading(false);
    setExpired(true);
    setTimeLeft(60);
    setSwitchChainModalOpen(false);
  };

  const handleRejectClick = async () => {
    let res = {
      status: "failed",
      title: `Send ${chainStore.chain.symbol}`,
      message: "Request rejected",
    };
    emit("res-POST-/send-transaction", res);
    setTo("");
    setAmount("");
    setChain("");
    setNote("");
    setMemo("");
    setToken(undefined);
    invoke("hide_transaction_window");
    setExpired(true);
    setTimeLeft(60);
    setSwitchChainModalOpen(false);
  };

  const getShortAddr: (_: string) => string = (_wallet: string) => {
    return (
      _wallet.substring(0, 10) + "..." + _wallet.substring(_wallet.length - 10)
    );
  };

  const switchChain = async (json_data: ISendTransactionReq) => {
    const newCurrentToken = await TransactionProviderAPI.getToken(json_data);
    const isNativeToken = await TransactionProviderAPI.isNativeToken(json_data);
    const currentMultiWalletStore = multiWalletRef.current;
    switch (json_data.chain) {
      case "solar":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Solar,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.solar));
        break;
      case "bitcoin":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Bitcoin,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.bitcoin));
        break;
      case "solana":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Solana,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.solana));
        break;
      case "ethereum":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Ethereum,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.ethereum));
        break;
      case "binance":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Binance,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.binance));
        break;
      case "polygon":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Polygon,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.polygon));
        break;
      case "arbitrum":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Arbitrum,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.arbitrumone));
        break;
      case "avalanche":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Avalanche,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.avalanche));
        break;
      case "optimism":
        dispatch(
          setChainAsync({
            ...currentMultiWalletStore.Optimism,
            currentToken: isNativeToken ? "chain" : newCurrentToken.symbol,
          })
        );
        setIcon(chainIconMap.get(chainEnum.optimism));
        break;
    }
  };

  useEffect(() => {
    changeLanguage(langStore.language);
  }, [langStore.language]);

  useEffect(() => {
    dispatch(setMountedTrue());
    dispatch(
      setNotification({
        ...notificationStore,
        alert: false,
      })
    );

    return () => {
      dispatch(setMountedFalse());
      dispatch(
        setNotification({
          ...notificationStore,
          alert: true,
        })
      );
    };
  }, [dispatch]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  useEffect(() => {
    const unlisten_send_transaction = listen(
      "POST-/send-transaction",
      async (event) => {
        setBlur(true);
        const json_data: ISendTransactionReq = JSON.parse(
          event.payload as string
        );
        setJsonData(json_data);
        let isValid: boolean = await TransactionProviderAPI.validateTransaction(
          json_data
        );
        if (!isValid) {
          invoke("hide_transaction_window");
          return;
        }
        // await switchChain(chain);
        if (
          chainStoreRef.current.chain.name !==
          TransactionProviderAPI.getChainName(json_data.chain)
        ) {
          console.log(
            chainStore.chain.name,
            TransactionProviderAPI.getChainName(json_data.chain)
          );
          setSwitchChainModalOpen(true);
        } else {
          switchChain(json_data);
        }
        setChain(json_data.chain);
        setTo(json_data.transfer[0].to);
        const totalAmount: number = json_data.transfer.reduce(
          (sum, transfer) => {
            return (sum + Number(transfer.amount)) as number;
          },
          0
        );
        setAmount(numeral(totalAmount).format("0,0.00"));
        setNote(json_data.note);
        setMemo(json_data.memo ?? "");
        setToken(await TransactionProviderAPI.getToken(json_data));
        setExpired(false);
        setTimeLeft(60);
        setBlur(false);
      }
    );

    return () => {
      unlisten_send_transaction.then((unlistenFn) => unlistenFn());
    };
  }, []);

  useEffect(() => {
    if (!expired) {
      let checkActivityIntervalId = setInterval(() => {
        if (Date.now() - lastActivity >= 5 * 1e3) {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        } else {
          setTimeLeft(60);
        }
      }, 1 * 1e3);

      return () => {
        clearInterval(checkActivityIntervalId);
      };
    }
  }, [expired, lastActivity]);

  useEffect(() => {
    if (timeLeft < 0) {
      handleRejectClick();
    }
  }, [timeLeft]);

  useEffect(() => {
    setLastActivity(Date.now());
  }, [formik.values.password, walletStore.fee]);

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
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          height={"64px"}
          padding={"0px 16px"}
        >
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
                <Box className="fs-12-regular white">
                  {chainStore.chain.wallet}
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
              <Box
                component={"img"}
                src={icon}
                width={"16px"}
                height={"16px"}
              />
              <Box className={"fs-16-regular white"}>
                {getShortAddr(chainStore.chain.wallet)}
              </Box>
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
          <Box className={"fs-24-regular white t-center"}>
            {t("wal-61_tx-request")}
          </Box>
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
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box className={"fs-16-regular light"}>{t("wal-69_memo")}</Box>
              <Box className={"fs-16-regular white t-right"}>{memo}</Box>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box className={"fs-16-regular light"}>
                {t("wal-62_recipient")}
              </Box>
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
                    navigator.clipboard.writeText(chainStore.chain.wallet);
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
                  <Box
                    className={"fs-14-regular light t-right"}
                  >{`${symbol} ${numeral(
                    Number(amount) * Number(token?.price ?? 0) * Number(reserve)
                  ).format("0,0.000")}`}</Box>
                </Stack>
                <Box
                  component={"img"}
                  src={token?.logo ?? chainStore.chain.logo ?? ""}
                  width={"30px"}
                  height={"30px"}
                />
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
            <Box className={"fs-16-regular light"}>{`${t(
              "wal-64_gas-fee"
            )}:`}</Box>
            <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
              <TextField
                type="text"
                id="outlined-adornment-weight"
                placeholder="0.0"
                InputProps={{
                  inputMode: "numeric",
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      classes={{ root: classname.adornment }}
                    >
                      {symbol}
                    </InputAdornment>
                  ),
                  classes: {
                    input: classname.input,
                  },
                }}
                value={numeral(
                  Number(walletStore.fee) * Number(reserve)
                ).format("0,0.0000")}
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
            </Stack>
          </Stack>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Box className={"fs-16-regular light"}>
              {t("wal-67_total-spend")}
            </Box>
            <Stack>
              <Box className={"fs-16-regular white t-right"}>{`${numeral(
                (Number(amount) as number) +
                  (Number(walletStore.fee) as number) /
                    (Number(token?.price ?? 0) as number)
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
                    (Number(token?.balance ?? 0) as number) -
                      ((Number(amount) as number) +
                        (Number(walletStore.fee) as number) /
                          (Number(token?.price ?? 0) as number)) <
                    0
                      ? "#EF4444"
                      : "#FFFFFF",
                }}
              >{`${numeral(Number(token?.balance ?? 0) as number).format(
                "0,0.0000"
              )} ${token?.symbol ?? ""} -> ${numeral(
                (Number(token?.balance ?? 0) as number) -
                  ((Number(amount) as number) +
                    (Number(walletStore.fee) as number) /
                      (Number(token?.price ?? 0) as number))
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
            error={
              formik.touched.password && formik.errors.password ? true : false
            }
          />
          <Stack gap={"16px"}>
            <Button
              fullWidth
              type="submit"
              disabled={
                formik.errors.password ||
                Number(walletStore.fee) < 0 ||
                loading ||
                !formik.touched.password ||
                (Number(token?.balance ?? 0) as number) -
                  ((Number(amount) as number) +
                    (Number(walletStore.fee) as number) /
                      (Number(token?.price ?? 0) as number)) <
                  0
                  ? true
                  : false
              }
              className="red-button"
            >
              {!loading && (
                <Box className={"fs-16-regular"}>{t("wal-34_approve")}</Box>
              )}
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
                Number(walletStore.fee) < 0 ||
                loading ||
                !formik.touched.password ||
                (Number(token?.balance ?? 0) as number) -
                  ((Number(amount) as number) +
                    (Number(walletStore.fee) as number) /
                      (Number(token?.price ?? 0) as number)) <
                  0
                  ? true
                  : false
              }
              className="red-border-button"
            >
              <Box className={"fs-16-regular"}>{`${t(
                "wal-65_reject"
              )} (${timeLeft} s)`}</Box>
            </Button>
          </Stack>
        </Stack>
      </form>
      {blur && <Loading />}
      <SwitchChainModal
        open={switchChainModalOpen}
        setOpen={setSwitchChainModalOpen}
        handleRejectClick={handleRejectClick}
        switchChain={() => switchChain(jsonData)}
        chain={chain}
      />
    </Stack>
  );
};

export default WalletD53Transaction;
