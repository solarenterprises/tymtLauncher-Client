export const net_name = import.meta.env.REACT_APP_NETWORK_NAME;

export const secret_key_aes = import.meta.env.REACT_APP_SECRET_KEY_AES;

export const chat_socket_addr = import.meta.env.REACT_APP_SOCKET_ADDR;

export const alchemy_api_key = import.meta.env.REACT_APP_ALCHEMY_KEY;

export const api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_API_URL
    : import.meta.env.REACT_APP_TESTNET_API_URL;

export const btc_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_BTC_URL
    : import.meta.env.REACT_APP_TESTNET_BTC_URL;

export const bsc_api_key = import.meta.env.REACT_APP_BSC_API_KEY;
export const bsc_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_BSC_URL
    : import.meta.env.REACT_APP_TESTNET_BSC_URL;
export const bsc_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://bsc-dataseed.binance.org/"
    : "https://data-seed-prebsc-1-s1.bnbchain.org:8545";

export const eth_api_key = import.meta.env.REACT_APP_ETH_API_KEY;
export const eth_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_ETH_URL
    : import.meta.env.REACT_APP_TESTNET_ETH_URL;
export const eth_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://eth-mainnet.g.alchemy.com/v2/" + alchemy_api_key
    : "https://eth-goerli.g.alchemy.com/v2/" + alchemy_api_key;

export const matic_api_key = import.meta.env.REACT_APP_MATIC_API_KEY;
export const matic_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_MATIC_URL
    : import.meta.env.REACT_APP_TESTNET_MATIC_URL;
export const matic_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://polygon-mainnet.g.alchemy.com/v2/" + alchemy_api_key
    : "https://polygon-mumbai.g.alchemy.com/v2/" + alchemy_api_key;

export const arb_api_key = import.meta.env.REACT_APP_ARB_API_KEY;
export const arb_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_ARB_URL
    : import.meta.env.REACT_APP_TESTNET_ARB_URL;
export const arb_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://arb-mainnet.g.alchemy.com/v2/" + alchemy_api_key
    : "https://arb-sepolia.g.alchemy.com/v2/" + alchemy_api_key;

export const op_api_key = import.meta.env.REACT_APP_OP_API_KEY;
export const op_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_OP_URL
    : import.meta.env.REACT_APP_TESTNET_OP_URL;
export const op_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://opt-mainnet.g.alchemy.com/v2/" + alchemy_api_key
    : "https://opt-goerli.g.alchemy.com/v2/" + alchemy_api_key;

export const avax_api_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_AVAX_URL
    : import.meta.env.REACT_APP_TESTNET_AVAX_URL;
export const avax_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? import.meta.env.REACT_APP_MAINNET_AVAX_PROVIDER
    : import.meta.env.REACT_APP_TESTNET_AVAX_PROVIDER;

export const sol_rpc_url =
  import.meta.env.REACT_APP_NETWORK_NAME === "mainnet"
    ? "https://solana-mainnet.g.alchemy.com/v2/" + alchemy_api_key
    : "" + alchemy_api_key;

export const wif_string = import.meta.env.VITE_APP_WIF;
