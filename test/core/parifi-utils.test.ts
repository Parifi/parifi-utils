import 'dotenv/config';
import { Chain } from '@parifi/references';
import { PythConfig, RelayerConfig, RelayerI, RpcConfig } from '../../src/interfaces/classConfigs';
import { ParifiSdk } from '../../src';

const chain = Chain.ARBITRUM_SEPOLIA;
const rpcConfig: RpcConfig = {
  chainId: chain,
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

const relayerConfig: RelayerConfig = {
  gelatoConfig: gelatoConfig,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, relayerConfig, pythConfig);

describe('Parifi Utils tests', () => {
  it('should settle orders in batch using Parifi Utils', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    await parifiSdk.init();
    const orderCount = await parifiSdk.core.batchSettlePendingOrdersUsingGelato(process.env.GELATO_KEY ?? '');
    console.log('Orders processed: ', orderCount);
  });

  it('should liquidate positions in batch using Parifi Utils', async () => {
    // To test the batch liquidate functionality, add correct position ids below
    await parifiSdk.init();
    const positionIds = ['0x00841110ab1304773ceb680ae39dcd0a50d3326a50de33aab6792d17a4483b04'];
    const positionsCount = await parifiSdk.core.batchLiquidatePositionsUsingGelato(
      positionIds,
      process.env.GELATO_KEY ?? '',
    );
    console.log('Positions processed: ', positionsCount);
  });
});
