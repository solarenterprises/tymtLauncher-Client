import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { currencySymbols } from "../../consts/SupportCurrency";

import tymtCore from "../../lib/core/tymtCore";

import { useNotification } from "../../providers/NotificationProvider";

import AnimatedComponent from "../../components/AnimatedComponent";
import InputText from "../../components/account/InputText";
import InputBox from "../../components/wallet/InputBox";
import AddressBookDrawer from "../../components/wallet/AddressBookDrawer";
import TransactionFeeDrawer from "../../components/wallet/TransactionFeeDrawer";
import ChooseChainDrawer from "../../components/wallet/ChooseChainDrawer";

import { Grid, Box, Stack, IconButton, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { INotification, selectPending, sendCoinAsync } from "../../features/wallet/CryptoSlice";
import { fetchCurrencyListAsync, getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getWalletSetting } from "../../features/settings/WalletSettingSlice";

import SettingStyle from "../../styles/SettingStyle";

import walletIcon from "../../assets/wallet.svg";

import { IRecipient, ISendCoin, ISendCoinData } from "../../features/wallet/CryptoApi";
import { formatBalance } from "../../lib/helper";

import { IBalanceList, ICurrencyList, ICurrentChain, ICurrentCurrency, ICurrentToken, IPriceList, IWallet } from "../../types/walletTypes";
import { IWalletSetting } from "../../types/settingTypes";
import { getCurrentToken } from "../../features/wallet/CurrentTokenSlice";
import {
  getCurrentChainWalletAddress,
  getNativeTokenBalanceByChainName,
  getNativeTokenPriceByChainName,
  getSupportChainByName,
  getSupportNativeOrTokenBySymbol,
} from "../../lib/helper/WalletHelper";
import { getCurrentChain } from "../../features/wallet/CurrentChainSlice";
import { ChainNames } from "../../consts/Chains";
import { getWallet } from "../../features/wallet/WalletSlice";
import { fetchBalanceListAsync, getBalanceList } from "../../features/wallet/BalanceListSlice";
import { fetchPriceListAsync, getPriceList } from "../../features/wallet/PriceListSlice";
import { getKeccak256Hash } from "../../lib/api/Encrypt";

// interface IPriceData {
//   price: string;
//   balance: string;
//   label: string;
//   logo: string;
// }

const WalletSendSXP = () => {
  const { t } = useTranslation();
  const classname = SettingStyle();
  const dispatch = useDispatch<AppDispatch>();

  const pending = useSelector(selectPending);
  const accountStore = useSelector(getAccount);
  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const walletSettingStore: IWalletSetting = useSelector(getWalletSetting);
  const currentTokenStore: ICurrentToken = useSelector(getCurrentToken);
  const currentChainStore: ICurrentChain = useSelector(getCurrentChain);
  const walletStore: IWallet = useSelector(getWallet);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);
  const priceListStore: IPriceList = useSelector(getPriceList);

  const [addressBookView, setAddressBookView] = useState<boolean>(false);
  const [transactionFeeView, setTransactionFeeView] = useState<boolean>(false);
  const [chooseChainView, setChooseChainView] = useState<boolean>(false);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [draft, setDraft] = useState<IRecipient[]>([]);
  const [password, setPassword] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const currentNativeOrToken = useMemo(() => getSupportNativeOrTokenBySymbol(currentTokenStore?.token), [currentTokenStore]);
  const currentSupportChain = useMemo(() => getSupportChainByName(currentChainStore?.chain), [currentChainStore]);
  const currentWallet = useMemo(() => getCurrentChainWalletAddress(walletStore, currentChainStore?.chain), [currentChainStore, walletStore]);
  const currentNativeBalance = useMemo(
    () => getNativeTokenBalanceByChainName(balanceListStore, currentChainStore?.chain) ?? 0,
    [balanceListStore, currentChainStore]
  );
  const currentNativePrice = useMemo(() => getNativeTokenPriceByChainName(priceListStore, currentChainStore?.chain) ?? 0, [priceListStore, currentChainStore]);

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const updateDraft = useCallback(() => {
    if (address === "" || amount === "") return;

    let currentToken: {
      address: string;
      symbol: string;
      logo: string;
      decimals: Number;
    } = {
      address: currentNativeOrToken?.address,
      symbol: currentNativeOrToken?.symbol,
      logo: currentNativeOrToken?.logo,
      decimals: currentNativeOrToken?.decimals,
    };

    const newItem: IRecipient = {
      address: address,
      amount: amount,
      chainSymbol: currentSupportChain?.chain?.symbol,
      tokenSymbol: currentToken.symbol,
      tokenAddr: currentToken.address,
      tokenDecimals: currentToken.decimals,
      icon: currentToken.logo,
    };

    let recipientAddrIsValid: boolean = false;
    if (currentSupportChain?.chain?.name === ChainNames.SOLAR) {
      recipientAddrIsValid = tymtCore.Blockchains.solar.wallet.validateAddress(newItem.address);
    } else if (currentSupportChain?.chain?.name === ChainNames.BITCOIN) {
      recipientAddrIsValid = tymtCore.Blockchains.btc.wallet.validateAddress(newItem.address);
    } else if (currentSupportChain?.chain?.name === ChainNames.SOLANA) {
      recipientAddrIsValid = tymtCore.Blockchains.solana.wallet.validateAddress(newItem.address);
    } else {
      recipientAddrIsValid = tymtCore.Blockchains.eth.wallet.validateAddress(newItem.address);
    }
    if (!recipientAddrIsValid) {
      setNotificationStatus("failed");
      setNotificationTitle(t("alt-22_invalid-address"));
      setNotificationDetail(t("alt-23_invalid-address-intro"));
      setNotificationOpen(true);
      setNotificationLink(null);
      return;
    }

    setDraft([...draft, newItem]);
  }, [draft, setDraft, address, amount, currentSupportChain, currentNativeOrToken]);

  const handleTransfer = useCallback(async () => {
    let params: ISendCoinData = {
      passphrase: password,
      fee: walletSettingStore?.fee,
      recipients: draft,
    };
    if (draft.length > 0) {
      params.recipients = draft;
    } else {
      params.recipients = [
        {
          address: address,
          amount: amount,
          chainSymbol: currentSupportChain?.chain?.symbol,
          tokenSymbol: currentNativeOrToken?.symbol,
          tokenAddr: currentNativeOrToken?.address,
          tokenDecimals: currentNativeOrToken?.decimals,
          icon: currentNativeOrToken?.logo,
        },
      ];

      const temp: ISendCoin = {
        currentTokenSymbol: currentTokenStore?.token,
        data: params,
      };
      dispatch(sendCoinAsync(temp)).then((action) => {
        if (action.type.endsWith("/fulfilled")) {
          setNotificationStatus((action.payload as INotification).status);
          setNotificationTitle((action.payload as INotification).title);
          setNotificationDetail((action.payload as INotification).message);
          setNotificationOpen(true);
          setNotificationLink(null);
          if ((action.payload as INotification).status === "success") {
            setDraft([]);
            setAmount("");
            setAddress("");
            setPassword("");
          }

          dispatch(fetchBalanceListAsync(walletStore));
          dispatch(fetchPriceListAsync());
          dispatch(fetchCurrencyListAsync());
        }
      });
    }
  }, [walletSettingStore, walletStore, draft, address, dispatch, password, currentNativeOrToken, currentSupportChain, accountStore]);

  const removeDraft = useCallback(
    (deleteId: number) => {
      setDraft((prevDraft) => {
        return prevDraft.filter((_, index) => index !== deleteId);
      });
    },
    [draft, setDraft]
  );

  const handleAmount = useCallback(
    (value: string) => {
      setAmount(value);
    },
    [amount, setAmount]
  );

  useEffect(() => {
    setDraft([]);
    setAmount("");
    setAddress("");
    setPassword("");
  }, [currentChainStore]);

  return (
    <AnimatedComponent threshold={0}>
      <Grid container>
        <Grid container>
          <Grid item xs={12} md={12} xl={7} mb={"80px"}>
            <Box className={"wallet-form-card p-32-56 br-16"}>
              <Box className={"fs-h2 white"} mb={"32px"}>
                {t("wal-7_send-sxp")}
              </Box>
              <Box className={"wallet-form-card-hover p-24-16 br-16"} mb={"32px"} onClick={() => setChooseChainView(true)}>
                <Stack direction="row" alignItems={"center"} spacing={"16px"}>
                  <Box component={"img"} src={currentSupportChain?.chain?.logo} width={"36px"} height={"36px"} />
                  <Stack>
                    <Stack direction={"row"} spacing={"10px"}>
                      <Box className={"fs-18-regular light"}>{t("wal-8_from")}</Box>
                      <Box className={"fs-18-regular white"}>{currentSupportChain?.chain?.name}</Box>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box component={"img"} src={walletIcon} width={"12px"} height={"12px"} />
                      <Box className={"fs-14-regular light"}>{currentWallet}</Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
              <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} mb={"16px"}>
                  <Box className={"fs-18-regular light"}>{t("wal-9_you-send")}</Box>
                  <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                    <Box component={"img"} src={walletIcon} width={"18px"} height={"18px"} />
                    <Box className={"fs-12-light light"}>{formatBalance(currentNativeBalance ?? 0, 4)}</Box>
                    <Box
                      className={"fs-14-bold blue"}
                      onClick={() => {
                        setAmount(currentNativeBalance?.toString());
                        handleAmount(currentNativeBalance?.toString());
                      }}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      {t("wal-10_max")}
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Stack width={"100%"}>
                    <InputBox id="send-amount" placeholder="0.0" label="" align="left" onChange={handleAmount} value={amount?.toString()} />
                    <Box className={"fs-12-light light"}>{`~${symbol} ${formatBalance(Number(amount) * Number(currentNativePrice) * reserve, 4)}`}</Box>
                  </Stack>
                  <Stack direction={"row"} alignItems={"center"} padding={"4px 8px"} spacing={"8px"}>
                    {/* <Box component={"img"} src={chainStore.chain.logo} width={30}/>
                    <Box className={"fs-18-regular white"}>
                      {chainStore.chain.symbol}
                    </Box> */}
                    <Button
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                    >
                      <Stack direction={"row"} gap={1}>
                        <Box>
                          <img src={""} width={30} />
                        </Box>
                        <Box className="fs-18-regular white">{""}</Box>
                      </Stack>
                    </Button>
                    {/* <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                      >
                        {options.map((token, index) => (
                          <MenuItem onClick={() => {}} key={`${token}-${index}`}>
                            <Stack direction={"row"} gap={1}>
                              <Box>
                                <img src={token.icon} width={20} />
                              </Box>
                              <Box>{token.label}</Box>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Menu> */}
                  </Stack>
                </Stack>
              </Box>
              <Box className={"wallet-form-card p-16-16 br-16 blur"} mb={"32px"}>
                <Box className={"fs-18-regular light"} mb={"8px"}>
                  {t("wal-11_to")}
                </Box>
                <InputText
                  id="recipient-address"
                  type="address"
                  value={address}
                  setValue={setAddress}
                  label={t("wal-12_recipient-address")}
                  onIconButtonClick={() => {
                    navigator.clipboard.writeText(address);
                  }}
                  onAddressButtonClick={() => setAddressBookView(true)}
                />
                {Number(amount) > 0 && address !== "" && (Number(walletSettingStore?.fee) > 0 || currentSupportChain?.chain?.symbol !== "SXP") && (
                  <Button
                    fullWidth
                    className={classname.action_button}
                    onClick={() => {
                      updateDraft();
                    }}
                  >
                    {t("set-57_save")}
                  </Button>
                )}
              </Box>
              {(currentSupportChain?.chain?.symbol === "SXP" || currentSupportChain?.chain?.symbol === "BTC") && (
                <Box className={"wallet-form-card p-16-16 br-16"} mb={"32px"}>
                  <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box className={"fs-16-regular light"}>{t("wal-13_trans-fee")}</Box>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box className={"fs-16-regular white"}>{walletSettingStore?.fee} USD</Box>
                      <IconButton className="icon-button" onClick={() => setTransactionFeeView(true)}>
                        <EditOutlinedIcon className="icon-button" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              )}
              <Box mb={"32px"}>
                <InputText id="send-password" type="password" label={t("ncca-3_password")} value={password} setValue={setPassword} />
              </Box>
              <Button
                disabled={
                  pending ||
                  Number(amount) === 0 ||
                  address === "" ||
                  (Number(walletSettingStore?.fee) === 0 && currentSupportChain?.chain?.symbol === "SXP") ||
                  getKeccak256Hash(password) !== accountStore?.password
                }
                className={"red-button fw"}
                onClick={handleTransfer}
              >
                {t("wal-14_transfer")}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} xl={5} padding={"0px 32px"}>
            <Stack spacing={"16px"}>
              {draft.map((data, index) => (
                <Box className={"wallet-form-card p-16-16 br-16"} key={`${data?.amount}-${index}`}>
                  <Stack spacing={"15px"}>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <Stack>
                        <Box className="fs-18-regular light">{t("wal-11_to")}</Box>
                        <Box className="fs-18-regular white">{data.address}</Box>
                      </Stack>
                      <IconButton
                        className="icon-button"
                        onClick={() => {
                          removeDraft(index);
                        }}
                      >
                        <DeleteOutlineIcon className="icon-button" />
                      </IconButton>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                      <Box className="fs-16-regular light">{t("wal-15_amount")}</Box>
                      <Box className="fs-16-regular white">{data.amount + " " + data.tokenSymbol}</Box>
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <AddressBookDrawer view={addressBookView} setView={setAddressBookView} setAddress={setAddress} />
      <TransactionFeeDrawer view={transactionFeeView} setView={setTransactionFeeView} />
      <ChooseChainDrawer view={chooseChainView} setView={setChooseChainView} />
    </AnimatedComponent>
  );
};

export default WalletSendSXP;
