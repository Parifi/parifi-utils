import { getParifiSdkInstanceForTesting } from '..';
import { SYMBOL_TO_PYTH_FEED } from '../../src';

describe('Portfolio data fetching logic from subgraph', () => {
  it('should return  portfolio data', async () => {
    const userAddresses = [
      '0x0000000000000000000000000000000000000000',
      '0x14a574faf59023792372251501337fd2bdb75986',
      '0x000000091e379eda0a6f8ec0d945ecac32628538',
      '0x092772cdef109fed26052e79b952ac5404f1ed21',
      '0x11e82bbd9477f62562c88b140d2d309030707303',
      '0xc96cfb18c39dc02fba229b6ea698b1ad5576df4c',
    ];
    const parifiSdk = await getParifiSdkInstanceForTesting();
    const priceIdArray: string[] = Array.from(SYMBOL_TO_PYTH_FEED.values());
    const data = await parifiSdk.pyth.getLatestPricesFromPyth(priceIdArray);
    const data1 = parifiSdk.subgraph.transformPriceArray(data);

    data1.map(({ id }) => {
      expect(priceIdArray.includes(id));
    });

    console.log('----------------------------------------------------------------');
    const data2 = await parifiSdk.subgraph.getPortfolioDataByUsersAddress(['0x2f22928335ed7e472c18e1e487593c0ac40e9ca8'], data1);
    console.log('----------------------------------------------------------------');
    // ensure that each ensure have this own information
    console.log('data2',data2)
    data2.map(({ userAddress, depositedCollateral, unrealizedPnl, realizedPnl }) => {
      expect(userAddresses.includes(userAddress));
      expect(depositedCollateral).toBeDefined();
      expect(unrealizedPnl).toBeDefined();
      expect(realizedPnl).toBeDefined();
    });
    console.log('----------------------------------------------------------------');
  });
});
