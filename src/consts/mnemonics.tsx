import * as bip39 from "bip39";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = array.slice(); // Clone the array to avoid mutating the original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
}

export const getMnemonic = (_length: number) => {
  if (_length === 12) {
    return `${bip39.generateMnemonic()}`;
  } else if (_length === 24) {
    return `${bip39.generateMnemonic()} ${bip39.generateMnemonic()}`;
  }
  return "";
};

export const checkMnemonic = (_mnemonic: string) => {
  if (_mnemonic.split(" ").length == 24) {
    return bip39.validateMnemonic(_mnemonic.split(" ").slice(0, 12).join(" ")) && bip39.validateMnemonic(_mnemonic.split(" ").slice(12, 24).join(" "));
  } else if (_mnemonic.split(" ").length == 12) {
    return bip39.validateMnemonic(_mnemonic);
  }
  return false;
};
