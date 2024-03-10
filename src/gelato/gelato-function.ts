import { GelatoRelay, SponsoredCallRequest, TransactionStatusResponse } from '@gelatonetwork/relay-sdk';
import { Chain } from '@parifi/references';

export const executeTxUsingGelato = async (
  targetContractAddress: string,
  chainId: Chain,
  gelatoKey: string,
  encodedTxData: string,
): Promise<string> => {
  const request: SponsoredCallRequest = {
    chainId: BigInt(chainId.toString()),
    target: targetContractAddress,
    data: encodedTxData,
  };

  const relay = new GelatoRelay();
  const { taskId } = await relay.sponsoredCall(request, gelatoKey);
  return taskId;
};

export const checkGelatoTaskStatus = async (taskId: string): Promise<TransactionStatusResponse | undefined> => {
  const relay = new GelatoRelay();
  const txStatus = await relay.getTaskStatus(taskId);
  return txStatus;
};
