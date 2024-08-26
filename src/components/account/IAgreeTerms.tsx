import { useTranslation } from "react-i18next";

import { Stack, Checkbox, Box } from "@mui/material";

export interface IPropsIAgreeTerms {
  checked: boolean;
  setChecked: (_: boolean) => void;
}

const IAgreeTerms = ({ checked, setChecked }: IPropsIAgreeTerms) => {
  const { t } = useTranslation();

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"8px"}
      onClick={() => {
        setChecked(!checked);
      }}
      sx={{
        cursor: "pointer",
      }}
    >
      <Checkbox
        checked={checked}
        sx={{
          width: "20px",
          height: "20px",
          color: "#7C7C7C",
        }}
      />
      <Box className={"fs-16-regular white"}>{t("ncca-6_agree-terms-privacy")}</Box>
    </Stack>
  );
};

export default IAgreeTerms;
