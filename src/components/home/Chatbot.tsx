import { Button } from "@mui/material";
import chatbot from "../../assets/main/chatbot.svg";
import Draggable from "react-draggable";

const Chatbot = () => {
  return (
    <Draggable>
      <Button
        sx={{
          position: "fixed",
          bottom: 50,
          right: 50,
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          background: "#EF4444",
          zIndex: 5000,
          textTransform: "none",
          "&:hover": {
            background: "#992727",
          },
        }}
      >
        <img src={chatbot} style={{ pointerEvents: "none" }} />
      </Button>
    </Draggable>
  );
};

export default Chatbot;
