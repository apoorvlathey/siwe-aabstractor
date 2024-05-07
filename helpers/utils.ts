import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize } from "viem/ens";

// i.e. 0-255 -> '00'-'ff'
const dec2hex = (dec: number): string => dec.toString(16).padStart(2, "0");

export const slicedText = (txt: string) => {
  return txt.length > 6
    ? `${txt.slice(0, 4)}...${txt.slice(txt.length - 2, txt.length)}`
    : txt;
};

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.NEXT_PUBLIC_MAINNET_RPC_URL),
});

export const getEnsAddress = async (name: string) => {
  return await publicClient.getEnsAddress({
    name: normalize(name),
  });
};
