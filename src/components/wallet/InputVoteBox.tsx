import { useMemo } from "react";
import { useSelector } from "react-redux";
import numeral from "numeral";

import { supportChains } from "../../consts/SupportTokens";
import { ChainNames } from "../../consts/Chains";

import { Box, FormControl, InputLabel, OutlinedInput } from "@mui/material";

import { getBalanceList } from "../../features/wallet/BalanceListSlice";

import { IBalanceList, IVotingData } from "../../types/walletTypes";

interface props {
  id: string;
  label: string;
  placeholder?: string;
  name?: string;
  value?: IVotingData;
  onChange?: (value: IVotingData) => void;
  align?: string;
  error?: boolean;
}

const InputVoteBox = ({ id, label, placeholder, name, onChange, value, align, error }: props) => {
  const balanceListStore: IBalanceList = useSelector(getBalanceList);

  const solarBalance = useMemo(
    () => balanceListStore?.list?.find((one) => one?.symbol === supportChains?.find((chain) => chain?.chain?.name === ChainNames?.SOLAR)?.chain?.symbol),
    [balanceListStore]
  );

  const handleInputChange = (event) => {
    const newVal = event.target.value;
    if ((isDecimalNumber(newVal) && parseFloat(newVal) >= 0) || newVal === "") {
      onChange({
        ...value,
        [id]: Number(newVal),
      });
    } else {
      return;
    }
  };

  const isDecimalNumber = (value) => {
    return /^(\d+)?(\.\d*)?$/.test(value);
  };

  return (
    <FormControl sx={{ width: "100%", zIndex: "100" }} variant="outlined">
      <InputLabel
        htmlFor={id}
        sx={{
          fontFamily: "Cobe",
          fontSize: "px",
          fontWeight: "400",
          lineHeight: "20px",
          color: "#AFAFAF",
          top: "10px",
        }}
      >
        {label}
      </InputLabel>
      <Box
        className={"fs-14-light light"}
        sx={{
          position: "absolute",
          top: "8px",
          left: "8px",
        }}
      >
        {numeral(Number(value[id]) * Number(solarBalance) * 0.01).format("0,0.0000") + " SXP"}
      </Box>
      <OutlinedInput
        id={id}
        name={name}
        type={"text"}
        placeholder={placeholder}
        inputProps={{
          style: { textAlign: align === "left" ? "left" : "right" },
        }}
        sx={{
          fontFamily: "Cobe",
          fontSize: "18px",
          fontWeight: "400",
          lineHeight: "20px",
          color: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          textAlign: "right",
        }}
        onChange={handleInputChange}
        value={value[id]?.toString() ?? ""}
        error={error}
        autoComplete="off"
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDoubleClick={(e: React.MouseEvent<HTMLElement>) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </FormControl>
  );
};

export default InputVoteBox;
