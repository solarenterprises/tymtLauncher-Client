import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useFormik } from "formik";
import * as Yup from "yup";

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

import AuthAPI from "../../lib/api/AuthAPI";

import { decrypt, getKeccak256Hash } from "../../lib/api/Encrypt";
import { getNonCustodySignInToken, getReqBodyNonCustodyBeforeSignIn, getReqBodyNonCustodySignIn } from "../../lib/helper/AuthAPIHelper";

import { IAccount, IMachineId, ISaltToken } from "../../types/accountTypes";
import { getRsaKeyPairAsync } from "../../features/chat/RsaSlice";
import { generateSocketHash } from "../../features/chat/SocketHashApi";
import { setSocketHash } from "../../features/chat/SocketHashSlice";

const LoginAccountForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const accountStore: IAccount = useSelector(getAccount);
  const saltTokenStore: ISaltToken = useSelector(getSaltToken);
  const machineIdStore: IMachineId = useSelector(getMachineId);

  const accountStoreRef = useRef(accountStore);
  const saltTokenStoreRef = useRef(saltTokenStore);
  const machineIdStoreRef = useRef(machineIdStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);
  useEffect(() => {
    saltTokenStoreRef.current = saltTokenStore;
  }, [saltTokenStore]);
  useEffect(() => {
    machineIdStoreRef.current = machineIdStore;
  }, [machineIdStore]);

  const isGuest: boolean = useMemo(() => {
    if (accountStore?.nickName === "Guest" && accountStore?.password === getKeccak256Hash("")) return true;
    return false;
  }, [accountStore]);

  const handleGuestLogin = useCallback(async () => {
    try {
      const decryptedMnemonic: string = await decrypt(accountStore?.mnemonic, "");
      dispatch(setMnemonic(decryptedMnemonic));
      dispatch(getRsaKeyPairAsync(decryptedMnemonic));

      const body1 = getReqBodyNonCustodyBeforeSignIn(accountStore, decryptedMnemonic);
      const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);

      const salt: string = res1?.data?.salt;
      const token: string = getNonCustodySignInToken(salt, saltTokenStore, decryptedMnemonic);
      dispatch(
        setSaltToken({
          salt: salt,
          token: token,
        })
      );

      const body2 = getReqBodyNonCustodySignIn(accountStore, machineIdStore, token);
      const res2 = await AuthAPI.nonCustodySignin(body2);

      const uid = res2?.data?._id;
      await dispatch(fetchMyInfoAsync(uid));

      dispatch(setLogin(true));
      navigate("/home");
    } catch (err) {
      console.log("Failed at handleGuestLogin: ", err);
    }
  }, [accountStore, saltTokenStore, machineIdStore]);

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .test("equals", t("cca-60_wrong-password"), (value) => {
          return getKeccak256Hash(value) === accountStoreRef?.current?.password;
        })
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
        const decryptedMnemonic: string = await decrypt(accountStoreRef?.current?.mnemonic, formik.values.password);

        const body1 = getReqBodyNonCustodyBeforeSignIn(accountStoreRef?.current, decryptedMnemonic);
        const res1 = await AuthAPI.nonCustodyBeforeSignin(body1);

        const salt: string = res1?.data?.salt;
        const token: string = getNonCustodySignInToken(salt, saltTokenStoreRef?.current, decryptedMnemonic);
        dispatch(
          setSaltToken({
            salt: salt,
            token: token,
          })
        );

        const body2 = getReqBodyNonCustodySignIn(accountStoreRef?.current, machineIdStoreRef?.current, token);
        const res2 = await AuthAPI.nonCustodySignin(body2);
        const uid = res2?.data?._id;

        await dispatch(fetchMyInfoAsync(uid));

        const newSocketHash = generateSocketHash(decryptedMnemonic);
        dispatch(setSocketHash(newSocketHash));
        dispatch(setMnemonic(decryptedMnemonic));
        dispatch(getRsaKeyPairAsync(decryptedMnemonic));

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
          {!isGuest && (
            <>
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
              <AccountNextButton isSubmit={true} text={"Next"} disabled={formik.touched.password && formik.errors.password ? true : false} />
            </>
          )}
          {isGuest && <AccountNextButton text={"Next"} onClick={handleGuestLogin} />}
        </Stack>
      </form>
    </>
  );
};

export default LoginAccountForm;
