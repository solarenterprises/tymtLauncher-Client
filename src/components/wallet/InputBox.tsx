import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

interface props {
  id: string;
  label: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  align?: string;
  error?: boolean;
}

const InputBox = ({
  id,
  label,
  placeholder,
  name,
  onChange,
  value,
  align,
  error,
}: props) => {
  const [data, setData] = useState(value);

  const handleInputChange = useCallback(
    (event) => {
      const value = event.target.value;

      if ((isDecimalNumber(value) && parseFloat(value) >= 0) || value === "") {
        setData(value);
        onChange(value);
      } else {
        return;
      }
    },
    [data, setData]
  );

  const isDecimalNumber = (value) => {
    return /^\d*\.?\d*$/.test(value);
  };

  useEffect(() => {
    setData(value);
  }, [value]);

  return (
    <FormControl sx={{ width: "100%" }} variant="outlined">
      <InputLabel
        htmlFor={id}
        sx={{
          fontFamily: "Cobe",
          fontSize: "px",
          fontWeight: "400",
          lineHeight: "20px",
          color: "#AFAFAF",
        }}
      >
        {label}
      </InputLabel>
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
        value={data}
        error={error}
        autoComplete="off"
      />
    </FormControl>
  );
};

export default InputBox;
