import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";
import * as Yup from "yup";
import createKeccakHash from "keccak";

import { Box, Stack } from "@mui/material";

import { AppDispatch } from "../../store";
import { getAccount } from "../../features/account/AccountSlice";
import { setLogin } from "../../features/account/LoginSlice";
import { getSaltToken, setSaltToken } from "../../features/account/SaltTokenSlice";
import { setMnemonic } from "../../features/account/MnemonicSlice";
import { getMachineId } from "../../features/account/MachineIdSlice";
import { fetchMyInfoAsync } from "../../features/account/MyInfoSlice";

import AccountNextButton from "./AccountNextButton";
import InputText from "./InputText";

import tymtCore from "../../lib/core/tymtCore";
import AuthAPI from "../../lib/api/AuthAPI";

import { IAccount, IMachineId, ISaltToken } from "../../types/accountTypes";
import { getReqBodyNonCustodyBeforeSignIn, getReqBodyNonCustodySignIn } from "../../lib/helper/AuthAPIHelper";
import { decrypt } from "../../lib/api/Encrypt";

const LoginAccountForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const accountStore: IAccount = useSelector(getAccount);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);

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
    onSubmit: async () => {
      try {
        const decryptedMnemonic: string = await decrypt(accountStore?.mnemonic, formik.values.password);
        dispatch(setMnemonic(decryptedMnemonic));

        const body1 = getReqBodyNonCustodyBeforeSignIn(accountStore, decryptedMnemonic);
        const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);
        const salt: string = res1?.data?.salt;

        let token: string = "";
        if (salt !== saltTokenStore?.salt) {
          token = tymtCore.Blockchains.solar.wallet.signToken(salt, decryptedMnemonic);
          dispatch(
            setSaltToken({
              salt: salt,
              token: token,
            })
          );
        } else {
          token = saltTokenStore?.token;
        }

        const body2 = getReqBodyNonCustodySignIn(accountStore, machineIdStore, token);
        const res2 = await AuthAPI.nonCustodySignin(body2);
        const uid = res2?.data?._id;

        await dispatch(fetchMyInfoAsync(uid));

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
