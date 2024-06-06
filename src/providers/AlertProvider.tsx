import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AppDispatch } from "../store";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { fetchAlertListAsync } from "../features/alert/AlertListSlice";
import { fetchContactListAsync } from "../features/chat/ContactListSlice";
import { fetchFriendListAsync } from "../features/chat/FriendListSlice";

const AlertProvider = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accountStore: accountType = useSelector(getAccount);

  useEffect(() => {
    if (accountStore.isLoggedIn) {
      dispatch(fetchAlertListAsync(accountStore.uid));
      dispatch(fetchContactListAsync());
      dispatch(fetchFriendListAsync());
    }
  }, [accountStore]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AlertProvider;
