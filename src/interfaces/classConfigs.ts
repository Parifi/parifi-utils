import { Chain } from '@parifi/references';

export interface RpcConfig {
  chainId: Chain;
  rpcEndpointUrl?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface SubgraphConfig {
  subgraphEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface GelatoConfig {
  apiKey: string;
}

export interface RelayerConfig {
  relayerEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export interface PythConfig {
  pythEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  isStable?: boolean;
}
