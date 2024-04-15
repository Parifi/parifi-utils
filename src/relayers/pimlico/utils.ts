import { SmartAccountClient } from 'permissionless';
import { arbitrum } from 'viem/chains';
import { EntryPoint } from 'permissionless/types/entrypoint';
import { Chain, Hex, Transport } from 'viem';
import { SmartAccount } from 'permissionless/accounts';

export const executeTxUsingPimlico = async (
  smartAccountClient: SmartAccountClient<EntryPoint, Transport, Chain, SmartAccount<EntryPoint>>,
  targetContractAddress: string,
  txData: string,
): Promise<{ txHash: string }> => {
  const txHash = await smartAccountClient.sendTransaction({
    to: targetContractAddress as Hex,
    value: 0n,
    data: txData as Hex,
  });

  console.log(`User operation included: https://arbiscan.io/tx/${txHash}`);

  return { txHash };
};

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export const getViemChainById = (chainId: number) => {
  if (chainId === 42161) {
    return arbitrum;
  }
};
