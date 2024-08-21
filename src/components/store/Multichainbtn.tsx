import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Grid, Box, MenuItem, FormControl, Stack, Select, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import solar from "../../assets/chains/solar.svg";
import binance from "../../assets/chains/binance.svg";
import ethereum from "../../assets/chains/ethereum.svg";
import bitcoin from "../../assets/chains/bitcoin.svg";
import solana from "../../assets/chains/solana.svg";
import polygon from "../../assets/chains/polygon.svg";
import avalanche from "../../assets/chains/avalanche.svg";
import arbitrum from "../../assets/chains/arbitrum.svg";
import optimism from "../../assets/chains/optimism.svg";

const MenuProps = {
  MenuListProps: {
    style: {
      paddingTop: "0",
      paddingBottom: "0",
    },
  },
  PaperProps: {
    style: {
      marginTop: "5px",
      maxHeight: "none",
      width: "200px",
      display: "flex",
      alignItems: "center",
      borderRadius: "16px",
      border: "1px solid var(--Stroke, rgba(58, 58, 58, 0.50))",
      background: "rgba(27, 53, 56, 0.70)",
    },
  },
};

const Multichains = [
  { name: "sto-11_solar", url: solar },
  { name: "sto-12_binance", url: binance },
  { name: "sto-13_ethereum", url: ethereum },
  { name: "sto-14_bitcoin", url: bitcoin },
  { name: "sto-15_solana", url: solana },
  { name: "sto-16_polygon", url: polygon },
  { name: "sto-17_avalanche", url: avalanche },
  { name: "sto-18_arbitrum", url: arbitrum },
  { name: "sto-19_optimism", url: optimism },
];

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#FF5733",
    },
    secondary: {
      main: "#9e9e9e",
      light: "#F5EBFF",
      contrastText: "#47008F",
    },
  },
});

var selectedshow: boolean = false;

const Multichainbtn = () => {
  const { t } = useTranslation();
  const [chainName, setChainName] = useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof chainName>) => {
    const {
      target: { value },
    } = event;
    setChainName(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <FormControl>
      <ThemeProvider theme={theme}>
        <Select
          // disabled
          sx={{
            height: "40px",
            display: "flex",
            padding: "8px 16px 8px 16px",
            alignItems: "center",
            gap: 8,
            borderRadius: "32px",
            border: "1px solid rgba(82, 225, 242, 0.40)",
            background: "var(--bg-stroke-card-bg, rgba(27, 53, 56, 0.20))",
            "&:hover": {
              backgroundColor: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
            },
            "&:active": {
              backgroundColor: "var(--bg-stroke-blue-stroke-default-20, rgba(82, 225, 242, 0.20))",
            },
            "& .MuiSelect-icon": {
              color: "var(--Basic-Light, #AFAFAF)",
            },
          }}
          fullWidth
          displayEmpty
          multiple
          value={chainName}
          onChange={handleChange}
          MenuProps={MenuProps}
          IconComponent={ExpandMoreIcon}
          renderValue={(selected) => (
            <>
              <Box className={"fs-16 white"}>{t("sto-2_chains")}</Box>
              {selectedshow && selected.map((value) => <span key={value}>{value}</span>)}
            </>
          )}
        >
          {Multichains.map((chain) => (
            <MenuItem
              key={chain.name}
              value={chain.name}
              sx={{
                width: "200px",
                borderBottom: "1px solid var(--bg-stroke-white-10-stroke-default, rgba(255, 255, 255, 0.10))",
                "&:hover": {
                  background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                },
                "&.Mui-selected": {
                  background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                  "&:hover": {
                    background: "var(--bg-stroke-blue-stroke-default-10, rgba(82, 225, 242, 0.10))",
                  },
                  backdropFilter: "blur(10px)",
                },
                backdropFilter: "blur(10px)",
              }}
            >
              <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
                <Stack flexDirection={"row"} alignItems={"center"}>
                  <img src={chain.url} width={"18px"} style={{ backdropFilter: "blur(50px)" }} />
                  <Box className={"fs-16 white"} sx={{ marginLeft: "8px" }}>
                    {t(`${chain.name}`)}
                  </Box>
                </Stack>
                <Checkbox
                  sx={{
                    width: "36px",
                    height: "36px",
                    color: "#7C7C7C",
                    "&.Mui-checked": {
                      color: "#52E1F2",
                      borderRadius: "4px",
                      boxShadow: "1px rgba(82, 225, 242, 0.20)",
                    },
                    marginRight: 0,
                  }}
                  checked={chainName.indexOf(chain.name) > -1}
                />
              </Grid>
            </MenuItem>
          ))}
        </Select>
      </ThemeProvider>
    </FormControl>
  );
};

export default Multichainbtn;
