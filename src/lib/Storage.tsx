const tymtStorage = {
  set(key: string, value: any) {
    if (value === undefined) return;
    let stringify = JSON.stringify(value);
    localStorage.setItem(key, stringify);
  },
  get(key: string, defaultValue = "") {
    let stringify = localStorage.getItem(key);
    if (stringify === null || stringify === "undefined") return defaultValue;
    return JSON.parse(stringify) ? JSON.parse(stringify) : "";
  },
  clear() {
    localStorage.clear();
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
};

export const SPOT_ACTIVE_PAIR_KEYS = "spotDashboard";
export const MARGIN_ACITVE_PAIR_KEYS = "marginDashboard";
export const WALLET_ADDRESS = "metamask_address";
export const METAMASK_CONNECTED = "metamask_connected";
export const INITIAL_GUNBOT_SETUP_MODE = "initial_gunbot_setup_mode";

export default tymtStorage;
