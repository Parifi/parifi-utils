import { Chain, getMarketById, getOrderById } from '../../src';

const chain = Chain.ARBITRUM_SEPOLIA;

describe('Market fetching logic from subgraph', () => {
  it('should return correct market details', async () => {
    console.log('Test running successfully');
    const marketId = '0x122d17f9d86438d3f9d12c1366a56e45c03ae191f705a5d850617739f76605d5';

    const market = await getMarketById(chain, marketId);

    console.log(market);
    if (market) {
      expect(market.id).toBe(marketId);
    } else {
      fail;
    }
  });
});
