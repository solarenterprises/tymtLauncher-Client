import { Outlet } from "react-router-dom";
// import { decrypt } from "../../lib/api/Encrypt";

const ChatProvider = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default ChatProvider;
