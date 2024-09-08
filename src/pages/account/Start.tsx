import { useSelector } from "react-redux";
import { IAccountList } from "../../types/accountTypes";
import { getAccountList } from "../../features/account/AccountListSlice";
import Welcome from "./Welcome";
import NonCustodialLogin1 from "./non-custodial/NonCustodialLogin1";

const Start = () => {
  const IAccountListStore: IAccountList = useSelector(getAccountList);

  return <>{IAccountListStore?.list?.length === 0 ? <Welcome /> : <NonCustodialLogin1 />}</>;
};

export default Start;
