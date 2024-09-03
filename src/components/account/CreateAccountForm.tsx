import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Box, Stack } from "@mui/material";

import AccountNextButton from "./AccountNextButton";
import InputText from "./InputText";
import IAgreeTerms from "./IAgreeTerms";
import { IAccount } from "../../types/accountTypes";

import { getTempAccount, setTempAccount } from "../../features/account/TempAccountSlice";

const CreateAccountForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tempAccountStore: IAccount = useSelector(getTempAccount);

  const [checked, setChecked] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordMatch: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
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
      passwordMatch: Yup.string()
        .required(t("cca-63_required"))
        .oneOf([Yup.ref("password")], t("cca-64_password-must-match")),
    }),
    onSubmit: () => {
      try {
        const newPassword = formik.values.password;
        const newTempAccountStore: IAccount = {
          ...tempAccountStore,
          password: newPassword,
        };
        dispatch(setTempAccount(newTempAccountStore));
        navigate("/non-custodial/signup/2");
      } catch (err) {
        console.log("Failed at CreateAccountForm: ", err);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={"24px"}>
          <Box className="fs-24-regular white">Create account</Box>
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
          <Stack>
            <InputText
              id="repeat-password"
              label="Repeat Password"
              type="password"
              name="passwordMatch"
              value={formik.values.passwordMatch}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.passwordMatch && formik.errors.passwordMatch ? true : false}
            />
            {formik.touched.passwordMatch && formik.errors.passwordMatch && <Box className={"fs-16-regular red"}>{formik.errors.passwordMatch}</Box>}
          </Stack>
          <IAgreeTerms checked={checked} setChecked={setChecked} />
          <AccountNextButton
            isSubmit={true}
            text={"Next"}
            disabled={(formik.errors.password ? true : false || formik.errors.passwordMatch ? true : false) || !checked}
          />
        </Stack>
      </form>
    </>
  );
};

export default CreateAccountForm;
