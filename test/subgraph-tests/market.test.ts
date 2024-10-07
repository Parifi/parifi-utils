import { getParifiSdkInstanceForTesting } from '..';
import { TEST_MARKET_ID1 } from '../common/constants';

describe('Market fetching logic from subgraph', () => {
  it('should return correct market details', async () => {
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const marketId = TEST_MARKET_ID1;
    const market = await parifiSdk.subgraph.getMarketById(marketId);
    expect(market.id).toBe(marketId);
  });
});
