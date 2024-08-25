import { useState, useEffect, useMemo } from "react";

import { Button } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { isInstalled } from "../../lib/api/Downloads";

import { IGame, IGameList } from "../../types/GameTypes";
import { emit } from "@tauri-apps/api/event";
import { TauriEventNames } from "../../consts/TauriEventNames";
import { useSelector } from "react-redux";
import { getRemoveStatus } from "../../features/home/RemoveStatusSlice";

export interface IPropsRemoveButton {
  game: IGame;
}

const RemoveButton = ({ game }: IPropsRemoveButton) => {
  const removeStatusStore: IGameList = useSelector(getRemoveStatus);

  const [installed, setInstalled] = useState<boolean>(false);

  const disabled = useMemo(() => removeStatusStore?.games?.some((one) => one._id === game._id) || !installed, [removeStatusStore, installed]);

  const handleClick = async () => {
    emit(TauriEventNames.FS_REMOVE_DIR, game);
  };

  useEffect(() => {
    const checkInstalled = async (game: IGame) => {
      console.log("checkInstalled");
      setInstalled(await isInstalled(game));
    };

    let intervalId = setInterval(() => checkInstalled(game), 1 * 1e3);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [game]);

  return (
    <>
      <Button className="button_navbar_common" disabled={disabled} onClick={handleClick}>
        <DeleteOutlineRoundedIcon
          sx={{
            color: "white",
          }}
        />
      </Button>
    </>
  );
};

export default RemoveButton;
