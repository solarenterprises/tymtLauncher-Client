import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { socket_backend_url } from "../configs";
import { io, Socket } from "socket.io-client";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { ISocketHash } from "../types/chatTypes";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { Outlet } from "react-router-dom";

const SocketContext = createContext<{ socket: Socket } | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = () => {
  const account: accountType = useSelector(getAccount);
  const sockethash: ISocketHash = useSelector(getSocketHash);
  const socket: Socket = io(socket_backend_url as string, {
    auth: { userId: account.uid, socket_hash: sockethash.socketHash },
  });

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
