import { Button } from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { ThreeDots } from "react-loader-spinner";

export interface IParamsAudioToggleButton {
  loaded: boolean;
  playing: boolean;
  setPlaying: (_: boolean) => void;
}

const AudioToggleButton = ({ loaded, playing, setPlaying }: IParamsAudioToggleButton) => {
  return (
    <>
      <Button
        onClick={() => {
          if (!loaded) return;
          setPlaying(!playing);
        }}
        sx={{
          transition: "all 0.3s ease",
          minWidth: "40px",
          minHeight: "40px",
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          "&:hover": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        {!loaded && <ThreeDots height="15px" width={"30px"} radius={3} color={"#58914e"} />}
        {loaded && !playing && (
          <PlayArrowIcon
            sx={{
              transition: "all 0.3s ease",
              width: "20px",
              height: "20px",
              padding: "10px",
              color: "#58914e",
              "&:hover": {
                color: "#58914e",
                transform: "scale(1.1)",
              },
            }}
          />
        )}
        {loaded && playing && (
          <StopIcon
            sx={{
              transition: "all 0.3s ease",
              width: "20px",
              height: "20px",
              padding: "10px",
              color: "#58914e",
              "&:hover": {
                color: "#58914e",
                transform: "scale(1.1)",
              },
            }}
          />
        )}
      </Button>
    </>
  );
};

export default AudioToggleButton;
