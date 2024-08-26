import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { getMyInfo } from "../features/account/MyInfoSlice";
import { IMyInfo } from "../types/chatTypes";

export const AuthProvider = () => {
  const navigate = useNavigate();

  const myInfoStore: IMyInfo = useSelector(getMyInfo);

  useEffect(() => {
    if (true) {
      navigate("/welcome");
    }
  }, [myInfoStore]);

  return <Outlet />;
};
