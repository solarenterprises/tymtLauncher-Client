import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { getLogin } from "../features/account/LoginSlice";
import { getMyInfo } from "../features/account/MyInfoSlice";

import { IMyInfo } from "../types/chatTypes";
import { ILogin } from "../types/accountTypes";

export const AuthProvider = () => {
  const navigate = useNavigate();

  const myInfoStore: IMyInfo = useSelector(getMyInfo);
  const loginStore: ILogin = useSelector(getLogin);

  useEffect(() => {
    if (false) {
      navigate("/start");
    }
  }, [loginStore, myInfoStore]);

  return <Outlet />;
};
