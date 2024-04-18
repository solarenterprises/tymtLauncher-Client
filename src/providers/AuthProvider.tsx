import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { accountType } from "../types/accountTypes";
import { useSelector } from "react-redux";
import { getAccount } from "../features/account/AccountSlice";

export const AuthProvider = () => {
  const navigate = useNavigate();
  const accountStore: accountType = useSelector(getAccount);

  useEffect(() => {
    if (!accountStore.isLoggedIn) {
      navigate("/start");
    }
  }, [accountStore]);

  return <Outlet />;
};
