import { ethers } from 'ethers';
import { getParifiSdkInstanceForTesting } from '..';
import { TEST_LIQUIDATE_POS_ID } from '../common/constants';

describe('Parifi Utils tests', () => {
  it('should settle orders in batch using Parifi Utils', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const orderCount = await parifiSdk.core.batchSettlePendingOrdersUsingGelato();
    console.log('Orders processed: ', orderCount);
  });

  it('should liquidate positions in batch using Parifi Utils', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const positionIds = await parifiSdk.subgraph.getPositionsToLiquidate();
    if (positionIds.length !== 0) {
      const { txHash } = await parifiSdk.relayer.pimlico.batchLiquidatePositionsUsingPimlico(positionIds);
      console.log(`User operation included: https://arbiscan.io/tx/${txHash}`);
    } else {
      console.log('No positions available for liquidation');
    }
  });

  it('should settle orders in batch using an external wallet', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    const parifiSdk = await getParifiSdkInstanceForTesting();

    // Get orders that can be settled in the next 30 seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000);
    console.log('expiryTimestamp', expiryTimestamp);
    const ordersCount = 10;

    const pendingOrders = await parifiSdk.subgraph.getAllPendingOrders(expiryTimestamp, ordersCount, 0);

    // Return if orders are not available for settlement
    if (pendingOrders.length == 0) return;

    const orderIds: string[] = [];
    const priceIds: string[] = [];

    // Populate the price ids array to fetch price update data
    pendingOrders.forEach((order) => {
      if (order.id && order.market?.pyth?.id) {
        orderIds.push(order.id);
        priceIds.push(order.market.pyth.id);
      }
    });
    const collateralPriceIds = parifiSdk.pyth.getPriceIdsForCollaterals();
    const priceUpdateData = await parifiSdk.pyth.getVaaPriceUpdateData(priceIds.concat(collateralPriceIds));

    const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
    await parifiSdk.core.batchSettleOrdersUsingWallet(orderIds, priceUpdateData, wallet);
  });
});
