import { Chain } from '@parifi/references';

export const publicSubgraphEndpoints: { [key in Chain]: string } = {
  [Chain.ARBITRUM_SEPOLIA]: 'https://api.thegraph.com/subgraphs/name/parifi/parifi-sepolia',
  [Chain.ARBITRUM_MAINNET]:
    'https://api.studio.thegraph.com/query/68480/parifi-arbitrum/version/latest',
};

export const getPublicSubgraphEndpoint = (chainId: Chain) => {
  return publicSubgraphEndpoints[chainId];
};
