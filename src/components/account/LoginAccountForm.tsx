import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";
import * as Yup from "yup";
import createKeccakHash from "keccak";

import { Box, Stack } from "@mui/material";

import { getAccount } from "../../features/account/AccountSlice";
import { setLogin } from "../../features/account/LoginSlice";

import AccountNextButton from "./AccountNextButton";
import InputText from "./InputText";

import { IAccount } from "../../types/accountTypes";

const LoginAccountForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountStore: IAccount = useSelector(getAccount);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .test("equals", t("cca-60_wrong-password"), (value) => createKeccakHash("keccak256").update(value).digest("hex") === accountStore?.password)
        .test(
          "password-requirements",
          "Password must meet at least four out of the five requirements: Include a lowercase letter, an uppercase letter, a number, a special character, and be at least 8 characters long.",
          (value) => {
            if (!value) {
              return false;
            }
            const checks = [
              /[a-z]/.test(value), // Check for lowercase letter
              /[A-Z]/.test(value), // Check for uppercase letter
              /\d/.test(value), // Check for digit
              /^[^\s'";\\]+$/.test(value), // Exclude spaces, single quotes, double quotes, semicolons, and backslashes
              value.length >= 8, // Check for minimum length
            ];
            const passedConditions = checks.filter(Boolean).length;
            return passedConditions >= 4;
          }
        )
        .required(t("cca-63_required")),
    }),
    onSubmit: () => {
      try {
        dispatch(setLogin(true));
        navigate("/home");
      } catch (err) {
        console.log("Failed at LoginAccountForm: ", err);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={"24px"}>
          <Stack>
            <InputText
              id="password"
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password ? true : false}
            />
            {formik.touched.password && formik.errors.password && <Box className={"fs-16-regular red"}>{formik.errors.password}</Box>}
          </Stack>
          <AccountNextButton isSubmit={true} text={"Next"} disabled={formik.errors.password ? true : false} />
        </Stack>
      </form>
    </>
  );
};

export default LoginAccountForm;
