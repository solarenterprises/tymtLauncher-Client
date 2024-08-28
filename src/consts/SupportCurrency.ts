import { ISupportCurrency } from "../types/walletTypes";
import USDicon from "../assets/settings/USD.svg";
import EURicon from "../assets/settings/EUR.svg";
import JPYicon from "../assets/settings/JPY.png";
import GBPicon from "../assets/settings/GBP.png";
import CNYicon from "../assets/settings/CNY.png";
import AMDicon from "../assets/settings/AMD.png";
import RUBicon from "../assets/settings/RUB.png";
import PLNicon from "../assets/settings/PLN.png";

export const currencyReserves: { [key: string]: number } = {
  USD: 1.0,
  EUR: 1.0,
  JPY: 1.0,
  GBP: 1.0,
  CNY: 1.0,
  AMD: 1.0,
  RUB: 1.0,
  PLN: 1.0,
};

export const currencySymbols: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  CNY: "元",
  AMD: "֏",
  RUB: "₽",
  PLN: "zł",
};

export const currencyFlags: { [key: string]: string } = {
  USD: USDicon,
  EUR: EURicon,
  JPY: JPYicon,
  GBP: GBPicon,
  CNY: CNYicon,
  AMD: AMDicon,
  RUB: RUBicon,
  PLN: PLNicon,
};

export const supportCurrency: ISupportCurrency[] = [
  {
    name: "USD",
    icon: USDicon,
    symbol: "$",
  },
  {
    name: "EUR",
    icon: EURicon,
    symbol: "€",
  },
  {
    name: "JPY",
    icon: JPYicon,
    symbol: "¥",
  },
  {
    name: "GBP",
    icon: GBPicon,
    symbol: "£",
  },
  {
    name: "CNY",
    icon: CNYicon,
    symbol: "元",
  },
  {
    name: "AMD",
    icon: AMDicon,
    symbol: "֏",
  },
  {
    name: "RUB",
    icon: RUBicon,
    symbol: "₽",
  },
  {
    name: "PLN",
    icon: PLNicon,
    symbol: "zł",
  },
];
