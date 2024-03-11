import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import { GelatoConfig, RpcConfig } from '../../src/interfaces/classConfigs';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const gelatoConfig: GelatoConfig = {
  apiKey: process.env.GELO_API_KEY || '',
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {}, gelatoConfig);

describe('Order fetching logic from subgraph', () => {
  it('should return correct order details', async () => {
    await parifiSdk.init();
    const orderId = '0xb160ae39e7a45b21fb8f247fb11f551f996ed90d3eb9a6263e49b98827e1fc4b';

    const order = await parifiSdk.subgraph.getOrderById(orderId);

    console.log(order);
    if (order) {
      expect(order.id).toBe(orderId);
    } else {
      fail;
    }
  });
});
