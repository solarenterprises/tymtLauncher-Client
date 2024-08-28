import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import numeral from "numeral";

import { currencySymbols } from "../../consts/SupportCurrency";
import { ChainNames } from "../../consts/Chains";

import { useNotification } from "../../providers/NotificationProvider";

import PasswordModal from "../../components/PasswordModal";
import InputVoteBox from "../../components/wallet/InputVoteBox";
import AnimatedComponent from "../../components/AnimatedComponent";

import { Grid, Box, Divider, Stack, Button, Pagination, IconButton, Tooltip } from "@mui/material";

import { getWallet } from "../../features/wallet/WalletSlice";
import { getCurrencyList } from "../../features/wallet/CurrencyListSlice";
import { getCurrentCurrency } from "../../features/wallet/CurrentCurrencySlice";
import { getPriceList } from "../../features/wallet/PriceListSlice";
import { getBalanceList } from "../../features/wallet/BalanceListSlice";

import SolarAPI from "../../lib/api/SolarAPI";
import Solar from "../../lib/wallet/Solar";

import { formatDecimal } from "../../lib/helper";
import { translateString } from "../../lib/api/Translate";
import { openLink } from "../../lib/api/Downloads";
import { getNativeTokenBalanceByChainName, getNativeTokenPriceByChainName } from "../../lib/helper/WalletHelper";

import accountIcon from "../../assets/wallet/account.svg";
import solarIcon from "../../assets/chains/solar.svg";
import refreshIcon from "../../assets/wallet/refresh-icon.svg";

import { IBalanceList, ICurrencyList, ICurrentCurrency, IPriceList, IVotingData, IWallet } from "../../types/walletTypes";

