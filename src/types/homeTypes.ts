import { IGame } from "./GameTypes";

export interface PaginationType {
  index: number;
  page: string;
}

export interface TymtlogoType {
  isDrawerExpanded: boolean;
}

export interface propsmodeType {
  status: number;
  setStatus: (status: number) => void;
}

export interface librarymodeType {
  mode: number;
}

export interface IDownloadStatus {
  progress: number;
  speed: number;
  total: number;
  isDownloading: boolean;
  game: IGame;
}

export interface IInstallStatus {
  progress: number;
  isInstalling: boolean;
  name: string;
}

export interface IRemoveStatus {
  game: IGame;
}

export interface IPoint {
  x: number;
  y: number;
}
