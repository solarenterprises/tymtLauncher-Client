import { useState } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, MenuItem, FormControl, Select } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
      width: "80px",
      display: "flex",
      alignItems: "center",
      borderRadius: "16px",
      border: "1px solid var(--Stroke, rgba(58, 58, 58, 0.50))",
      background: "rgba(27, 53, 56, 0.70)",
      backdropFilter: "blur(50px)",
    },
  },
};

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

const Genre = ["sto-20_action", "sto-21_adventure", "sto-22_strategy"];

var selectedshow: boolean = false;

const Genrebtn = () => {
  const { t } = useTranslation();
  const [releasedate, setReleaseDate] = useState<string>("");
  const handleChange = (event: SelectChangeEvent) => {
    setReleaseDate(event.target.value);
  };

  return (
    <FormControl>
      <ThemeProvider theme={theme}>
        <Select
          disabled
          sx={{
            height: "40px",
            display: "flex",
            padding: "8px 16px 8px 16px",
            alignItems: "center",
            justifyContent: "center",
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
          value={releasedate}
          onChange={handleChange}
          MenuProps={MenuProps}
          IconComponent={ExpandMoreIcon}
          renderValue={(selected) => (
            <>
              <Box className={"fs-16 white"}>{t("sto-3_genre")}</Box>
              {selectedshow && <span>{selected}</span>}
            </>
          )}
        >
          {Genre.map((one) => (
            <MenuItem
              sx={{
                width: "130px",
                display: "flex",
                justifyContent: "space-between",
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
              key={one}
              value={t(`${one}`)}
            >
              <Box className={"fs-16 white"} sx={{ marginLeft: "8px" }}>
                {t(`${one}`)}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </ThemeProvider>
    </FormControl>
  );
};

export default Genrebtn;
