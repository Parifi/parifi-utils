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
  it('should return correct order details', async () => {
    await parifiSdk.init();
    const orderId = '0xdede011c078916f11a1c92808d527f06db18da40d61e0eb05dc13a8d4e65447f';

    const order = await parifiSdk.subgraph.getOrderById(orderId);
    expect(order.id).toBe(orderId);
  });

  it('should settle order using Gelato', async () => {
    await parifiSdk.init();
    const orderId = '0x8e96c0d38e6d09593c0e96457d2681b62f208ca4a2c3f86fdbf47a6cff0c3dd1';

    const order = await parifiSdk.subgraph.getOrderById(orderId);
    expect(order.id).toBe(orderId);

    const { gelatoTaskId: taskId } = await parifiSdk.core.settleOrderUsingGelato(orderId);
    console.log('taskId', taskId);
  });

  it('should return referral data for partner address', async () => {
    await parifiSdk.init();
    const partnerAddress = '0x30f06f86f107f9523f5b91a8e8aeb602b7b260bd';

    const referralData = await parifiSdk.subgraph.getReferralDataForPartner(partnerAddress);
    console.log('referralData', referralData);
  });
});
