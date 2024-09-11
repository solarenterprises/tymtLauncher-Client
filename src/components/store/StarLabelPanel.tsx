import { useTranslation } from "react-i18next";

import { Stack, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export interface IPropsStarLabelPanel {
  value: number;
  setValue: (_: number) => void;
}

const StarLabelPanel = ({ value, setValue }: IPropsStarLabelPanel) => {
  const { t } = useTranslation();

  const items = Array.from({ length: 5 });
  const labelList: string[] = [t("ga-36_bad"), t("ga-37_thats-right"), t("ga-38_normally"), t("ga-39_good"), t("ga-40_excellent")];

  return (
    <>
      <Stack direction="row" gap={"32px"} alignSelf={"center"}>
        {items?.map((_item, index) => (
          <Stack
            key={`${index}-starLabelPanel`}
            alignItems={"center"}
            onClick={() => setValue(index + 1)}
            sx={{
              cursor: "pointer",
            }}
          >
            <StarIcon
              sx={{
                color: index < value ? "white" : "none",
              }}
            />
            <Box className={"fs-12-light light"}>{labelList[index]}</Box>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default StarLabelPanel;
