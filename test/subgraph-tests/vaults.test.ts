import { Chain } from '@parifi/references';
import { PRICE_FEED_DECIMALS, ParifiSdk } from '../../src';
import { assert } from 'ethers';
import Decimal from 'decimal.js';
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

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();

    const vaults = await parifiSdk.subgraph.getAllVaults();
    console.log('vaults', vaults);

    expect(vaults.length).not.toBe(0);
  });

  it('should return correct Total Pool Value', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getTotalPoolsValue();
    console.log(data);

    expect(data.totalPoolValue).not.toBe(0);
  });

  it('should return correct user vault data', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getUserVaultDataByChain('0x30f06f86F107f9523f5b91A8E8AEB602b7b260BD');
    console.log(data);

    expect(data.length).not.toBe(0);
  });

  it('should return correct user total pools vaule', async () => {
    await parifiSdk.init();
    const data = await parifiSdk.subgraph.getUserTotalPoolsValue('0x30f06f86F107f9523f5b91A8E8AEB602b7b260BD');
    console.log(data);

    expect(data.myTotalPoolValue).not.toBe(0);
  });

  it('should return correct APR details', async () => {
    await parifiSdk.init();
    const vaultId = '0x13a78809528b02ad5e7c42f39232d332761dfb1d';
    const data = await parifiSdk.subgraph.getVaultApr(vaultId);
    console.log(data);
  });
});
