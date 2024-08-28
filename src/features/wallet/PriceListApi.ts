import PriceAPI from "../../lib/api/PriceAPI";
import { IPrice } from "../../types/walletTypes";

export const fetchPriceList = async () => {
  try {
    console.log("fetchPriceList");

    const data = await PriceAPI.getAllTokenPrices();
    if (!data) return;
    const res: IPrice[] = data.map((one) => {
      return {
        cmc: one?.cmc,
        price: one?.price,
      };
    });
    return res;
  } catch (err) {
    console.log("Failed to fetchPriceList: ", err);
  }
};
