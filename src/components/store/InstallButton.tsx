import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import { emit } from "@tauri-apps/api/event";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Button, Stack, Box } from "@mui/material";

import D53Modal from "../home/D53Modal";

import { getDownloadStatus } from "../../features/home/DownloadStatusSlice";

import { IGame } from "../../types/GameTypes";
import { INotificationGameDownloadParams, INotificationParams } from "../../types/NotificationTypes";

import { checkOnline, downloadAndInstallNewGame, getFullExecutablePathNewGame, isInstalled } from "../../lib/helper/DownloadHelper";
import { IDownloadStatus } from "../../types/homeTypes";
import WarningModalNewGame from "../home/WarningModalNewGame";
import { District53 } from "../../lib/game/district 53/District53";

export interface IPropsInstallButton {
  game: IGame;
}

const InstallButton = ({ game }: IPropsInstallButton) => {
  const { t } = useTranslation();

  const downloadStatusStore: IDownloadStatus = useSelector(getDownloadStatus);

  const [modalView, setModalView] = useState<boolean>(false);
  const [d53ModalView, setD53ModalView] = useState<boolean>(false);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [installed, setInstalled] = useState(false);

  const handleClick = useCallback(async () => {
    if (installed) {
      if (game?._id === District53?._id) setD53ModalView(true);
      else setModalView(true);
      return;
    }
    const id = game?.project_name;
    if (!id) return;
    const online = await checkOnline();
    if (!online) {
      const noti_0: INotificationParams = {
        status: "failed",
        title: t("alt-26_internet-error"),
        message: t("alt-27_you-not-connected"),
        link: null,
        translate: false,
      };
      emit(TauriEventNames.NOTIFICATION, noti_0);
    } else {
      if (!installed) {
        const noti_1: INotificationGameDownloadParams = {
          status: "started",
          game: game,
        };
        emit(TauriEventNames.GAME_DOWNLOAD, noti_1);

        const downloadable = await downloadAndInstallNewGame(game);

        if (!downloadable) {
          const noti_1: INotificationGameDownloadParams = {
            status: "failed",
            game: game,
          };
          emit(TauriEventNames.GAME_DOWNLOAD, noti_1);
        } else {
          const noti_3: INotificationGameDownloadParams = {
            status: "finished",
            game: game,
          };
          emit(TauriEventNames.GAME_DOWNLOAD, noti_3);
        }
        setInstalled(await isInstalled(game));
      }
    }
  }, [game, installed]);

  useEffect(() => {
    const checkSupport = async () => {
      const fullPath = await getFullExecutablePathNewGame(game);
      if (!fullPath) setIsSupporting(false);
      else setIsSupporting(true);
    };

    checkSupport();
  }, [game]);

  useEffect(() => {
    const checkInstalled = async (game: IGame) => {
      setInstalled(await isInstalled(game));
    };

    let intervalId = setInterval(() => checkInstalled(game), 1 * 1e3);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [game]);

  return (
    <>
      <Button
        fullWidth
        onClick={handleClick}
        disabled={!isSupporting || downloadStatusStore?.isDownloading}
        sx={{
          height: "46px",
          width: "226px",
          color: "white",
          fontFamily: "Cobe-Bold",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: "400",
          lineHeight: "normal",
          borderRadius: "16px",
          backgroundColor: "#ef4444",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#992727",
          },
          "&.Mui-disabled": {
            backgroundColor: "#2a2525",
            color: "#7c7c7c",
          },
        }}
      >
        {!isSupporting && `Not supported`}
        {isSupporting && !installed && !downloadStatusStore?.isDownloading && t("hom-20_install-game")}
        {isSupporting && installed && !downloadStatusStore?.isDownloading && t("hom-7_play-game")}
        {downloadStatusStore?.isDownloading && (
          <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
            <Box className={"fs-14-regular white t-center"}>{`${t("hom-21_downloading")}`}</Box>
            <ThreeDots height="12px" width={"24px"} radius={4} color={`white`} />
          </Stack>
        )}
      </Button>
      <WarningModalNewGame open={modalView} setOpen={setModalView} game={game} />
      <D53Modal open={d53ModalView} setOpen={setD53ModalView} />
    </>
  );
};

export default InstallButton;
