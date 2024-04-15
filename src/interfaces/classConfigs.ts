import { Chain } from '@parifi/references';

// Interface to configure chain specific details of the sdk
export interface RpcConfig {
  chainId: Chain;
  rpcEndpointUrl?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

// Interface to configure subgraph details
export interface SubgraphConfig {
  subgraphEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

// Interface to configure relayers on the sdk
export interface RelayerConfig {
  gelatoConfig?: RelayerI;
  parifiRealyerConfig?: RelayerI;
  pimlicoConfig?: RelayerI;
}

// Common relayer config to configure relayers 
export interface RelayerI {
  relayerEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  jwtToken?: string;
}

// Pyth price feed config
export interface PythConfig {
  pythEndpoint?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  isStable?: boolean;
}
