import { Contract, ethers } from 'ethers';
import { Chain } from '@parifi/references';
import { contracts as parifiContracts } from '@parifi/references';

import { SUBGRAPH_HELPER_ADDRESS } from '../../common';

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
    return new ethers.Contract(SUBGRAPH_HELPER_ADDRESS, subgraphHelperAbi);
  } catch (error) {
    throw error;
  }
};
