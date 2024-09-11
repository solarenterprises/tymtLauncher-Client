import { Stack, Box } from "@mui/material";

import StarIcon from "@mui/icons-material/Star";

export interface IPropsStarLabelPanel {
  value: number;
  setValue: (_: number) => void;
}

const StarLabelPanel = ({ value, setValue }: IPropsStarLabelPanel) => {
  const items = Array.from({ length: 5 });
  const labelList: string[] = ["Bad", "That's right", "Normally", "Good", "Excellent"];

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
