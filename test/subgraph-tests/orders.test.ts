import { getParifiSdkInstanceForTesting } from '..';
import { status } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return correct order and user user Address', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const userAddress = '0x2f22928335ed7e472c18e1e487593c0ac40e9ca8';
    const orderData = await parifiSdk.subgraph.getAllOrdersByUserAddress(userAddress, 3, 0);
    expect(orderData.length).not.toBe(0);
  });

  it('should return an order using the order Id', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const orderId = 'CLOSEDORD10209728236255228114-100-0';
    const order = await parifiSdk.subgraph.getOrderById(orderId);
    expect(order.id).toBe(orderId);
    expect(order.status).toBe(status.SETTLED);
  });
});
