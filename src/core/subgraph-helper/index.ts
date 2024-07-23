import { Contract, ethers } from 'ethers';
import { Chain, contracts } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';

import { SUBGRAPH_HELPER_ADDRESS } from '../../common';
import { getPositionsToRefresh } from '../../subgraph';

const subgraphHelperAbi = [
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'bytes32[]', name: 'orderIds', type: 'bytes32[]' }],
    name: 'OrderUpdateRequest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'bytes32[]', name: 'positionIds', type: 'bytes32[]' }],
    name: 'PositionUpdateRequest',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'bytes32[]', name: 'orderIds', type: 'bytes32[]' }],
    name: 'triggerOrderUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32[]', name: 'positionIds', type: 'bytes32[]' }],
    name: 'triggerPositionUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Returns Subgraph Helper contract instance without signer
export const getSubgraphHelperInstance = (chain: Chain): Contract => {
  try {
    // @todo Need to fix the references library to allow chainId as ArbSepolia has some issues
    return new ethers.Contract(contracts[42161].SubgraphHelper.address, subgraphHelperAbi);
  } catch (error) {
    throw error;
  }
};

// Returns tx data to refresh positions on subgraph using the Subgraph Helper contract
export const getPositionRefreshTxData = async (
  chainId: Chain,
  subgraphEndpoint: string,
): Promise<{ txData: string }> => {
  const positionsCount = 25;
  const positionsToRefresh = await getPositionsToRefresh(subgraphEndpoint, positionsCount);
  const subgraphHelper = getSubgraphHelperInstance(chainId);
  const { data: txData } = await subgraphHelper.triggerPositionUpdate.populateTransaction(positionsToRefresh);
  return { txData };
};
