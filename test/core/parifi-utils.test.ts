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
    // To test the batch liquidate functionality, add correct position ids below
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const positionIds = [TEST_LIQUIDATE_POS_ID];
    const positionsCount = await parifiSdk.core.batchLiquidatePositionsUsingGelato(positionIds);
    console.log('Positions processed: ', positionsCount);
  });

  it('should settle orders in batch using an external wallet', async () => {
    // To test the batch settle functionality, create some orders manually using the interface
    const parifiSdk = await getParifiSdkInstanceForTesting();

    // Get orders that can be settled in the next 30 seconds
    const expiryTimestamp = Math.floor(Date.now() / 1000);
    console.log('expiryTimestamp', expiryTimestamp);
    const ordersCount = 10;

    const pendingOrders = await parifiSdk.subgraph.getAllPendingOrders(expiryTimestamp, ordersCount, 0);
    console.log(pendingOrders);

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
