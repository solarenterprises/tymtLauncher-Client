import { Box, Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import SettingStyle from "../../styles/SettingStyle";

export interface IPropsNewGroupSwitch {
  value: string;
  setValue: (_: string) => void;
}

const NewGroupSwitch = ({ value, setValue }: IPropsNewGroupSwitch) => {
  const { t } = useTranslation();
  const classname = SettingStyle();

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={"6px"} className={classname.fee_switch_container}>
        <Button
          className={value === "public" ? "switch-button-checked" : "switch-button"}
          onClick={() => {
            setValue("public");
          }}
        >
          <Box
            className={"fs-18-regular"}
            sx={{
              padding: "8px 16px",
              color: value === "public" ? "#52E1F2" : "white",
              fontFeatureSettings: "'calt' off",
            }}
          >
            {t("cha-46_public")}
          </Box>
        </Button>
        <Button
          className={value === "private" ? "switch-button-checked" : "switch-button"}
          onClick={() => {
            setValue("private");
          }}
        >
          <Box
            className={"fs-18-regular"}
            sx={{
              padding: "8px 16px",
              color: value === "private" ? "#52E1F2" : "white",
              fontFeatureSettings: "'calt' off",
            }}
          >
            {t("cha-47_private")}
          </Box>
        </Button>
      </Stack>
    </>
  );
};

export default NewGroupSwitch;
