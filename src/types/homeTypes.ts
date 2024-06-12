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
  isDownloading: boolean;
  name: string;
}

export interface IInstallStatus {
  progress: number;
  isInstalling: boolean;
  name: string;
}
