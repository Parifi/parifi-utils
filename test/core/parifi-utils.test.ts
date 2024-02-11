import 'dotenv/config';
import { Chain } from '@parifi/references';
import { getPythClient } from '../../src/pyth';
import { batchSettlePendingOrdersUsingGelato } from '../../src/core/order-manager/settlement';

const chainId = Chain.ARBITRUM_SEPOLIA;

describe('Parifi Utils tests', () => {
  it('should settle orders in batch using Parifi Utils', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    const pythClient = await getPythClient();

    if (pythClient) {
      const orderCount = await batchSettlePendingOrdersUsingGelato(chainId, process.env.GELATO_KEY ?? '', pythClient);
      console.log('Orders processed: ', orderCount);
    }
  });
});
