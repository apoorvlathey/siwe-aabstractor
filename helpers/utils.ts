import { SelectedOptionState } from "@/types";
import { Hex, createPublicClient, formatEther, formatUnits, http } from "viem";
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

export const getEnsName = async (address: string) => {
  return await publicClient.getEnsName({
    address: address as Hex,
  });
};

export const getEnsAvatar = async (ensName: string) => {
  return await publicClient.getEnsAvatar({
    name: normalize(ensName),
  });
};

export const startHexWith0x = (hexValue?: string): Hex => {
  return hexValue
    ? hexValue.startsWith("0x")
      ? hexValue === "0x"
        ? "0x"
        : (hexValue as Hex)
      : `0x${hexValue}`
    : "0x";
};

export const ethFormatOptions = [
  "ETH",
  "Wei",
  "10^6",
  "Unix",
  "Minutes",
  "Hours",
  "Days",
];

export function getConversion(
  selectedEthFormatOption: SelectedOptionState,
  value: any
) {
  if (!selectedEthFormatOption?.value) {
    return "";
  }

  switch (selectedEthFormatOption?.value) {
    case "Wei":
      return value;
    case "ETH":
      return formatEther(BigInt(value));
    case "10^6":
      return formatUnits(BigInt(value), 6);
    case "Unix":
      return new Date(value * 1000).toUTCString();
    case "Days":
      return value / 86400;
    case "Hours":
      return value / 3600;
    case "Minutes":
      return value / 60;
    default:
      return "";
  }
}
