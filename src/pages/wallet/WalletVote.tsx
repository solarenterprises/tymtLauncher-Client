import { useTranslation } from "react-i18next";

import { Grid, Box, Divider, Stack, Button, Pagination } from "@mui/material";

import accountIcon from "../../assets/wallet/account.svg";
import { useEffect, useState } from "react";
import Solar from "../../lib/wallet/Solar";
import { formatDecimal } from "../../lib/helper";
import ComingModal from "../../components/ComingModal";
const WalletVote = () => {
  const [data, setData] = useState<any>([]);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
    console.log("Current Page:", value);
  };

  useEffect(() => {
    const query = {
      page: 1,
      limit: 53,
      isResigned: false,
      orderBy: "rank:asc",
    };
    Solar.getDelegates(query, "delegates").then((res) => {
      setData(res.data.data);
    });
  }, []);
  return (
    <>
      <Grid container marginBottom={"30px"}>
        <Grid item xs={12} mb="24px">
          <Box className="fs-h1 white">{t("wal-16_vote-your-sxp")}</Box>
        </Grid>
        <Grid item xs={12} mb="32px">
          <Box className="fs-16-regular light">
            {t("wal-17_vote-for-solar")}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{
              backgroundColor: "#FFFFFF1A",
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box className="wallet-form-card br-16" padding={"24px"}>
            <Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={"64px"}>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={"8px"}
                  >
                    <Box className="fs-16-regular light">
                      {t("wal-18_total-voted")}
                    </Box>
                    <Box className="fs-18-bold white">0.00%</Box>
                  </Stack>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={"8px"}
                  >
                    <Box className="fs-16-regular light">
                      {t("wal-20_remaining")}
                    </Box>
                    <Box className="fs-18-bold white">100.00%</Box>
                  </Stack>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={"8px"}
                  >
                    <Box className="fs-16-regular light">
                      {t("wal-21_votes")}
                    </Box>
                    <Box className="fs-18-bold white">0/53</Box>
                  </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={"center"}>
                  <Box
                    sx={{
                      borderRight: "1px solid #FFFFFF1A",
                      height: "40px",
                    }}
                    mr={"11px"}
                  />
                  <Button className="red-button" onClick={() => setOpen(true)}>
                    <Box className="fs-18-bold white" padding={"10px 18px"}>
                      {t("wal-23_vote-now")}
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
                <Grid item xs={3}>
                  <Box className="fs-14-regular light">
                    {t("wal-25_account")}
                  </Box>
                </Grid>
                <Grid item xs={1.5}>
                  <Box className="fs-14-regular light">{t("wal-26_block")}</Box>
                </Grid>
                <Grid item xs={1.5}>
                  <Box className="fs-14-regular light">
                    {t("sto-5_ranking")}
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box className="fs-14-regular light">
                    {t("wal-28_rewards-earned")}
                  </Box>
                </Grid>
                <Grid item xs={3.7}>
                  <Box className="fs-14-regular light">{t("wal-29_vote")}</Box>
                </Grid>
              </Grid>
              {data
                .filter(
                  (_item, index) =>
                    index >= (currentPage - 1) * 10 && index < currentPage * 10
                )
                .map((item, index) => (
                  <Button
                    sx={{
                      height: "74px",
                      textTransform: "none",
                    }}
                  >
                    <Stack width={"100%"}>
                      <Grid container>
                        <Grid item xs={0.3}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                          >
                            <Box className="fs-14-regular light t-left">
                              {index + 1}.
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={3}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                            spacing={"8px"}
                          >
                            <Box
                              component={"img"}
                              src={accountIcon}
                              width={"40px"}
                              height={"40px"}
                            />
                            <Stack>
                              <Box className="fs-18-regular white">
                                {item.username}
                              </Box>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={1.5}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                          >
                            <Box className="fs-18-regular white t-left">
                              {item.blocks.produced}
                            </Box>
                          </Stack>
                        </Grid>
                        <Grid item xs={1.5}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                          >
                            <Stack>
                              <Box className="fs-18-regular white t-left">
                                {item.rank}
                              </Box>
                              {/* <Box className="fs-12-regular light t-left">
                              APR
                            </Box> */}
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={2}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                          >
                            <Stack>
                              <Box className="fs-18-regular white t-left">
                                {formatDecimal(item.forged.rewards ?? 0)}
                              </Box>
                              {/* <Box className="fs-12-regular light t-left">
                              $7,985.987
                            </Box> */}
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={3}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            height={"74px"}
                          >
                            <Stack>
                              <Box className="fs-18-regular white t-left">
                                {formatDecimal(item.votesReceived.votes ?? 0)}{" "}
                                SXP
                              </Box>
                              <Box className="fs-12-regular light t-left">
                                {item.votesReceived.percent}%
                              </Box>
                            </Stack>
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
                    count={6}
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
        <ComingModal open={open} setOpen={setOpen} />
      </Grid>
    </>
  );
};

export default WalletVote;
