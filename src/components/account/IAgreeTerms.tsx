import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAccount, setAccount } from "../../features/account/AccountSlice";

import { Stack, Checkbox, Box } from "@mui/material";

import { accountType } from "../../types/accountTypes";
import { useEffect } from "react";

const IAgreeTerms = () => {
  const { t } = useTranslation();
  const accountStore: accountType = useSelector(getAccount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAccount({ ...accountStore, agreedTerms: false }));
  }, []);
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"8px"}
      onClick={() => {
        dispatch(
          setAccount({
            ...accountStore,
            agreedTerms: !accountStore.agreedTerms,
          })
        );
      }}
    >
      <Checkbox
        checked={accountStore.agreedTerms}
        sx={{
          width: "20px",
          height: "20px",
          color: "#7C7C7C",
        }}
      />
      <Box
        className={"fs-16-regular white"}
        sx={{
          cursor: "pointer",
        }}
      >
        {t("ncca-6_agree-terms-privacy")}
      </Box>
    </Stack>
  );
};

export default IAgreeTerms;
