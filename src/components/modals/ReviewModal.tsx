import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { emit } from "@tauri-apps/api/event";
import { useFormik } from "formik";
import * as Yup from "yup";

import { TauriEventNames } from "../../consts/TauriEventNames";

import { Modal, Fade, Box, Stack, Switch } from "@mui/material";

import StarLabelPanel from "../store/StarLabelPanel";
import InputText from "../account/InputText";
import RedStrokeButton from "../account/RedStrokeButton";

import { getMyInfo } from "../../features/account/MyInfoSlice";

import ReviewAPI from "../../lib/api/ReviewAPI";

import CloseIcon from "../../assets/settings/x-icon.svg";

import { IReqAddReviews } from "../../types/ReviewAPITypes";
import { IMyInfo } from "../../types/chatTypes";
import { INotificationParams } from "../../types/NotificationTypes";
import { IGame } from "../../types/GameTypes";

export interface IPropsReviewModal {
  open: boolean;
  setOpen: (_: boolean) => void;
  game: IGame;
}

const ReviewModal = ({ open, setOpen, game }: IPropsReviewModal) => {
  const { t } = useTranslation();

  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  const [star, setStar] = useState<number>(1);
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const starRef = useRef(star);
  const anonymousRef = useRef(anonymous);
  const myInfoStoreRef = useRef(myInfoStore);

  useEffect(() => {
    starRef.current = star;
  }, [star]);
  useEffect(() => {
    anonymousRef.current = anonymous;
  }, [anonymous]);
  useEffect(() => {
    myInfoStoreRef.current = myInfoStore;
  }, [myInfoStore]);

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const formik = useFormik({
    initialValues: {
      headline: "",
      review: "",
    },
    validationSchema: Yup.object({
      headline: Yup.string().required(t("cca-63_required")),
      review: Yup.string().required(t("cca-63_required")),
    }),
    onSubmit: async () => {
      try {
        setLoading(true);
        const body: IReqAddReviews = {
          author: myInfoStoreRef?.current?._id, // 6601b44c609740cfa3cebcee
          game_id: game?._id,
          title: formik.values.headline,
          feedback: formik.values.review,
          star: starRef.current,
          isDeleted: false,
        };
        await ReviewAPI.addReviews(body);
        setLoading(false);
        setOpen(false);

        const noti: INotificationParams = {
          status: "success",
          title: t("set-85_success"),
          message: t("ga-30_review-added"),
          link: null,
          translate: false,
        };
        emit(TauriEventNames.NOTIFICATION, noti);

        emit(TauriEventNames.FETCH_REVIEW);
      } catch (err) {
        console.log("Failed at ReviewModal: ", err);
        setLoading(false);

        const noti: INotificationParams = {
          status: "failed",
          title: t("wal-56_failed"),
          message: err.toString(),
          link: null,
          translate: false,
        };
        emit(TauriEventNames.NOTIFICATION, noti);
      }
    },
  });

  return (
    <>
      <Modal
        open={open}
        style={modalStyle}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(4px)",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: "480px",
              padding: "40px 31px",
              borderRadius: "16px",
              border: "3px solid #ffffff33",
              background: "#8080804d",
              backgroundBlendMode: "luminosity",
              backdropFilter: "blur(10px)",
              "&:focusVisible": {
                outline: "none",
              },
            }}
          >
            <img src={CloseIcon} alt="close icon" className="close-icon" onClick={() => setOpen(false)} />
            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <Stack gap={"24px"} textAlign={"center"}>
                <Stack gap={"12px"}>
                  <Box className={"fs-h2 white"}>{t("ga-26_leave-review")}</Box>
                  <Box className={"fs-16-light light"}>{t("ga-31_share-your-thoughts")}</Box>
                </Stack>

                <StarLabelPanel value={star} setValue={setStar} />

                <Stack>
                  <InputText
                    id="headline"
                    label={t("ga-32_headline")}
                    type="text"
                    name="headline"
                    value={formik.values.headline}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.headline && formik.errors.headline ? true : false}
                  />
                  {formik.touched.headline && formik.errors.headline && <Box className={"fs-16-regular red t-left"}>{formik.errors.headline}</Box>}
                </Stack>
                <Stack>
                  <InputText
                    id="review"
                    label={t("ga-33_review")}
                    type="text"
                    name="review"
                    value={formik.values.review}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.review && formik.errors.review ? true : false}
                  />
                  {formik.touched.review && formik.errors.review && <Box className={"fs-16-regular red t-left"}>{formik.errors.review}</Box>}
                </Stack>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                  <Box className={"fs-18-regular white"}>{t("ga-34_anonymous")}</Box>
                  <Switch value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </Stack>
                <RedStrokeButton text={t("ga-35_submit-review")} isSubmit={true} loading={loading} />
              </Stack>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ReviewModal;
