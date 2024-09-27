import velorenThumbnail from "./thumbnail.png";
// import velorenLogo from "./logo.png";
// import velorenDownload from "./download.png";
// import velorenCard from "./card.png";
import veloren1 from "./1.jpg";
import veloren2 from "./2.jpg";
import veloren3 from "./3.jpg";
import veloren4 from "./4.jpg";
import veloren5 from "./5.jpg";

import { IGame } from "../../../types/GameTypes";

export const Veloren: IGame = {
  _id: "veloren",
  addId: "",
  epic_game_url: "",
  imageUrl: velorenThumbnail,
  launch_epic: false,
  link: "",
  projectMeta: {
    id: 0,
    name: "veloren",
    tags: ["Action"],
    type: "native",
    image: velorenThumbnail,
    gallery: [
      {
        src: veloren1,
        name: "veloren1",
        type: "image", // image, youtube
      },
      {
        src: veloren2,
        name: "veloren2",
        type: "image", // image, youtube
      },
      {
        src: veloren3,
        name: "veloren3",
        type: "image", // image, youtube
      },
      {
        src: veloren4,
        name: "veloren4",
        type: "image", // image, youtube
      },
      {
        src: veloren5,
        name: "veloren5",
        type: "image", // image, youtube
      },
    ],
    meta_uri: "",
    networks: [],
    repository: "",
    description:
      "1. Explore enormous mountains, arid deserts, dense jungles, and many more environments.\n\n2. Discover many different weapons and play styles with dynamic and fast-paced combat.\n\n3. Interact with NPCs and craft equipment in towns to help you on your way.\n\n4. Encounter menacing bosses and fearsome monsters in dungeons and hideouts.\n\n5. Experience a complex and interconnected procedural world, fully simulated as you play.\n\n6. Delve deep beneath the earth to mine ore and gems in sprawling cave networks.\n\n7. Tame wild beasts as companions and mounts to aid you in your journey.\n\n8. Adventure with friends on multiplayer servers, or host your own over LAN. Discover the source code and contribute to the project yourself.",
    discord_url: "https://discord.com/invite/veloren-community-449602562165833758",
    launch_epic: false,
    twitter_url: "",
    youtube_url: "",
    external_url: "https://veloren.net/",
    main_capsule: "",
    uses_overlay: false,
    wine_support: {
      mac: false,
      linux: false,
    },
    epic_game_url: "",
    launch_external: "",
    prompt_donation: "",
    donation_address: "",
    short_description: "Welcome to Veloren! Veloren is an action-adventure role-playing game set in a vast fantasy world.",
    system_requirements: {
      cpu: "64-bit CPU",
      gpu: "GPU with support for DirectX 12 or newer, Vulkan or Metal",
      disk: "2 GiB available space",
      memory: "4 GiB RAM",
    },
    is_hyperplay_exclusive: false,
  },
  project_name: "veloren",
  rank: 0,
  releaseMeta: {
    name: "July 1, 2023",
    meta_uri: "",
    platforms: {
      windows_amd64: {
        name: "veloren.zip",
        executable: "veloren-voxygen.exe",
        installSize: "",
        downloadSize: "",
        external_url: "https://download.veloren.net/latest/windows/x86_64/nightly",
      },
      darwin_amd64: {
        name: "veloren.zip",
        executable: "veloren-voxygen",
        installSize: "",
        downloadSize: "",
        external_url: "https://download.veloren.net/latest/macos/x86_64/nightly",
      },
      darwin_arm64: {
        name: "veloren.zip",
        executable: "veloren-voxygen",
        installSize: "",
        downloadSize: "",
        external_url: "https://download.veloren.net/latest/macos/aarch64/nightly",
      },
      linux_amd64: {
        name: "veloren.zip",
        executable: "veloren-voxygen",
        installSize: "",
        downloadSize: "",
        external_url: "https://download.veloren.net/latest/linux/x86_64/nightly",
      },
    },
    project_id: "",
    release_id: "",
    description: "",
    external_url: "",
    release_name: "",
  },
  title: "Veloren",
  visibilityState: "active", // active
  externalStoreId: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
};
