import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTempNonCustodial, setTempNonCustodial } from "../../features/account/TempNonCustodialSlice";
import { Button, Stack, Box } from "@mui/material";
import downArrow from "../../assets/account/down-arrow.svg";
import { nonCustodialType } from "../../types/accountTypes";
import { getMnemonic } from "../../consts/mnemonics";

interface props {
  text: string;
}

const MnemonicComboBox = ({ text }: props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tempNonCustodialStore: nonCustodialType = useSelector(getTempNonCustodial);

  useEffect(() => {
    dispatch(
      setTempNonCustodial({
        ...tempNonCustodialStore,
        mnemonic: getMnemonic(tempNonCustodialStore.mnemonicLength),
      })
    );
  }, [tempNonCustodialStore.mnemonicLength]);

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
              {tempNonCustodialStore.mnemonicLength === 12 && text === "want" && t("ncca-15_want-12-word")}
              {tempNonCustodialStore.mnemonicLength === 24 && text === "want" && t("ncca-52_want-24-word")}
              {tempNonCustodialStore.mnemonicLength === 12 && text === "have" && t("ncca-20_have-12-word")}
              {tempNonCustodialStore.mnemonicLength === 24 && text === "have" && t("ncca-21_have-24-word")}
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
              dispatch(
                setTempNonCustodial({
                  ...tempNonCustodialStore,
                  mnemonicLength: 12,
                })
              );
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
              dispatch(
                setTempNonCustodial({
                  ...tempNonCustodialStore,
                  mnemonicLength: 24,
                })
              );
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
