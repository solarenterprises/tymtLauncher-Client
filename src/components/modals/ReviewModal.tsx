import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Modal, Fade, Box, Stack, Switch } from "@mui/material";

import StarLabelPanel from "../store/StarLabelPanel";
import InputText from "../account/InputText";
import RedStrokeButton from "../account/RedStrokeButton";

import CloseIcon from "../../assets/settings/x-icon.svg";

export interface IPropsReviewModal {
  open: boolean;
  setOpen: (_: boolean) => void;
}

const ReviewModal = ({ open, setOpen }: IPropsReviewModal) => {
  const { t } = useTranslation();

  const [star, setStar] = useState<number>(1);
  const [anonymous, setAnonymous] = useState<boolean>(false);

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
    onSubmit: () => {},
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
                  <Box className={"fs-h2 white"}>Leave Review</Box>
                  <Box className={"fs-16-light light"}>Share your thoughts</Box>
                </Stack>

                <StarLabelPanel value={star} setValue={setStar} />

                <Stack>
                  <InputText
                    id="headline"
                    label="Headline"
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
                    label="Review"
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
                  <Box className={"fs-18-regular white"}>Anonymous</Box>
                  <Switch value={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                </Stack>
                <RedStrokeButton text="Submit Review" isSubmit={true} />
              </Stack>
            </form>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ReviewModal;
