import { useTranslation } from "react-i18next";

import { Button, Stack, Box } from "@mui/material";

import downArrow from "../../assets/account/down-arrow.svg";

interface props {
  text: string;
  length: number;
  setLength: (_: number) => void;
}

const MnemonicComboBox = ({ text, length, setLength }: props) => {
  const { t } = useTranslation();

  return (
    <>
      <Stack className="mnemonic-dropdown">
        <Button fullWidth className={"mnemonic-dropdown-button"}>
          <Stack direction="row" justifyContent={"space-between"} alignItems={"center"} width={"448px"}>
            <Box
              className={"fs-18-regular"}
              sx={{
                color: "white",
              }}
            >
              {length === 12 && text === "want" && t("ncca-15_want-12-word")}
              {length === 24 && text === "want" && t("ncca-52_want-24-word")}
              {length === 12 && text === "have" && t("ncca-20_have-12-word")}
              {length === 24 && text === "have" && t("ncca-21_have-24-word")}
            </Box>
            <Box component={"img"} src={downArrow} />
          </Stack>
        </Button>
        <div className="mnemonic-dropdown-box">
          <Button
            className={"mnemonic-dropdown-top-index-button"}
            sx={{
              borderBottom: "0px",
            }}
            onClick={() => {
              setLength(12);
            }}
          >
            <Stack width={"448px"}>
              <Box
                className={"fs-16-regular"}
                sx={{
                  width: "100%",
                  color: "white",
                  textAlign: "left",
                }}
              >
                {text === "want" && t("ncca-15_want-12-word")}
                {text === "have" && t("ncca-20_have-12-word")}
              </Box>
            </Stack>
          </Button>
          <Button
            className={"mnemonic-dropdown-bottom-index-button"}
            onClick={() => {
              setLength(24);
            }}
          >
            <Stack width={"448px"}>
              <Box
                className={"fs-16-regular white t-left"}
                sx={{
                  width: "100%",
                }}
              >
                {text === "want" && t("ncca-52_want-24-word")}
                {text === "have" && t("ncca-21_have-24-word")}
              </Box>
            </Stack>
          </Button>
        </div>
      </Stack>
    </>
  );
};

export default MnemonicComboBox;
