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
    const data = await parifiSdk.subgraph.getTotalPoolsValue();
    console.log(data);

    expect(data.totalPoolValue).not.toBe(0);
  });
});

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getUserVaultDataByChain('0x30f06f86F107f9523f5b91A8E8AEB602b7b260BD');
    console.log(data);

    expect(data.length).not.toBe(0);
  });
});
describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getMyTotalPoolsValue('0x30f06f86F107f9523f5b91A8E8AEB602b7b260BD');
    console.log(data);

    expect(data.myTotalPoolValue).not.toBe(0);
  });
});
