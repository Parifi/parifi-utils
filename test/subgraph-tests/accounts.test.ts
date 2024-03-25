import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
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
  apiKey: process.env.GELATO_KEY,
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const parifiSdk = new ParifiSdk(rpcConfig, subgraphConfig, relayerConfig, pythConfig);

describe('Order fetching logic from subgraph', () => {
  it('should return PNL details for a user', async () => {
    await parifiSdk.init();

    // Use an address with a non-zero positions/deposits
    const userAddress = '0xe4fDB1Fa65b29533D6d3D9Aa74e07E6e87405B32';

    const { totalRealizedPnlPositions, totalRealizedPnlVaults } =
      await parifiSdk.subgraph.getRealizedPnlForUser(userAddress);

    console.log('totalRealizedPnlPositions', totalRealizedPnlPositions);
    console.log('totalRealizedPnlVaults', totalRealizedPnlVaults);

    const unrealizedPNL = await parifiSdk.subgraph.getTotalUnrealizedPnlInUsd(userAddress);
    console.log("unrealizedPNL", unrealizedPNL)
  });
});
