import windows from "../assets/main/windows.png";
import mac from "../assets/main/mac.svg";
import linux from "../assets/main/linux.svg";

export enum platformEnum {
  "windows",
  "mac",
  "linux",
}

export const platformIconMap: Map<number, string> = new Map([
  [platformEnum.windows, windows],
  [platformEnum.mac, mac],
  [platformEnum.linux, linux],
]);

export interface IGame {
  _id: string;
  addId: string;
  epic_game_url: string;
  imageUrl: string;
  launch_epic: boolean;
  link: string;
  projectMeta: {
    id: number;
    name: string;
    tags: string[];
    type: string; // native, browser
    image: string;
    gallery: Array<{
      src: string;
      name: string;
      type: string; // image, youtube
    }>;
    meta_uri: string;
    networks: Array<{
      icon: string;
      name: string;
      type: string; // nonFungible, fungible
      address: string;
      chain_id: string;
      marketplace_urls: string[];
      meta_mask_compatible: boolean;
    }>;
    repository: string;
    description: string;
    discord_url: string;
    launch_epic: boolean;
    twitter_url: string;
    youtube_url: string;
    external_url: string;
    main_capsule: string;
    uses_overlay: boolean;
    wine_support: {
      mac: boolean;
      linux: boolean;
    };
    epic_game_url: string;
    launch_external: string;
    prompt_donation: string;
    donation_address: string;
    short_description: string;
    system_requirements: {
      cpu: string;
      gpu: string;
      disk: string;
      memory: string;
    };
    is_hyperplay_exclusive: boolean;
  };
  project_name: string;
  rank: number;
  releaseMeta: {
    name: string;
    meta_url: string;
    platforms: {
      windows_amd64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      windows_arm64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      darwin_amd64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      darwin_arm64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      linux_amd64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      linux_arm64?: {
        name: string;
        executable: string;
        installSize: string;
        downloadSize: string;
        external_url: string;
      };
      web?: {
        name: string;
        external_url: string;
      };
    };
    project_id: string;
    release_id: string;
    description: string;
    external_url: string;
    release_name: string;
  };
  title: string;
  visibilityState: string; // active
  externalStoreId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IGameList {
  games: IGame[];
}
