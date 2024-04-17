import { Chain } from '@parifi/references';
import { ParifiSdk, PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../src';

export const getParifiSdkInstanceForTesting = async (): Promise<ParifiSdk> => {
  const chain = Chain.ARBITRUM_MAINNET;
  const rpcConfig: RpcConfig = {
    chainId: chain,
    rpcEndpointUrl: process.env.RPC_ARBITRUM
  };

  const subgraphConfig: SubgraphConfig = {
    subgraphEndpoint: process.env.SUBGRAPH_ENDPOINT,
  };

  const pythConfig: PythConfig = {
    pythEndpoint: process.env.PYTH_SERVICE_ENDPOINT,
    username: process.env.PYTH_SERVICE_USERNAME,
    password: process.env.PYTH_SERVICE_PASSWORD,
    isStable: true,
  };

  const gelatoConfig: RelayerI = {
    apiKey: process.env.GELATO_KEY || '',
  };

  const pimlicoConfig: RelayerI = {
    apiKey: process.env.PIMLICO_API_KEY,
  };

  const relayerConfig: RelayerConfig = {
    gelatoConfig: gelatoConfig,
    pimlicoConfig: pimlicoConfig,
  };

  const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);
  await parifiSdk.init();
  return parifiSdk;
};
