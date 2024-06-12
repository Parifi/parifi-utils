import { getParifiSdkInstanceForTesting } from '..';
import { EMPTY_BYTES32, OrderStatus } from '../../src';
import { TEST_ORDER_ID1, TEST_SETTLE_ORDER_ID } from '../common/constants';
import { zeroAddress } from 'viem';

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
    expect(referralData.length).not.toBe(0);
  });

  it('should return correct position id for an order id', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const orderIds = [TEST_ORDER_ID1, TEST_SETTLE_ORDER_ID, zeroAddress];

    const response = await parifiSdk.subgraph.getPositionIdsFromOrderIds(orderIds);
    expect(response.length).toBeGreaterThan(0);

    // Invalid order id should have position id as Bytes32(0);
    expect(response.at(2)?.positionId).toBe(EMPTY_BYTES32)
  });
});
