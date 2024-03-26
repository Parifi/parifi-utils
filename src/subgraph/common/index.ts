import { Chain } from '@parifi/references';

export const publicSubgraphEndpoints: { [key in Chain]: string } = {
  [Chain.ARBITRUM_SEPOLIA]: 'https://api.thegraph.com/subgraphs/name/parifi/parifi-sepolia',
  [Chain.ARBITRUM_MAINNET]: 'https://subgraph.satsuma-prod.com/ac10c1d41dcb/parifis-team--3804602/parifi-arbitrum/api',
};

export const getPublicSubgraphEndpoint = (chainId: Chain) => {
  return publicSubgraphEndpoints[chainId];
};
