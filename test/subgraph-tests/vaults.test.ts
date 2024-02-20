import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { RpcConfig } from '../../src/interfaces/classConfigs';
import { assert } from 'ethers';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {});

describe('Vault fetching logic from subgraph', () => {
  it('should return correct vault details', async () => {
    await parifiSdk.init();

    const vaults = await parifiSdk.subgraph.getAllVaults();
    console.log('vaults', vaults);

    expect(vaults.length).not.toBe(0);
  });
});
