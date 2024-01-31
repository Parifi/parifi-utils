import { Chain, getOrderById } from '../../src';

const chain = Chain.ARBITRUM_SEPOLIA;

describe.skip('Order fetching logic from subgraph', () => {
  it('should return correct order details', async () => {
    console.log('Test running successfully');
    const orderId = '0xb160ae39e7a45b21fb8f247fb11f551f996ed90d3eb9a6263e49b98827e1fc4b';

    const order = await getOrderById(chain, orderId);

    console.log(order);
    if (order) {
      expect(order.id).toBe(orderId);
    } else {
      fail;
    }
  });
});
