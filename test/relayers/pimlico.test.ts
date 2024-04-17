import { getParifiSdkInstanceForTesting } from '..';
import { OrderStatus } from '../../src';
import { TEST_SETTLE_ORDER_ID } from '../common/constants';

describe('Pimlico test cases', () => {
  it.skip('should initialize Pimlico and send a sample tx', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const targetContractAddress = '0x58d24685a6982CbEE9d43f3e915B4A6EA12bB3c6';
    const txData = '0x123456789';
    const { txHash } = await parifiSdk.relayer.pimlico.executeTxUsingPimlico(targetContractAddress, txData);

    console.log(`User operation included: https://arbiscan.io/tx/${txHash}`);
  });

  it('should settle orders using Pimlico', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const orderDetails = await parifiSdk.subgraph.getOrderById(TEST_SETTLE_ORDER_ID);
    if (orderDetails.status == OrderStatus.SETTLED) {
      return;
    }
    const orderIds = [TEST_SETTLE_ORDER_ID];

    const { txHash } = await parifiSdk.relayer.pimlico.batchSettleOrdersUsingPimlico(orderIds);

    console.log(`User operation included: https://arbiscan.io/tx/${txHash}`);
  });
});
