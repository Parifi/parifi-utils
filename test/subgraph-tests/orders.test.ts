import { getParifiSdkInstanceForTesting } from '..';
import { OrderStatus } from '../../src';
import { TEST_ORDER_ID1, TEST_SETTLE_ORDER_ID } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return correct order details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const order = await parifiSdk.subgraph.getOrderById(TEST_ORDER_ID1);
    expect(order.id).toBe(TEST_ORDER_ID1);
  });

  it('should settle order using Gelato', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const orderId = TEST_SETTLE_ORDER_ID;

    const order = await parifiSdk.subgraph.getOrderById(orderId);
    expect(order.id).toBe(orderId);

    if (order.status == OrderStatus.PENDING) {
      const { gelatoTaskId: taskId } = await parifiSdk.core.settleOrderUsingGelato(orderId);
      console.log('taskId', taskId);
    }
  });

  it('should return referral data for partner address', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const partnerAddress = '0x30f06f86f107f9523f5b91a8e8aeb602b7b260bd';

    const referralData = await parifiSdk.subgraph.getReferralDataForPartner(partnerAddress);
    console.log('referralData', referralData);
  });
});
