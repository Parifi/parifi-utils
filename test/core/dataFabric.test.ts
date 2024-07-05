import { ethers } from 'ethers';
import { getParifiSdkInstanceForTesting } from '..';
import { TEST_MARKET_ID1, TEST_OPEN_POSITION, TEST_POSITION_ID1, TEST_SETTLE_ORDER_ID } from '../common/constants';
import { DECIMAL_ZERO, OrderStatus, getNormalizedPriceByIdFromPriceIdArray } from '../../src';
import Decimal from 'decimal.js';

describe('Data Fabric tests', () => {
  it('should return correct values of Skew for a market', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const allMarkets = await parifiSdk.subgraph.getAllMarketsFromSubgraph();

    allMarkets.forEach((market) => {
      const { skewLongs, skewShorts } = parifiSdk.core.getMarketSkewUi(market);
      if (new Decimal(market.totalLongs ?? 0).greaterThan(new Decimal(market.totalShorts ?? 0))) {
        expect(Number(skewLongs)).toBeGreaterThanOrEqual(Number(skewShorts));
      } else {
        expect(Number(skewLongs)).toBeLessThanOrEqual(Number(skewShorts));
      }
    });
  });
});
