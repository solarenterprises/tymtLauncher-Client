import createKeccakHash from "keccak";

export const generateSocketHash: (_: string) => string = (mnemonic: string) => {
  const res: string = createKeccakHash("keccak256").update(mnemonic.normalize("NFD")).digest("hex");
  return res;
};
