import { getParifiSdkInstanceForTesting } from '..';
import Decimal from 'decimal.js';

describe('Data Fabric tests', () => {
  it('should return correct values of Skew for a market', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();

    const allMarkets = await parifiSdk.subgraph.getAllMarketsFromSubgraph();

    allMarkets.forEach((market) => {
      // It should throw error if market has invalid values
      {
        const updatedMarket = market;
        updatedMarket.totalLongs = undefined;
        updatedMarket.totalShorts = undefined;
        // @todo Check why the thow is not captured by expect
        // expect(parifiSdk.core.getMarketSkew(updatedMarket)).toThrow();
      }
      const { skewLongs, skewShorts } = parifiSdk.core.getMarketSkewUi(market);
      if (new Decimal(market.totalLongs ?? 0).greaterThan(new Decimal(market.totalShorts ?? 0))) {
        expect(skewLongs.toNumber()).toBeGreaterThanOrEqual(skewShorts.toNumber());
      } else {
        expect(skewLongs.toNumber()).toBeLessThanOrEqual(skewShorts.toNumber());
      }
    });
  });
});
