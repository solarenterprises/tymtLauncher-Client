import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { tymt_backend_url } from "../../configs";
import { ISaltToken, ITymt } from "../../types/accountTypes";
import Tymtshow from "../../components/home/Tymtshow";
import Bottom from "../../components/home/Bottom";
import Games from "../../lib/game/Game";
import ComingsoonD53 from "../../components/home/ComingSoon-D53";
import District53intro from "../../components/home/District53intro";
import RecentlyAddedD53 from "../../components/home/RecentlyAdded-D53";
import UpdateModal from "../../components/home/UpdateModeal";
import { getTymt } from "../../features/account/TymtSlice";
import { getSaltToken } from "../../features/account/SaltTokenSlice";

const Homepage = () => {
  const [image, setImage] = useState(Games["district53"].images[0]);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const tymtStore: ITymt = useSelector(getTymt);
  const [updateModal, setUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      const result = await axios.get(`${tymt_backend_url}/releases`, {
        headers: {
          "x-token": saltTokenStore.token,
        },
      });
      if (Number(result.data.result.data[0].versionNumber) > Number(tymtStore.version)) {
        setUpdateModal(true);
      }
    };
    init();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Tymtshow image={image} />
          <District53intro setImage={setImage} />
        </Grid>

        <Grid container xs={12} sx={{ marginTop: "80px" }}>
          <RecentlyAddedD53 />
          <ComingsoonD53 />
          <Bottom />
        </Grid>
        <UpdateModal open={updateModal} setOpen={setUpdateModal} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Homepage;
