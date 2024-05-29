import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket_backend_url } from "../configs";
import { io, Socket } from "socket.io-client";
import { accountType } from "../types/accountTypes";
import { getAccount } from "../features/account/AccountSlice";
import { ISocketHash } from "../types/chatTypes";
import { getSocketHash } from "../features/chat/SocketHashSlice";
import { Outlet } from "react-router-dom";

const socket: Socket = io(socket_backend_url as string);

const SocketContext = createContext<{ socket: Socket } | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = () => {
  const accountStore: accountType = useSelector(getAccount);
  const socketHashStore: ISocketHash = useSelector(getSocketHash);
  const accountStoreRef = useRef(accountStore);
  const socketHashStoreRef = useRef(socketHashStore);

  useEffect(() => {
    accountStoreRef.current = accountStore;
  }, [accountStore]);

  useEffect(() => {
    socketHashStoreRef.current = socketHashStore;
  }, [socketHashStore]);

  useEffect(() => {
    socket.auth = {
      userId: accountStoreRef.current.uid,
      socket_hash: socketHashStoreRef.current.socketHash,
    };
  }, [accountStoreRef.current, socketHashStoreRef.current]);

  // const socket: Socket = io(socket_backend_url as string, {
  //   auth: { userId: account.uid, socket_hash: sockethash.socketHash },
  // });

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
