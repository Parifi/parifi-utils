import { ethers } from 'ethers';
import { getParifiSdkInstanceForTesting } from '..';
import { TEST_MARKET_ID1, TEST_POSITION_ID1, TEST_SETTLE_ORDER_ID } from '../common/constants';
import { DECIMAL_ZERO, getNormalizedPriceByIdFromPriceIdArray } from '../../src';

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

  it('should return valid liquidation price', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const position = await parifiSdk.subgraph.getPositionById(
      '0x9a1b314246e76d5f912020961f95d44077df4be8450d25e2c7dddd98582b5b66',
    );
    const market = await parifiSdk.subgraph.getMarketById(position.market?.id ?? TEST_MARKET_ID1);

    const normalizedPrice = await parifiSdk.pyth.getLatestPricesNormalized([
      market.depositToken?.pyth?.id ?? '0x',
      market.pyth?.id ?? '0x',
    ]);

    const normalizedCollateralPrice = normalizedPrice.find(
      (p) => p.priceId === market.depositToken?.pyth?.id,
    )?.normalizedPrice;

    const normalizedMarketPrice =
      normalizedPrice.find((p) => p.priceId === market.pyth?.id)?.normalizedPrice ?? DECIMAL_ZERO;

    console.log('normalizedCollateralPrice', normalizedCollateralPrice);
    console.log('normalizedMarketPrice', normalizedMarketPrice);

    const liquidationPrice = await parifiSdk.core.getLiquidationPrice(
      position,
      market,
      normalizedMarketPrice ?? DECIMAL_ZERO,
      normalizedCollateralPrice ?? DECIMAL_ZERO,
    );

    console.log('liquidationPrice', liquidationPrice);
    if (position.isLong) {
      expect(liquidationPrice.toNumber()).toBeLessThan(normalizedMarketPrice.toNumber());
    } else {
      expect(liquidationPrice.toNumber()).toBeGreaterThan(normalizedMarketPrice.toNumber());
    }
  });
});
