import { Outlet } from "react-router-dom";
import { useSocket } from "./SocketProvider";

const TransactionProvider = () => {
  const { socket } = useSocket();

  socket.on("uiuiui", async () => {});

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
