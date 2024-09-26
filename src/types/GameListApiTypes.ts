import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export interface IParamfetchAllGameList {
  socket: MutableRefObject<Socket>;
  userId: string;
}

export interface IStoreSecret {
  storeId: string;
  secret: string;
}
