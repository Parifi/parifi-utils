import { ethers } from 'ethers';
import { getParifiSdkInstanceForTesting } from '..';
import { TEST_SETTLE_ORDER_ID } from '../common/constants';

describe('Order Manager tests', () => {
  it('should liquidate a single position', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    let positionId: string;
    const positionsToLiquidate = await parifiSdk.subgraph.getPositionsToLiquidate();
    console.log('positionsToLiquidate', positionsToLiquidate);

    // Get the first position id to liquidate
    if (positionsToLiquidate.length > 0) {
      positionId = positionsToLiquidate[0];

      const { gelatoTaskId } = await parifiSdk.core.liquidatePositionUsingGelato(positionId);
      console.log('taskId', gelatoTaskId);

      const taskStatus = await parifiSdk.relayer.gelato.checkGelatoTaskStatus(gelatoTaskId);
      console.log('taskStatus', taskStatus);
    }
  });

  it('should settle single order using wallet', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const orderIds = [TEST_SETTLE_ORDER_ID];

    const priceIds = await parifiSdk.subgraph.getPythPriceIdsForOrderIds(orderIds);

    const collateralPriceIds = parifiSdk.pyth.getPriceIdsForCollaterals();

    const priceUpdateData = await parifiSdk.pyth.getVaaPriceUpdateData(priceIds.concat(collateralPriceIds));

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ARBITRUM);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? '', provider);
    const tx = await parifiSdk.core.batchSettleOrdersUsingWallet(orderIds, priceUpdateData, wallet);
    console.log(tx);
  });
});
