import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { socket_backend_url } from "../configs";
import { io, Socket } from "socket.io-client";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { ISocketHash } from "../types/chatTypes";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { Outlet } from "react-router-dom";

// const socket: Socket = io(socket_backend_url as string);

const SocketContext = createContext<{ socket: Socket } | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = () => {
  // const [socket, setSocket] = useState<Socket>(null);
  const accountStore: accountType = useSelector(getAccount);
  const socketHashStore: ISocketHash = useSelector(getSocketHash);

  // useEffect(() => {
  //   socket.auth = {
  //     userId: accountStore.uid,
  //     socket_hash: socketHashStore.socketHash,
  //   };
  // }, [accountStore.uid, socketHashStore.socketHash]);

  const socket: Socket = io(socket_backend_url as string, {
    auth: { userId: accountStore.uid, socket_hash: socketHashStore.socketHash },
  });

  // useEffect(() => {
  //   const newSocket: Socket = io(socket_backend_url as string, {
  //     auth: {
  //       userId: accountStore.uid,
  //       socket_hash: socketHashStore.socketHash,
  //     },
  //   });
  //   setSocket(newSocke

  //   return () => {
  //     newSocket.close();
  //   };
  // }, [accountStore.uid, socketHashStore.socketHash]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      <Outlet />
    </SocketContext.Provider>
  );
};
