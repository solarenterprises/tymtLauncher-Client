import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FormControl, InputLabel, Input, IconButton, Tooltip, Box, Stack } from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { propsInputTypes } from "../../types/commonTypes";

const InputText = ({ id, label, type, name, setValue, value, onChange, onBlur, error, onIconButtonClick, onAddressButtonClick }: propsInputTypes) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <>
      {type === "text" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
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
            type={"text"}
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFFF",
              padding: "5px",
              top: "-10px",
            }}
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
            autoComplete="off"
          />
        </FormControl>
      )}
      {type === "mnemonic" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
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
            type={"text"}
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
                  onClick={onIconButtonClick}
                  onMouseDown={handleMouseDownPassword}
                  className={"icon-button"}
                  tabIndex={-1}
                >
                  <ContentCopyIcon className={"icon-button"} />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFF",
              padding: "5px",
              top: "-10px",
            }}
            autoComplete="off"
          />
        </FormControl>
      )}
      {type === "password" && (
        <Tooltip
          title={
            <Stack
              spacing={"10px"}
              sx={{
                marginTop:
                  label === "Your password"
                    ? "-42px"
                    : label === "Repeat Password"
                    ? "-42px"
                    : label === "Password"
                    ? "25px"
                    : label === t("set-75_your-new-password")
                    ? "30px"
                    : label === "Your New Password"
                    ? "30px"
                    : "-42px",
                backgroundColor: "rgb(49, 53, 53)",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid rgb(71, 76, 76)",
              }}
            >
              <Box className="fs-16-regular white">{t("cca-4_your-password-must")}</Box>
              <Stack>
                <Box className="fs-14-regular light">• {t("cca-5_at-least-8")}</Box>
                <Box className="fs-14-regular light">• {t("cca-6_one-uppercase-letter")}</Box>
                <Box className="fs-14-regular light">• {t("cca-7_one-lowercase-letter")}</Box>
                <Box className="fs-14-regular light">• {t("cca-8_one-number-character")}</Box>
              </Stack>
            </Stack>
          }
          PopperProps={{
            sx: {
              [`& .MuiTooltip-tooltip`]: {
                maxWidth: "600px",
                backgroundColor: "transparent",
                boxShadow: "none",
              },
            },
          }}
        >
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
        </Tooltip>
      )}
      {type === "address" && (
        <FormControl className="input-text" sx={{ width: "100%" }} variant="standard">
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
            type={"text"}
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
                <IconButton onClick={onIconButtonClick} onMouseDown={handleMouseDownPassword} className={"icon-button"} tabIndex={-1}>
                  <ContentCopyIcon className={"icon-button"} />
                </IconButton>
                <IconButton onClick={onAddressButtonClick} onMouseDown={handleMouseDownPassword} className={"icon-button"} tabIndex={-1}>
                  <i className="pi pi-book icon-button" />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              fontFamily: "Cobe",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "24px",
              color: "#FFFFF",
              padding: "5px",
              top: "-10px",
            }}
            autoComplete="off"
          />
        </FormControl>
      )}
    </>
  );
};

export default InputText;
