import { useTranslation } from "react-i18next";

import { SelectChangeEvent } from "@mui/material/Select";
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
      width: "160px",
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

const Releasedate = ["sto-6_coming-soon", "sto-7_last-7days", "sto-8_last-30-days", "sto-9_last-60-days", "sto-10_last-90-days"];

var selectedshow: boolean = false;

export interface IPropsReleasebtn {
  releaseDate: string;
  setReleaseDate: (_: string) => void;
}

const Releasebtn = ({ releaseDate, setReleaseDate }: IPropsReleasebtn) => {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value === releaseDate) {
      setReleaseDate("");
    } else {
      setReleaseDate(value);
    }
  };

  return (
    <div>
      <FormControl>
        <ThemeProvider theme={theme}>
          <Select
            fullWidth
            disabled
            displayEmpty
            value={releaseDate}
            onChange={handleChange}
            IconComponent={ExpandMoreIcon}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <>
                <Box className={"fs-16 white"}>{t("sto-1_release-date")}</Box>
                {selectedshow && <span>{selected}</span>}
              </>
            )}
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
          >
            {Releasedate.map((one) => (
              <MenuItem
                key={one}
                value={t(`${one}`)}
                sx={{
                  width: "180px",
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
              >
                <Box className={"fs-16 white"} sx={{ marginLeft: "8px" }}>
                  {t(`${one}`)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </ThemeProvider>
      </FormControl>
    </div>
  );
};

export default Releasebtn;
