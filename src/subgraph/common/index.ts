import { Chain } from '@parifi/references';

export const publicSubgraphEndpoints: { [key in Chain]: string } = {
  [Chain.ARBITRUM_GOERLI]: 'https://api.thegraph.com/subgraphs/name/parifi/parifi-arbitrum',
  [Chain.ARBITRUM_SEPOLIA]: 'https://api.thegraph.com/subgraphs/name/parifi/parifi-sepolia',
  [Chain.ARBITRUM]: '',
  [Chain.POLYGON]: '',
  [Chain.BASE]: '',
};

export const getPublicSubgraphEndpoint = (chainId: Chain) => {
  return publicSubgraphEndpoints[chainId];
};

export * from './subgraphMapper';
export * from './subgraphTypes';
