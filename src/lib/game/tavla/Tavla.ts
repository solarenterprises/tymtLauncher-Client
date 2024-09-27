import { IGame } from "../../../types/GameTypes";

const tavlaThumbnail = "https://tavla.xyz/images/bg-1920.jpg";

export const Tavla: IGame = {
  _id: "tavla",
  addId: "",
  epic_game_url: "",
  imageUrl: tavlaThumbnail,
  launch_epic: false,
  link: "",
  projectMeta: {
    id: 0,
    name: "Tavla",
    tags: ["Board Game"],
    type: "browser",
    image: tavlaThumbnail,
    gallery: [
      {
        src: tavlaThumbnail,
        name: "tavla1",
        type: "image", // image, youtube
      },
    ],
    meta_uri: "",
    networks: [],
    repository: "",
    description:
      "Tavla is an online platform for playing backgammon that integrates blockchain technology for enhanced security and user experience. Players can register using a Solar $SXP wallet address, allowing for anonymity while ensuring wallet ownership is verified through a simple signing process. This verification does not require users to enter their wallet keys, safeguarding their funds.\n\nUpon registration, each user receives a unique game wallet for in-game transactions, where match fees are deducted and prizes are credited. Players can send funds to this game wallet from any Solar address, but withdrawals are restricted to the registered wallet, ensuring the security of earnings.\n\nThe gameplay features a dashboard that provides real-time updates on ongoing games, user stats, and wallet balances. Matches can be categorized as Open or Invite Only, with the former allowing any player to join and the latter requiring a specific invite link. Game states are continuously saved, enabling players to leave and resume matches without losing progress.\n\nA match consists of up to 9 games, with the objective of scoring at least 5 points to win. Scoring includes points for game wins, gammons, and backgammons. Players interact by clicking on pieces to make moves based on dice rolls, with an undo option available after the first move.\n\nOverall, Tavla combines the strategic elements of traditional backgammon with the security and transparency of blockchain technology, creating a dynamic and engaging online gaming experience.",
    discord_url: "https://discord.com/channels/925959058052251699/1050372125258694686",
    launch_epic: false,
    twitter_url: "",
    youtube_url: "",
    external_url: "https://tavla.xyz/",
    main_capsule: tavlaThumbnail,
    uses_overlay: false,
    wine_support: {
      mac: false,
      linux: false,
    },
    epic_game_url: "",
    launch_external: "",
    prompt_donation: "",
    donation_address: "",
    short_description: "An online multiplayer backgammon game utilizing Solar Blockchain for transactions.",
    system_requirements: {
      cpu: "any",
      gpu: "any",
      disk: "any",
      memory: "any",
    },
    is_hyperplay_exclusive: false,
  },
  project_name: "Tavla",
  rank: 0,
  releaseMeta: {
    name: "",
    meta_uri: "",
    platforms: {
      web: {
        name: "",
        external_url: "https://tavla.xyz/",
      },
    },
    project_id: "",
    release_id: "",
    description: "",
    external_url: "",
    release_name: "",
  },
  title: "Tavla",
  visibilityState: "active", // active
  externalStoreId: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
};
