import { useState } from "react";
import { Grid, Stack, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewGroupModal from "./NewGroupModal";
import { useTranslation } from "react-i18next";

export interface IPropsNewGroupButton {
  roomMode: boolean;
}

const NewGroupButton = ({ roomMode }: IPropsNewGroupButton) => {
  const { t } = useTranslation();
  const [openNewGroupModal, setOpenNewGroupModal] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleNewGroupButtonClick = () => {
    setOpenNewGroupModal(true);
  };

  return (
    <>
      <Grid
        item
        xs={12}
        container
        sx={{
          overflowX: "hidden",
          height: "64px",
          flexDirection: "row",
          justifyContent: "left",
          alignItems: "center",
          padding: "12px 5px 12px 5px",
        }}
      >
        <Stack
          direction="row"
          gap={"10px"}
          width={"100%"}
          height={"40px"}
          alignItems={"center"}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleNewGroupButtonClick}
          sx={{
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              transition: "all 0.3s ease", // Transition property
              minWidth: "40px",
              minHeight: "40px",
              width: "40px",
              height: "40px",
              borderRadius: isHovered ? "10px" : "20px",
              backgroundColor: isHovered ? "#EF4444" : "transparent",
              border: "1px solid #EF4444",
            }}
          >
            <AddIcon
              sx={{
                transition: "all 0.3s ease", // Transition property
                width: "20px",
                height: "20px",
                padding: "10px",
                color: isHovered ? "#071616" : "#EF4444",
              }}
            />
          </Box>
          <Box className={"fs-16-regular white t-center"}>{t("cha-45_create-new-group")}</Box>
        </Stack>
      </Grid>
      <NewGroupModal open={openNewGroupModal} setOpen={setOpenNewGroupModal} roomMode={roomMode} />
    </>
  );
};

export default NewGroupButton;
