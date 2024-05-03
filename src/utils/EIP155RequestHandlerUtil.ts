import {
  EIP155_CHAINS,
  EIP155_SIGNING_METHODS,
  TEIP155Chain,
} from "@/src/data/EIP155Data";
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
  getWalletAddressFromParams,
} from "@/src/utils/HelperUtil";
import { formatJsonRpcError, formatJsonRpcResult } from "@json-rpc-tools/utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
import SettingsStore from "@/src/store/SettingsStore";
import { Hex, hashMessage } from "viem";

type RequestEventArgs = Omit<
  SignClientTypes.EventArguments["session_request"],
  "verifyContext"
>;

export async function approveEIP155Request(
  requestEvent: RequestEventArgs,
  signMsg: (msg: string) => Promise<Hex>
) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;

  console.log(requestEvent, chainId, "approveEIP155Request");

  SettingsStore.setActiveChainId(chainId);

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      try {
        const message = getSignParamsMessage(request.params);
        const hashedMessage = hashMessage(message);

        const signedMessage = await signMsg(message);
        console.log({
          PERSONAL_SIGN: "PERSONAL_SIGN",
          hashedMessage,
          signature: signedMessage,
          message,
          params: request.params,
        });

        return formatJsonRpcResult(id, signedMessage);
      } catch (error: any) {
        console.error(error);
        alert(error.message);
        return formatJsonRpcError(id, error.message);
      }

    /** 
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      try {
        const {
          domain,
          types,
          message: data,
          primaryType,
        } = getSignTypedDataParamsData(request.params);

        // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        delete types.EIP712Domain;
        const signedData = await wallet._signTypedData(
          domain,
          types,
          data,
          primaryType
        );
        return formatJsonRpcResult(id, signedData);
      } catch (error: any) {
        console.error(error);
        alert(error.message);
        return formatJsonRpcError(id, error.message);
      }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const provider = new JsonRpcProvider(
          EIP155_CHAINS[chainId as TEIP155Chain].rpc
        );
        const sendTransaction = request.params[0];
        const connectedWallet = await wallet.connect(provider);
        const hash = await connectedWallet.sendTransaction(sendTransaction);
        const receipt = typeof hash === "string" ? hash : hash?.hash; // TODO improve interface
        return formatJsonRpcResult(id, receipt);
      } catch (error: any) {
        console.error(error);
        alert(error.message);
        return formatJsonRpcError(id, error.message);
      }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      try {
        const signTransaction = request.params[0];
        const signature = await wallet.signTransaction(signTransaction);
        return formatJsonRpcResult(id, signature);
      } catch (error: any) {
        console.error(error);
        alert(error.message);
        return formatJsonRpcError(id, error.message);
      }

    */
    default:
      throw new Error(getSdkError("INVALID_METHOD").message);
  }
}

export function rejectEIP155Request(request: RequestEventArgs) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError("USER_REJECTED").message);
}
