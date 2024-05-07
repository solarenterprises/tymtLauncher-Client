import { Outlet } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { invoke } from "@tauri-apps/api/tauri";

const TransactionProvider = () => {
  const { socket } = useSocket();

  socket.on("message-posted", async () => {
    await invoke("show_transaction_window");
  });

  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
