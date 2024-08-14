import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AudioVisualizer } from "react-audio-visualize";
import Sound from "react-sound";

import { Stack, Box } from "@mui/material";

import BubbleDownloadButton from "./BubbleDownloadButton";
import AudioToggleButton from "./AudioToggleButton";

import { ChatMessageType } from "../../types/chatTypes";

import { tymt_avatar_url } from "../../configs";

import adminIcon from "../../assets/chat/admin.png";
import moderatorIcon from "../../assets/chat/moderator.png";

// const AUDIO_URL = "https://dev.tymt.com/public/upload/BEN-48-Cryptocurrency.mp3";

export interface IParamsBubbleAudio {
  message: ChatMessageType;
  decryptedMessage: string;
  isLastMessage: boolean;
  isSender: boolean;
  roomMode: boolean;
  displayNickname: string;
  isDM: boolean;
  displayRole: string;
}

const BubbleAudio = ({ roomMode, message, decryptedMessage, isLastMessage, isSender, displayNickname, isDM, displayRole }: IParamsBubbleAudio) => {
  const { t } = useTranslation();

  const [blob, setBlob] = useState(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [durationDisplay, setDurationDisplay] = useState<number>(0);
  const [positionDisplay, setPositionDisplay] = useState<number>(0);
  const [loadedDisplay, setLoadedDisplay] = useState<boolean>(false);
  const [mouseOn, setMouseOn] = useState<boolean>(false);

  const visualizerRef = useRef<HTMLCanvasElement>(null);

  const url = `${tymt_avatar_url}/public/upload/message/${message.message}`;

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchAudioFile = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        setBlob(blob);
      } catch (err) {
        console.error("Failed to fetchAudioFile: ", err);
      }
    };

    if (decryptedMessage) fetchAudioFile();
  }, [decryptedMessage]);

  return (
    <>
      <Box
        className={`fs-14-regular white ${isSender ? "bubble" : "bubble-partner"} ${
          isLastMessage ? (roomMode ? "br-20-20-20-0" : isSender ? "br-20-20-0-20" : "br-20-20-20-0") : "br-20"
        }`}
        sx={{ position: "relative" }}
        onMouseEnter={() => {
          setMouseOn(true);
        }}
        onMouseLeave={() => {
          setMouseOn(false);
        }}
      >
        {mouseOn && <BubbleDownloadButton url={url} name={decryptedMessage} />}

        <Stack>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            {!isDM && <Box className={"fs-12-regular white"}>{displayNickname}</Box>}
            {!isDM && displayRole === "admin" && <Box component={"img"} src={adminIcon} width={"12px"} height={"12px"} />}
            {!isDM && displayRole === "moderator" && <Box component={"img"} src={moderatorIcon} width={"12px"} height={"12px"} />}
          </Stack>
          <Stack direction="row" alignItems="center" gap="8px">
            <AudioToggleButton loaded={loadedDisplay} playing={playing} setPlaying={setPlaying} />
            <Stack gap={"2px"}>
              <AudioVisualizer
                ref={visualizerRef}
                blob={blob}
                width={200}
                height={50}
                barWidth={3}
                gap={1}
                barColor={"#ffffff55"}
                barPlayedColor={"#ffffff"}
                currentTime={positionDisplay / 1e3}
                style={{
                  width: "200px",
                  height: "20px",
                }}
              />
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box className="fs-16-regular white">{t("cha-63_audio")}</Box>
                <Box className="fs-16-regular white">{playing ? formatTime(positionDisplay) : formatTime(durationDisplay)}</Box>
              </Stack>
            </Stack>
          </Stack>
          <Box className="fs-14-light timestamp-inbubble" sx={{ alignSelf: "flex-end" }} color={"rgba(11, 11, 11, 0.7)"}>
            {new Date(message.createdAt).toLocaleString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Box>
        </Stack>
      </Box>

      <Sound
        url={url}
        playStatus={playing ? Sound.status.PLAYING : Sound.status.STOPPED}
        autoLoad={true}
        onLoading={({ duration }) => {
          setDurationDisplay(duration);
        }}
        onLoad={({ loaded }) => {
          setLoadedDisplay(loaded);
        }}
        onPlaying={({ position }) => {
          setPositionDisplay(position);
        }}
        onFinishedPlaying={() => {
          setPlaying(false);
          setPositionDisplay(0);
        }}
      />
    </>
  );
};

export default BubbleAudio;
