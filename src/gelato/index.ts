import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
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
