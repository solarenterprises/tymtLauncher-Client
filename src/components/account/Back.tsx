import { Button, Box } from "@mui/material";

import arrow from "../../assets/account/left-arrow.png";

interface props {
  onClick: () => void;
}

const Back = ({ onClick }: props) => {
  return (
    <Button className={"back-button"} onClick={onClick}>
      <Box component={"img"} src={arrow}></Box>
    </Button>
  );
};

export default Back;
