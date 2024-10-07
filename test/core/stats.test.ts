// import Decimal from 'decimal.js';
// import { getMarketBorrowingRatePerHour, getMarketOpenInterestInUsd } from '../../src/core/pages/statsPage';
// import { getParifiSdkInstanceForTesting } from '..';
// import { TEST_MARKET_ID1 } from '../common/constants';

// describe('Stats tests', () => {
//   it('should return correct borrowing fees for market', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const market = await parifiSdk.subgraph.getMarketById(TEST_MARKET_ID1);

//     const totalLongs = new Decimal(market.totalLongs ?? '0');
//     const totalShorts = new Decimal(market.totalShorts ?? '0');

//     const { borrowingRatePerHourLong, borrowingRatePerHourShorts } =
//       parifiSdk.core.getMarketBorrowingRatePerHour(market);
//     console.log(borrowingRatePerHourLong, borrowingRatePerHourShorts);
//     if (totalLongs.greaterThan(totalShorts)) {
//       expect(borrowingRatePerHourLong.toNumber()).toBeGreaterThan(borrowingRatePerHourShorts.toNumber());
//     } else {
//       expect(borrowingRatePerHourLong.toNumber()).toBeLessThan(borrowingRatePerHourShorts.toNumber());
//     }
//   });

//   it('should return correct Open Interest market', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const market = await parifiSdk.subgraph.getMarketById(TEST_MARKET_ID1);
//     const normalizedMarketPrice = new Decimal(market.pyth?.price ?? '1800000000'); // Price fetched from the subgraph for testing

//     const totalOIInUsd = new Decimal(market.totalOI ?? '0');

//     const { openInterestInUsdLongs, openInterestInUsdShorts } = parifiSdk.core.getMarketOpenInterestInUsd(
//       market,
//       normalizedMarketPrice,
//     );

//     console.log('Total Open Interest Longs: ', openInterestInUsdLongs);
//     console.log('Total Open Interest Shorts: ', openInterestInUsdShorts);

//     const totalOiCalculated = openInterestInUsdLongs.add(openInterestInUsdShorts);
//     // @todo Check why both the Total OI values differ if the same pyth id approximate price
//     // is being used for the calculation in subgraph and here
//     // expect(totalOiCalculated.toNumber()).toBeCloseTo(totalOIInUsd.toNumber(), 2);
//   });

//   it('should return total Open Interest of the protocol across all the markets', async () => {
//     const parifiSdk = await getParifiSdkInstanceForTesting();

//     const totalOIInUsd = await parifiSdk.core.getTotalOpenInterestInUsd();
//     console.log('Total Open Interest: ', totalOIInUsd);
//     expect(totalOIInUsd.toNumber()).toBeGreaterThan(0);
//   });
// });
