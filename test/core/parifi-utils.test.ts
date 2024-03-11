import 'dotenv/config';
import { Chain } from '@parifi/references';
import { GelatoConfig, PythConfig, RpcConfig } from '../../src/interfaces/classConfigs';
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

const gelatoConfig: GelatoConfig = {
  apiKey: process.env.GELO_API_KEY || '',
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, pythConfig, gelatoConfig);

describe('Parifi Utils tests', () => {
  it('should settle orders in batch using Parifi Utils', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    await parifiSdk.init();
    const orderCount = await parifiSdk.core.batchSettlePendingOrdersUsingGelato(process.env.GELATO_KEY ?? '');
    console.log('Orders processed: ', orderCount);
  });
});
