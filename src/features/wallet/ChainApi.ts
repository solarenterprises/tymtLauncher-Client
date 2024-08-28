import CoingeckoAPI from "../../lib/api/Coingecko";
import { getAPIAndKey, getQueryParam } from "../../lib/helper";
import ERC20 from "../../lib/wallet/ERC20";
import { IChain } from "../../types/walletTypes";

export const setChain = async (chain: IChain): Promise<IChain | undefined> => {
  return chain;
};

export const getPriceData = async (chain: IChain) => {
  if (chain.currentToken == "" || chain.currentToken == "chain") {
    return {
      price: chain.chain.price.toString(),
      balance: chain.chain.balance.toString(),
      label: chain.chain.symbol,
      logo: chain.chain.logo,
    };
  } else {
    let selectedToken;
    chain.tokens.map((token) => {
      if (token.symbol == chain.currentToken) {
        selectedToken = token;
      }
    });
    const { api_url, api_key } = getAPIAndKey(chain);
    const url = `${api_url}?module=account&action=tokenbalance&contractaddress=0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee&address=${chain.chain.wallet}&page=1&offset=5&sort=asc&apikey=${api_key}`;
    const balance = await ERC20.getERCBalance(url);
    const query = getQueryParam(chain);
    const price = await CoingeckoAPI.getData(query, "simple/price");
    return {
      price: price[query.ids].usd.toString(),
      balance: balance.toString(),
      label: selectedToken.displaySymbol,
      logo: selectedToken.logo,
    };
  }
};
