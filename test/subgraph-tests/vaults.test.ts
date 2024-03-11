import { Chain } from '@parifi/references';
import { PRICE_FEED_DECIMALS, ParifiSdk } from '../../src';
import { GelatoConfig, RpcConfig } from '../../src/interfaces/classConfigs';
import { assert } from 'ethers';
import Decimal from 'decimal.js';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const gelatoConfig: GelatoConfig = {
  apiKey: process.env.GELO_API_KEY || '',
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {}, gelatoConfig);

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();

    const vaults = await parifiSdk.subgraph.getAllVaults();
    console.log('vaults', vaults);

    expect(vaults.length).not.toBe(0);
  });
});

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getTotalPoolValue();
    console.log(data);

    expect(data.totalLiquidity).not.toBe(0);
  });
});
