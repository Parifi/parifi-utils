import { Chain } from '@parifi/references';

export const publicSubgraphEndpoints: { [key in Chain]: string } = {
  [Chain.ARBITRUM_SEPOLIA]: 'https://api.thegraph.com/subgraphs/name/parifi/parifi-sepolia',
};

export const getPublicSubgraphEndpoint = (chainId: Chain) => {
  return publicSubgraphEndpoints[chainId];
};