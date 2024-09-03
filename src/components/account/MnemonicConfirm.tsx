import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getThreeConfirm, setThreeConfirm } from "../../features/account/ThreeConfirmSlice";
import { Box } from "@mui/material";
import MnemonicInput from "./MnemonicInput";
import { threeConfirmType } from "../../types/accountTypes";

const MnemonicConfirm = () => {
  const { t } = useTranslation();
  const threeConfirmStore: threeConfirmType = useSelector(getThreeConfirm);
  const dispatch = useDispatch();

  return (
    <div>
      <div
        style={{
          width: "520px",
          display: "flex",
        }}
      >
        <div
          style={{ width: "163px", height: "69px" }}
          onClick={() => {
            dispatch(setThreeConfirm({ ...threeConfirmStore, focus: 1 }));
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-33_third-word")}</Box>
          <MnemonicInput word={threeConfirmStore.first} focus={threeConfirmStore.focus === 1 ? true : false} />
        </div>
        <div
          style={{
            width: "163px",
            height: "69px",
            marginLeft: "13px",
            marginRight: "13px",
          }}
          onClick={() => {
            dispatch(setThreeConfirm({ ...threeConfirmStore, focus: 2 }));
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-34_sixth-word")}</Box>
          <MnemonicInput word={threeConfirmStore.second} focus={threeConfirmStore.focus === 2 ? true : false} />
        </div>
        <div
          style={{ width: "163px", height: "69px" }}
          onClick={() => {
            dispatch(setThreeConfirm({ ...threeConfirmStore, focus: 3 }));
          }}
        >
          <Box className={"fs-14-regular light m-b-8"}>{t("ncca-35_ninth-word")}</Box>
          <MnemonicInput word={threeConfirmStore.third} focus={threeConfirmStore.focus === 3 ? true : false} />
        </div>
      </div>
    </div>
  );
};

export default MnemonicConfirm;
