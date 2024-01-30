import { subgraphEndpoints } from './constants';
import { Chain } from '../../common/chain';

export const getSubgraphEndpoint = (chainId: Chain) => {
  return subgraphEndpoints[chainId];
};

export * from './constants';
export * from './mapper';
export * from './types';
