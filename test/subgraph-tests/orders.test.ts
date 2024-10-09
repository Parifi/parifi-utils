import { getParifiSdkInstanceForTesting } from '..';
import { TEST_ORDER_ID1 } from '../common/constants';

describe('Order fetching logic from subgraph', () => {
  it('should return correct order details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const orderData = await parifiSdk.subgraph.getAllOrdersByUserAddress(
      '0x0000000000000000000000000000000000000000',
      100,
      0,
    );

    console.log(orderData);
  });

  // it('should settle order using Pimlico', async () => {
  //   const parifiSdk = await getParifiSdkInstanceForTesting();
  //   const orderId = TEST_SETTLE_ORDER_ID;
  //   const order = await parifiSdk.subgraph.getOrderById(orderId);
  //   expect(order.id).toBe(orderId);

  // const canBeSettled = await parifiSdk.core.checkIfOrderCanBeSettledId(orderId);
  // if (order.status == OrderStatus.PENDING && canBeSettled) {
  //   const { txHash } = await parifiSdk.relayer.pimlico.batchSettleOrdersUsingPimlico([orderId]);
  //   console.log('Transaction to settle order submitted', txHash);
  // }
});

//   it('should return correct position id for an order id', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();
//     const orderIds = [TEST_ORDER_ID1, TEST_SETTLE_ORDER_ID, zeroAddress];

//     const response = await parifiSdk.subgraph.getPositionIdsFromOrderIds(orderIds);
//     expect(response.length).toBeGreaterThan(0);

//     // Invalid order id should have position id as Bytes32(0);
//     expect(response.at(2)?.positionId).toBe(EMPTY_BYTES32);
//   });
