import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig, SubgraphConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_MAINNET,
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
    console.log('unrealizedPNL', unrealizedPNL);
  });

  it('should return Portfolio total for user addresses', async () => {
    await parifiSdk.init();

    // Use addresses with a non-zero positions/deposits
    const userAddresses = [
      '0xb0881c72cc2aea56cfcaa2e1197b6d87b8f6b11b',
      '0x58d24685a6982CbEE9d43f3e915B4A6EA12bB3c6',
      '0xe4fDB1Fa65b29533D6d3D9Aa74e07E6e87405B32',
    ];

    const { portfolioData } = await parifiSdk.subgraph.getPortfolioDataForUsers(userAddresses);
    console.log('portfolioData', portfolioData);
  });
});
