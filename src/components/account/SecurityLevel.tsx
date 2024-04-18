import { Stack, Box } from "@mui/material";

import question from "../../assets/account/question.svg";
import { useTranslation } from "react-i18next";

interface props {
  password?: string;
}

const SecurityLevel = ({ password }: props) => {
  const { t } = useTranslation();

  const requirements = [
    {
      label: "Password Uppercase",
      condition: /[A-Z]/.test(password ?? "")
    },
    {
      label: "Password Special Characters",
      condition: /[\W_]/.test(password ?? "")
    },
    {
      label: "Password Lowercase",
      condition: /[a-z]/.test(password ?? "")
    },
    {
      label: "Password is Eight in Length",
      condition: (password ?? "").length >= 8
    },
    {
      label: "Password Has at Least One Number",
      condition: /\d/.test(password ?? "")
    }
  ];
  const getSecurityLevel = () => {
    let i: number = 0;
    requirements.forEach((req) => {
      if (req.condition) i++;
    });
    if (i <= 1) return t("ncca-10_very-weak");
    else if (i == 2) return t("ncca-53_weak");
    else if (i == 3) return t("ncca-54_normal");
    else if (i == 4) return t("ncca-55_strong");
    else if (i == 5) return t("ncca-56_very-strong");
  };
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={"8px"}>
      <Box width="24px" height="24px" component={"img"} src={question} />
      <Box
        className={"fs-16-light"}
        sx={{
          color: "#AFAFAF"
        }}
      >
        {t("ncca-4_security-level")}
      </Box>
      <Box
        className={"fs-16-light"}
        sx={{
          color:
            getSecurityLevel() === t("ncca-10_very-weak") ||
            getSecurityLevel() === t("ncca-53_weak")
              ? "#EF4444"
              : getSecurityLevel() === t("ncca-54_normal")
              ? "yellow"
              : "green"
        }}
      >
        {getSecurityLevel()}
      </Box>
    </Stack>
  );
};

export default SecurityLevel;
