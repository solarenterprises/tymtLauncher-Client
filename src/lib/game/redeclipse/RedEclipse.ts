import redeclipseThumbnail from "./thumbnail.png";
// import redeclipseLogo from "./logo.png";
// import redeclipseDownload from "./download.png";
// import redeclipseCard from "./card.png";
import redeclipse1 from "./1.png";
import redeclipse2 from "./2.png";
import redeclipse3 from "./3.png";
import redeclipse4 from "./4.png";
import redeclipse5 from "./5.png";

import { IGame } from "../../../types/GameTypes";

export const RedEclipse: IGame = {
  _id: "redeclipse",
  addId: "",
  epic_game_url: "",
  imageUrl: redeclipseThumbnail,
  launch_epic: false,
  link: "",
  projectMeta: {
    id: 0,
    name: "redeclipse",
    tags: ["Action"],
    type: "native",
    image: "",
    gallery: [
      {
        src: redeclipse1,
        name: "redeclipse1",
        type: "image", // image, youtube
      },
      {
        src: redeclipse2,
        name: "redeclipse2",
        type: "image", // image, youtube
      },
      {
        src: redeclipse3,
        name: "redeclipse3",
        type: "image", // image, youtube
      },
      {
        src: redeclipse4,
        name: "redeclipse4",
        type: "image", // image, youtube
      },
      {
        src: redeclipse5,
        name: "redeclipse5",
        type: "image", // image, youtube
      },
    ],
    meta_uri: "",
    networks: [],
    repository: "",
    description:
      "Fun for everyone, young and old, noob or expert. Available for Windows, GNU/Linux, BSD, and macOS. Parkour, impulse boosts, dashing, and other tricks. A huge amount of mutators and game altering variables. Create maps with other players in realtime co-op edit. Over ten years of active development, and still going!",
    discord_url: "https://www.redeclipse.net/discord",
    launch_epic: false,
    twitter_url: "",
    youtube_url: "",
    external_url: "https://www.redeclipse.net/",
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
    short_description:
      "Red Eclipse is a fun-filled new take on the first person arena shooter, featuring parkour, impulse boosts, and more. The development is geared toward balanced gameplay, with a general theme of agility in a variety of environments.",
    system_requirements: {
      cpu: "Intel Pentium Dual-Core E2180 / AMD Athlon 64 X2 4200+",
      gpu: "Intel HD 630 / Nvidia GeForce GT 630 / AMD Radeon HD 5750",
      disk: "2 GB available space",
      memory: "2 GB RAM",
    },
    is_hyperplay_exclusive: false,
  },
  project_name: "redeclipse",
  rank: 0,
  releaseMeta: {
    name: "March 15, 2011",
    meta_url: "",
    platforms: {
      windows_amd64: {
        name: "redeclipse_2.0.0_win.zip",
        executable: "redeclipse-2.0.0-win/redeclipse.bat",
        installSize: "",
        downloadSize: "",
        external_url: "https://github.com/redeclipse/base/releases/download/v2.0.0/redeclipse_2.0.0_win.zip",
      },
    },
    project_id: "",
    release_id: "",
    description: "",
    external_url: "",
    release_name: "",
  },
  title: "Red Eclipse",
  visibilityState: "active", // active
  externalStoreId: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
};
