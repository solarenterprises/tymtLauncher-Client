import { useState } from "react";
import { FormControl, InputLabel, Input, IconButton } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { propsInputPasswordNoTooltipTypes } from "../../types/commonTypes";

const InputPasswordNoTooltip = ({ id, label, name, setValue, value, onChange, onBlur, error }: propsInputPasswordNoTooltipTypes) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ width: "100%" }} variant="standard" className="input-text">
      <InputLabel
        htmlFor={id}
        sx={{
          fontFamily: "Cobe",
          fontSize: "20px",
          fontWeight: "400",
          lineHeight: "24px",
          color: "#AFAFAF",
          padding: "5px",
          top: "-10px",
        }}
      >
        {label}
      </InputLabel>
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        onChange={
          onChange
            ? onChange
            : (e) => {
                if (setValue) setValue(e.target.value);
              }
        }
        value={value}
        onBlur={onBlur}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              className={"icon-button"}
              tabIndex={-1}
            >
              {showPassword ? <VisibilityOutlinedIcon className={"icon-button"} /> : <VisibilityOffOutlinedIcon className={"icon-button"} />}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          fontFamily: "Cobe",
          fontSize: "20px",
          fontWeight: "400",
          lineHeight: "24px",
          color: "#FFFFFF",
          padding: "5px",
          top: "-10px",
          "& input[type='password']::-ms-reveal": {
            display: "none",
          },
          "& input[type='password']::-ms-clear": {
            display: "none",
          },
        }}
      />
    </FormControl>
  );
};

export default InputPasswordNoTooltip;
