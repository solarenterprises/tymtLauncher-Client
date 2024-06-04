import velorenThumbnail from "../game/veloren/thumbnail.png";
import velorenLogo from "../game/veloren/logo.png";
import velorenDownload from "../game/veloren/download.png";
import velorenCard from "../game/veloren/card.png";
import veloren1 from "../game/veloren/1.jpg";
import veloren2 from "../game/veloren/2.jpg";
import veloren3 from "../game/veloren/3.jpg";
import veloren4 from "../game/veloren/4.jpg";
import veloren5 from "../game/veloren/5.jpg";

import d53Thumbnail from "../game/district 53/thumbnail.png";
import d53Logo from "../game/district 53/logo.png";
import d53Download from "../game/district 53/download.png";
import d53Card from "../game/district 53/card.png";
import d531 from "../game/district 53/1.png";
import d532 from "../game/district 53/2.png";
import d533 from "../game/district 53/3.png";
import d534 from "../game/district 53/4.png";
import d535 from "../game/district 53/5.png";
import d536 from "../game/district 53/6.png";
import d537 from "../game/district 53/7.png";
import d538 from "../game/district 53/8.png";

import redeclipseThumbnail from "../game/redeclipse/thumbnail.png";
import redeclipseLogo from "../game/redeclipse/logo.png";
import redeclipseDownload from "../game/redeclipse/download.png";
import redeclipseCard from "../game/redeclipse/card.png";
import redeclipse1 from "../game/redeclipse/1.png";
import redeclipse2 from "../game/redeclipse/2.png";
import redeclipse3 from "../game/redeclipse/3.png";
import redeclipse4 from "../game/redeclipse/4.png";
import redeclipse5 from "../game/redeclipse/5.png";

export type PlatformFile =
  | {
      url: string;
      type: "zip" | "exec" | "appimage" | "tar.bz2";
      file?: string;
      exePath: string;
    }
  | undefined;

export type PlatformFileForOS = {
  prod: PlatformFile;
  dev?: PlatformFile;
};

export type Sentence = { [key: string]: string };

export type Game = {
  name: string;
  url: string;
  links: {
    website: string;
    share: string;
    twitter: string;
    facebook: string;
    discord: string;
  };
  thumbnail: string;
  logo: string;
  downloadImg: string;
  card: string;
  images: string[];
  tabs: string[];
  introduction: Sentence;
  heroes: Sentence;
  executables: {
    windows64: PlatformFileForOS;
    macos: PlatformFileForOS;
    linux: PlatformFileForOS;
  };
  warning: Sentence;
  warningLink: string;
  release: string;
  developers: string;
  publisher: string;
  video: string;
};
export type GamesType = { [key: string]: Game };

