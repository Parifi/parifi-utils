import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { RelayerConfig, RelayerI, RpcConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};
const gelatoConfig: RelayerI = {
  apiKey: process.env.GELO_API_KEY || '',
};

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, relayerConfig, {});

describe('Market fetching logic from subgraph', () => {
  it('should return correct market details', async () => {
    await parifiSdk.init();
    const marketId = '0x122d17f9d86438d3f9d12c1366a56e45c03ae191f705a5d850617739f76605d5';

    const market = await parifiSdk.subgraph.getMarketById(marketId);

    console.log(market);
    expect(market.id).toBe(marketId);
  });
});