const WalletVote = () => {
  const { t } = useTranslation();

  const currencyListStore: ICurrencyList = useSelector(getCurrencyList);
  const currentCurrencyStore: ICurrentCurrency = useSelector(getCurrentCurrency);
  const walletStore: IWallet = useSelector(getWallet);
  const priceListStore: IPriceList = useSelector(getPriceList);
  const balanceListStore: IBalanceList = useSelector(getBalanceList);

  const reserve: number = useMemo(
    () => currencyListStore?.list?.find((one) => one?.name === currentCurrencyStore?.currency)?.reserve,
    [currencyListStore, currentCurrencyStore]
  );
  const symbol: string = useMemo(() => currencySymbols[currentCurrencyStore?.currency], [currentCurrencyStore]);
  const sxpPrice = useMemo(() => getNativeTokenPriceByChainName(priceListStore, ChainNames?.SOLAR), [priceListStore]);
  const sxpBalance = useMemo(() => getNativeTokenBalanceByChainName(balanceListStore, ChainNames?.SOLAR), [balanceListStore]);

  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [originalVotingData, setOriginalVotingData] = useState<IVotingData>({});
  const [votingData, setVotingData] = useState<IVotingData>({});
  const [sumVoting, setSumVoting] = useState<number>(0);
  const [voteChanged, setVoteChanged] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [totalVoted, setTotalVoted] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);

  const { setNotificationStatus, setNotificationTitle, setNotificationDetail, setNotificationOpen, setNotificationLink } = useNotification();

  const SolarGet53Delegates = () => {
    const query1 = {
      page: 1,
      limit: 53,
      isResigned: false,
      orderBy: "rank:asc",
    };
    return Solar.getDelegates(query1, "delegates");
  };

  const SolarGetMyVotingData = useCallback(() => {
    const query2 = {
      page: 1,
      limit: 1,
    };
    return SolarAPI.getData(query2, `wallets/${walletStore?.solar}/votes`);
  }, [walletStore]);

  const SolarGetAllDelegates = async () => {
    const query1 = {
      page: 1,
      limit: 100,
      isResigned: false,
      orderBy: "address:asc",
    };
    const res1: any = await Solar.getDelegates(query1, "delegates");
    const numberOfDelegates = res1.data.meta.totalCount;
    const numberOfPages = Math.ceil(numberOfDelegates / 100);
    let queries = [];
    for (let i = 2; i <= numberOfPages; i++) {
      queries.push({
        page: i,
        limit: 100,
        isResigned: false,
        orderBy: "address:asc",
      });
    }
    const res2: any[] = await Promise.all(queries.map((query) => Solar.getDelegates(query, "delegates")));
    let res3: any[] = res1.data.data;
    for (let i = 0; i < res2.length; i++) {
      res3 = [...res3, ...res2[i].data.data];
    }
    return res3;
  };

  const SolarGetBlockchain = () => {
    return SolarAPI.getData({}, `blockchain`);
  };

  const handleRefreshClick = async () => {
    try {
      setCurrentPage(1);

      const [res1, res2, res3, res4] = await Promise.all([SolarGet53Delegates(), SolarGetMyVotingData(), SolarGetAllDelegates(), SolarGetBlockchain()]);

      setData(res1.data.data);
      setTotalPage(res1.data.meta.pageCount);
      if (Array.isArray(res2.data.data) && res2.data.data.length > 0) {
        setVotingData(res2.data.data[0].asset.votes ?? {});
        setOriginalVotingData(res2.data.data[0].asset.votes ?? {});
      } else {
        setVotingData({});
        setOriginalVotingData({});
      }
      const newTotalVoted: number = res3.reduce((sum, element) => sum + element.votesReceived.votes / 1e8, 0);
      const newTotalRewards: number = res3.reduce((sum, element) => sum + element.forged.total / 1e8, 0);
      setTotalVoted(newTotalVoted);
      setTotalRewards(newTotalRewards);
      setLatestBlock(res4.data.data.block.height);

      setNotificationStatus("success");
      setNotificationTitle(t("wal-54_success"));
      setNotificationDetail(t("wal-55_block-producers-refreshed"));
      setNotificationOpen(true);
      setNotificationLink(null);
    } catch (err) {
      console.error("Failed to refresh voting page: ", err);
      const translated = await translateString(err.toString());
      setNotificationStatus("failed");
      setNotificationTitle(t("wal-53_refresh-vote-failed"));
      setNotificationDetail(translated);
      setNotificationOpen(true);
      setNotificationLink(null);
    }
  };

  const compareDictionaries = (dict1: IVotingData, dict2: IVotingData) => {
    if (Object.keys(dict1).length !== Object.keys(dict2).length) {
      return false;
    }
    for (let key in dict1) {
      if (dict1[key] !== dict2[key]) {
        return false;
      }
    }
    return true;
  };

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
    const query1 = {
      page: value,
      limit: 53,
      isResigned: false,
      orderBy: "rank:asc",
    };
    Solar.getDelegates(query1, "delegates").then((res) => {
      setData(res.data.data);
    });
  };

  useEffect(() => {
    const valuesArray = Object.values(votingData);
    const sumOfValues = valuesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    setSumVoting(sumOfValues);
    const filteredDictionary = Object.fromEntries(Object.entries(votingData).filter(([_key, value]) => value !== 0));
    if (!compareDictionaries(originalVotingData, filteredDictionary)) setVoteChanged(true);
    else setVoteChanged(false);
  }, [votingData]);

  useEffect(() => {
    handleRefreshClick();
  }, []);

  useEffect(() => {
    let intervalId;
    let error = false;

    const fetchData = async () => {
      if (error) {
      } else {
        try {
          const res = await SolarGetBlockchain();
          setLatestBlock(res.data.data.block.height);
        } catch (err) {
          console.error("Failed to setInterval 4*1e3: ", err);
          error = true;
        }
      }
    };

    intervalId = setInterval(fetchData, 4 * 1e3);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let intervalId;
    let error = false;

    const fetchData = async () => {
      if (error) {
      } else {
        try {
          const BPArray = await SolarGetAllDelegates();
          const newTotalVoted = BPArray.reduce((sum, element) => sum + element.votesReceived.votes / 1e8, 0);
          const newTotalRewards = BPArray.reduce((sum, element) => sum + element.forged.total / 1e8, 0);
          setTotalVoted(newTotalVoted);
          setTotalRewards(newTotalRewards);
        } catch (err) {
          console.error("Failed to setInterval 120*1e3: ", err);
          error = true;
        }
      }
    };

    intervalId = setInterval(fetchData, 120 * 1e3);

    return () => clearInterval(intervalId);
  });

  return (
    <>
      <AnimatedComponent threshold={0}>
        <Grid container marginBottom={"30px"}>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} width={"100%"}>
              <Stack spacing={"24px"} mb={"32px"}>
                <Box className="fs-h1 white">{t("wal-16_vote-your-sxp")}</Box>
                <Box className="fs-16-regular light">{t("wal-17_vote-for-solar")}</Box>
              </Stack>
              <Stack>
                <Box className="fs-18-regular light">{t("set-4_balance")}</Box>
                <Stack direction={"row"} spacing={"4px"} alignItems={"center"}>
                  <Box component={"img"} src={solarIcon} width={"24px"} height={"24px"} />
                  <Box className="fs-32-italic white">{numeral(sxpBalance).format("0,0.0000")}</Box>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider
              sx={{
                backgroundColor: "#FFFFFF1A",
              }}
            />
          </Grid>
          <Grid item xs={12} container justifyContent={"center"}>
            <Stack padding={"24px 40px"}>
              <Box className="fs-16-regular light t-center">{t("wal-52_latest-block")}</Box>
              <Box className="fs-34-bold white t-center">{`${numeral(latestBlock).format("0,0")}`}</Box>
            </Stack>
            <Stack padding={"32px 24px"}>
              <Box
                sx={{
                  borderRight: "1px solid #FFFFFF1A",
                  height: "68px",
                }}
              />
            </Stack>
            <Stack padding={"24px 40px"}>
              <Box className="fs-16-regular light t-center">{t("wal-18_total-voted")}</Box>
              <Box className="fs-34-bold white t-center">{`${numeral(totalVoted).format("0,0")} SXP`}</Box>
              <Box className="fs-18-regular light t-center">{`${symbol} ${numeral(totalVoted * Number(sxpPrice) * Number(reserve)).format("0,0")}`}</Box>
            </Stack>
            <Stack padding={"32px 24px"}>
              <Box
                sx={{
                  borderRight: "1px solid #FFFFFF1A",
                  height: "68px",
                }}
              />
            </Stack>
            <Stack padding={"24px 40px"}>
              <Box className="fs-16-regular light t-center">{t("wal-19_total-rewards")}</Box>
              <Box className="fs-34-bold beach t-center">{`+${numeral(totalRewards).format("0,0")} SXP`}</Box>
              <Box className="fs-18-regular light t-center">{`+${symbol} ${numeral(totalRewards * Number(sxpPrice) * Number(reserve)).format("0,0")}`}</Box>
            </Stack>
            <Stack padding={"32px 24px"}>
              <Box
                sx={{
                  borderRight: "1px solid #FFFFFF1A",
                  height: "68px",
                }}
              />
            </Stack>
            <Stack padding={"24px 40px"}>
              <Box className="fs-16-regular light t-center">{t("wal-51_sxp-price")}</Box>
              <Box className="fs-34-bold white t-center">{`${symbol} ${numeral(Number(sxpPrice) * Number(reserve)).format("0,0.00")}`}</Box>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Box className="wallet-form-card br-16" padding={"24px"}>
              <Stack>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Stack direction={"row"} alignItems={"center"} spacing={"64px"}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box className="fs-16-regular light">{t("wal-18_total-voted")}</Box>
                      <Box className={`fs-18-bold ${sumVoting === 0 || sumVoting === 100 ? "white" : "red"}`}>{`${numeral(sumVoting).format("0,0.00")}
                    %`}</Box>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box className="fs-16-regular light">{t("wal-20_remaining")}</Box>
                      <Box className={`fs-18-bold ${sumVoting === 0 || sumVoting === 100 ? "white" : "red"}`}>{`${numeral(100 - sumVoting).format("0,0.00")}
                    %`}</Box>
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                      <Box className="fs-16-regular light">{t("wal-21_votes")}</Box>
                      <Box className="fs-18-bold white">{`${Object.values(votingData).filter((value) => value !== 0).length}/53`}</Box>
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} alignItems={"center"}>
                    <Stack spacing={"8px"} mr={"11px"}>
                      <Tooltip
                        placement="top"
                        title={
                          <Stack
                            spacing={"10px"}
                            sx={{
                              marginBottom: "-10px",
                              backgroundColor: "rgb(49, 53, 53)",
                              padding: "6px 8px",
                              borderRadius: "32px",
                              border: "1px solid rgb(71, 76, 76)",
                            }}
                          >
                            <Box className="fs-16-regular white">{t("sto-35_refresh")}</Box>
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
                        <IconButton
                          className={"wallet-icon-button"}
                          onClick={() => {
                            handleRefreshClick();
                          }}
                        >
                          <img src={refreshIcon} className="wallet-icon-button-icon" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Box
                      sx={{
                        borderRight: "1px solid #FFFFFF1A",
                        height: "40px",
                      }}
                      mr={"11px"}
                    />
                    <Button className="red-button" onClick={() => setOpen(true)} disabled={!voteChanged || (sumVoting !== 0 && sumVoting !== 100)}>
                      <Box className="fs-18-bold white" padding={"10px 18px"}>
                        {voteChanged && sumVoting === 0 ? t("wal-47_cancel-vote") : t("wal-23_vote-now")}
                      </Box>
                    </Button>
                  </Stack>
                </Stack>
                <Divider
                  sx={{
                    backgroundColor: "#FFFFFF1A",
                    margin: "20px 0px",
                  }}
                />
                <Grid container mb={"20px"}>
                  <Grid item xs={0.3}>
                    <Box className="fs-14-regular light">{t("wal-24_tx#")}</Box>
                  </Grid>
                  <Grid item xs={3.5}>
                    <Box className="fs-14-regular light">{t("wal-25_account")}</Box>
                  </Grid>
                  <Grid item xs={1.5}>
                    <Box className="fs-14-regular light">{t("wal-26_block")}</Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box className="fs-14-regular light">{t("wal-28_rewards-earned")}</Box>
                  </Grid>
                  <Grid item xs={2.5}>
                    <Box className="fs-14-regular light">{t("wal-29_vote")}</Box>
                  </Grid>
                  <Grid item xs={2.2}>
                    <Box className="fs-14-regular light">{""}</Box>
                  </Grid>
                </Grid>
                {data.map((item, index) => (
                  <Button
                    key={`blockproducer-${item.address}`}
                    sx={{
                      height: "74px",
                      textTransform: "none",
                      borderLeft: Object.keys(votingData).includes(item.username) && votingData[item.username] !== 0 ? "5px solid #EF4444" : "none",
                    }}
                    onDoubleClick={() => {
                      openLink(`https://solarscan.com/wallet/${item.username}`);
                    }}
                  >
                    <Stack width={"100%"}>
                      <Grid container>
                        <Grid item xs={0.3}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"}>
                            <Box className="fs-14-regular light t-left">{(currentPage - 1) * 53 + index + 1}.</Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={3.5}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"} spacing={"8px"}>
                            <Box
                              component={"img"}
                              src={`https://assets.solarscan.com/avatars/${item.address}.jpg`}
                              width={"40px"}
                              height={"40px"}
                              sx={{
                                borderRadius: "20px",
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = accountIcon;
                              }}
                            />
                            <Stack spacing={"8px"}>
                              <Box className="fs-18-regular white">{item.username}</Box>
                              <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
                                {currentPage === 1 && (
                                  <Box
                                    className="fs-12-light white"
                                    sx={{
                                      borderRadius: "4px",
                                      border: "1px solid #3A7E52",
                                      backgroundColor: "rgba(58, 126, 82, 0.20)",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    {t("wal-58_active")}
                                  </Box>
                                )}
                                <Box
                                  className="fs-12-light white"
                                  sx={{
                                    borderRadius: "4px",
                                    border: "1px solid #EF8244",
                                    backgroundColor: "rgba(239, 130, 68, 0.20)",
                                    padding: "4px 8px",
                                  }}
                                >
                                  {`${item.votesReceived.voters} ${t("wal-59_voters")}`}
                                </Box>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={1.5}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"}>
                            <Box className="fs-18-regular white t-left">{item.blocks.produced}</Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={2}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"}>
                            <Stack>
                              <Box className="fs-18-regular white t-left">{`${numeral(formatDecimal(item.forged.total ?? 0)).format("0,0")} SXP`}</Box>
                              <Box className="fs-12-regular light t-left">
                                {`${numeral((item.forged.total * Number(sxpPrice) * Number(reserve)) / 1e8).format("0,0.00")} ${symbol}`}
                              </Box>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={2.5}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"}>
                            <Stack>
                              <Box className="fs-18-regular white t-left">{numeral(formatDecimal(item.votesReceived.votes ?? 0)).format("0,0")}</Box>
                              <Box className="fs-12-regular light t-left">{item.votesReceived.percent} %</Box>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={2.2}>
                          <Stack direction={"row"} alignItems={"center"} height={"74px"}>
                            <Box className="wallet-form-card-hover br-16 blur" padding={"0px 16px"} height={"54px"}>
                              <Stack direction={"row"} alignItems={"center"}>
                                <InputVoteBox id={item.username} label={""} align="right" value={votingData} onChange={setVotingData} />
                                <Box className="fs-18-regular light">%</Box>
                              </Stack>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                      <Divider
                        sx={{
                          backgroundColor: "#FFFFFF1A",
                        }}
                      />
                    </Stack>
                  </Button>
                ))}
                <Grid container>
                  <Grid item xs={12} container justifyContent={"center"}>
                    <Pagination
                      count={totalPage}
                      page={currentPage}
                      onChange={handlePageChange}
                      shape="rounded"
                      sx={{
                        marginTop: "20px",
                        "& .MuiPaginationItem-root": {
                          borderRadius: "6px",
                          fontFamily: "Cobe",
                          color: "#AFAFAF",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          color: "white",
                          backgroundColor: "#232B2C",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>
          <PasswordModal open={open} setOpen={setOpen} voteAsset={Object.fromEntries(Object.entries(votingData).filter(([_key, value]) => value !== 0))} />
        </Grid>
      </AnimatedComponent>
    </>
  );
};

export default WalletVote;
