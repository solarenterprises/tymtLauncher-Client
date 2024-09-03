import { styled } from "@mui/material/styles";
import { FormGroup, Switch, Stack } from "@mui/material";
import { propsSwitchComp } from "../types/commonTypes";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  borderRadius: 20,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 20,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(15px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#52E1F2",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 10,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const SwitchComp = ({ checked, onClick, disabled }: propsSwitchComp) => {
  return (
    <FormGroup>
      <Stack direction="row" spacing={1} alignItems="center">
        <AntSwitch
          checked={checked}
          inputProps={{ "aria-label": "ant design" }}
          onChange={() => {
            onClick();
          }}
          disabled={disabled}
        />
      </Stack>
    </FormGroup>
  );
};

export default SwitchComp;