const Games: { [key: string]: Game } = {
  district53: {
    name: "District 53",
    url: "http://d.com/",
    links: {
      website: "https://district53.io/",
      share: "",
      twitter: "https://x.com/D53_Metaverse/",
      facebook: "https://www.facebook.com/District53Metaverse/",
      discord: "https://discord.district53.io/",
    },
    thumbnail: d53Thumbnail,
    logo: d53Logo,
    downloadImg: d53Download,
    card: d53Card,
    images: [d531, d532, d533, d534, d535, d536, d537, d538],
    tabs: ["Action", "Shooter", "RPG"],
    introduction: {
      en: `Unleash your creativity in a world where every action counts! <br><br>District 53 Metaverse is a voxel-based online world, where blockchain meets mining, crafting, and building. With integration into the Solar Blockchain, every move you make earns you SXP, turning your adventures into tangible rewards. Survival, Creative and PvP modes available!`,
      jp: "すべての行動が重要となる世界で、あなたの創造性を解き放ちましょう! <br><br>District 53 Metaverse は、ブロックチェーンが採掘、クラフト、建築と融合するボクセルベースのオンライン世界です。 Solar Blockchain に統合すると、あらゆる行動で SXP が獲得でき、冒険が目に見える報酬に変わります。 サバイバル、クリエイティブ、PvP モードが利用可能!",
    },
    heroes: {
      en: "1. Voxel-Based Open World: Explore District 53, a sprawling city of voxel-built structures, from towering high-rises to underground clubs, all crafted in captivating 3D pixel art. <br><br>2. Strategic Empire Building: Manage resources such as vox-coins, tech modules, and energy to expand your district. <br><br>3. Strategize your expansion in a world where every block placed can mean the difference between dominance and destruction. <br><br>4. Faction Warfare: Lead your pixelated populace in strategic skirmishes against rival districts. <br><br>5. Utilize unique voxel-based weaponry and units in battles that are easy to grasp but challenging to master. <br><br>6. Customizable Avatars: Design your character from a variety of voxel models. Equip voxel gear and cyber enhancements to specialize in various roles such as Hacker, Enforcer, or Tycoon. <br><br>7. Engaging Story Campaigns: Dive into campaigns filled with voxelized villains and allies. Your choices in interactive storylines will determine the fate of your district and its inhabitants.",
      jp: "1. ボクセルベースのオープンワールド: 高層ビルから地下クラブまで、魅力的な3Dピクセルアートで作られたボクセル建築の広大な都市、District 53を探検しよう。<br><br>2. 戦略的な帝国建設: ボクサーコイン、技術モジュール、エネルギーなどの資源を管理し、地区を拡大しよう。配置されたブロックのひとつひとつが支配と破壊の分かれ目となる世界で、戦略的に拡張を進めよう。<br><br>3. 派閥抗争: ピクセル化された住民を率いて、ライバル地区との戦略的な小競り合いを繰り広げよう。ボクセルベースのユニークな武器やユニットを駆使して、簡単なようで難しいバトルを繰り広げよう。<br><br>4. カスタマイズ可能なアバター: 様々なボクセルモデルからキャラクターをデザイン。ボクセルギアやサイバー強化を装備して、ハッカー、エンフォーサー、タイクーンなど様々な役割に特化しましょう。<br><br>5. 魅力的なストーリーキャンペーン: ボクセル化された悪役や味方でいっぱいのキャンペーンに飛び込もう。インタラクティブなストーリーラインでのあなたの選択が、あなたの地区とその住民の運命を左右します。",
    },
    executables: {
      linux: {
        prod: {
          url: "https://github.com/district53/minetest/releases/download/5.9.0.001/District53-5.9.0.001-x86_64.AppImage",
          type: "appimage",
          exePath: "/tmp.AppImage",
        },
      },
      macos: {
        prod: {
          url: "",
          type: "zip",
          exePath: "",
        },
      },
      windows64: {
        prod: {
          url: "https://github.com/solarenterprises/d53-minetest/releases/download/5.9.0.001/District53_5.9.0.001_win_x86.zip",
          type: "zip",
          file: "minetest",
          exePath: "/bin/District53.exe",
        },
        dev: {
          url: "https://dev.district53.io:2000/District53_5.9.0.2_win_x64.zip",
          type: "zip",
          file: "minetest",
          exePath: "/bin/District53.exe",
        },
      },
    },
    warning: {
      en: "",
      jp: "",
    },
    warningLink: "",
    video: "",
    release: "October 28, 2022",
    developers: "Solar Enterprises / Minetest",
    publisher: "Solar Enterprises",
  },
  veloren: {
    name: "Veloren",
    url: "",
    links: {
      website: "",
      share: "",
      twitter: "",
      facebook: "",
      discord: "",
    },
    thumbnail: velorenThumbnail,
    logo: velorenLogo,
    downloadImg: velorenDownload,
    card: velorenCard,
    images: [veloren1, veloren2, veloren3, veloren4, veloren5],
    tabs: ["Action"],
    introduction: {
      en: "Welcome to Veloren! <br><br>Veloren is an action-adventure role-playing game set in a vast fantasy world.",
      jp: "Velorenへようこそ！ <br><br>Velorenは、壮大なファンタジーの世界を舞台にしたアクション満載のロールプレイングゲームです。",
    },
    heroes: {
      en: "1. Explore enormous mountains, arid deserts, dense jungles, and many more environments. <br><br>2. Discover many different weapons and play styles with dynamic and fast-paced combat. <br><br>3. Interact with NPCs and craft equipment in towns to help you on your way. <br><br>4. Encounter menacing bosses and fearsome monsters in dungeons and hideouts. <br><br>5. Experience a complex and interconnected procedural world, fully simulated as you play. <br><br>6. Delve deep beneath the earth to mine ore and gems in sprawling cave networks. <br><br>7. Tame wild beasts as companions and mounts to aid you in your journey. <br><br>8. Adventure with friends on multiplayer servers, or host your own over LAN. Discover the source code and contribute to the project yourself.",
      jp: "広大な山脈、乾燥した砂漠、深いジャングルなど、多様な環境を探検してみましょう。ダイナミックでリズミカルな戦闘を通じて、様々な武器やプレイスタイルを見つけ出してください。街では、NPCとの交流や装備の製作を通して、あなたの冒険がより豊かなものになります。ダンジョンやアジトでは、強力なボスや恐ろしいモンスターが待ち構えています。複雑に組み合わさったプロシージャル・ワールドを体験してみてください。地下深くに潜り、鉱石や宝石の採掘、広大な洞窟ネットワークの探索を楽しみましょう。野生の生き物を仲間や乗り物として手なずけ、旅を楽しくしましょう。マルチプレイヤーサーバーで友人と共に冒険したり、自分のLANサーバをホストすることも可能です。ソースコードを探求し、このプロジェクトへの貢献を考えてみてください。",
    },
    executables: {
      linux: {
        prod: {
          url: "https://download.veloren.net/latest/linux/x86_64/nightly",
          type: "zip",
          exePath: "/veloren-voxygen",
        },
      },
      macos: {
        prod: {
          url: "https://download.veloren.net/latest/macos/x86_64/nightly",
          type: "zip",
          exePath: "/veloren-voxygen",
        },
      },
      windows64: {
        prod: {
          url: "https://download.veloren.net/latest/windows/x86_64/nightly",
          type: "zip",
          file: "minetest",
          exePath: "/veloren-voxygen.exe",
        },
      },
    },
    warning: {
      en: "Veloren is in development and it's not related to Solar or tymt. If you need any more information, please check out here.",
      jp: "Velorenは開発中であり、Solarやtymtとは関係ありません。さらに詳しい情報が必要な場合は、こちらをご覧ください。",
    },
    warningLink: "https://discord.com/invite/veloren-community-449602562165833758",
    release: "July 1, 2023",
    developers: "Kristoffer Anderson",
    publisher: "veloren.net",
    video: "https://veloren.net/videos/veloren.webm",
  },
  redeclipse: {
    name: "Red Eclipse",
    url: "",
    links: {
      website: "",
      share: "",
      twitter: "",
      facebook: "",
      discord: "",
    },
    thumbnail: redeclipseThumbnail,
    logo: redeclipseLogo,
    downloadImg: redeclipseDownload,
    card: redeclipseCard,
    images: [redeclipse1, redeclipse2, redeclipse3, redeclipse4, redeclipse5],
    tabs: ["Action"],
    introduction: {
      en: "Red Eclipse is a fun-filled new take on the first person arena shooter, featuring parkour, impulse boosts, and more. The development is geared toward balanced gameplay, with a general theme of agility in a variety of environments.",
      jp: "Red Eclipse は、パルクール、インパルス ブーストなどを特徴とする、一人称視点のアリーナ シューティング ゲームの楽しさいっぱいの新しいゲームです。 開発はバランスの取れたゲームプレイを目指しており、さまざまな環境での機敏性を一般的なテーマとしています。",
    },
    heroes: {
      en: "Fun for everyone, young and old, noob or expert. Available for Windows, GNU/Linux, BSD, and macOS. Parkour, impulse boosts, dashing, and other tricks. A huge amount of mutators and game altering variables. Create maps with other players in realtime co-op edit. Over ten years of active development, and still going!",
      jp: "老若男女、初心者から上級者まで、誰でも楽しめます。 Windows、GNU/Linux、BSD、macOS で利用できます。 パルクール、インパルスブースト、ダッシュ、その他のトリック。 膨大な量のミューテーターとゲームを変える変数。 リアルタイム協力編集で他のプレイヤーとマップを作成します。 10 年以上にわたる活発な開発は今も続いています。",
    },
    executables: {
      linux: {
        prod: {
          url: "https://github.com/redeclipse/deploy/releases/download/appimage_continuous_stable/redeclipse-stable-x86_64.AppImage",
          type: "appimage",
          exePath: "/tmp.AppImage",
        },
      },
      macos: {
        prod: {
          url: "https://github.com/redeclipse/base/releases/download/v2.0.0/redeclipse_2.0.0_mac.tar.bz2",
          type: "tar.bz2",
          exePath: "/redeclipse.app",
        },
      },
      windows64: {
        prod: {
          url: "https://github.com/redeclipse/base/releases/download/v2.0.0/redeclipse_2.0.0_win.zip",
          type: "zip",
          exePath: "/redeclipse.bat",
        },
      },
    },
    warning: {
      en: "Red Eclipse is not related to Solar or tymt. If you need any more information, please check out here.",
      jp: "Red EclipseはSolarやtymtとは関係ありません。 さらに詳しい情報が必要な場合は、こちらをご覧ください。",
    },
    warningLink: "https://www.redeclipse.net/discord",
    release: "March 15, 2011",
    developers: "Quinton Reeves, Lee Salzman, et al.",
    publisher: "Quinton Reeves",
    video: "",
  },
};

export default Games;
