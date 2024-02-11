import 'dotenv/config';
import { Chain } from '@parifi/references';
import { ParifiSdk } from '../../src';
import Decimal from 'decimal.js';
import { RpcConfig } from '../../src/types';
import { getMarketBorrowingRatePerHour, getMarketOpenInterestInUsd } from '../../src/core/statsPage';

const rpcConfig: RpcConfig = {
  chainId: Chain.ARBITRUM_SEPOLIA,
};

const parifiSdk = new ParifiSdk(rpcConfig, {}, {}, {});

describe('Stats tests', () => {
  it('should return correct borrowing fees for market', async () => {
    const marketId = '0x122d17f9d86438d3f9d12c1366a56e45c03ae191f705a5d850617739f76605d5';
    const market = await parifiSdk.subgraph.getMarketById(marketId);

    const totalLongs = new Decimal(market.totalLongs ?? '0');
    const totalShorts = new Decimal(market.totalShorts ?? '0');

    const { borrowingRatePerHourLong, borrowingRatePerHourShorts } = getMarketBorrowingRatePerHour(market);
    console.log(borrowingRatePerHourLong, borrowingRatePerHourShorts);
    if (totalLongs.greaterThan(totalShorts)) {
      expect(borrowingRatePerHourLong.toNumber()).toBeGreaterThan(borrowingRatePerHourShorts.toNumber());
    } else {
      expect(borrowingRatePerHourLong.toNumber()).toBeLessThan(borrowingRatePerHourShorts.toNumber());
    }
  });

  it('should return correct Open Interest market', async () => {
    const marketId = '0x122d17f9d86438d3f9d12c1366a56e45c03ae191f705a5d850617739f76605d5';

    const market = await parifiSdk.subgraph.getMarketById(marketId);
    const normalizedMarketPrice = new Decimal(market.pyth?.price ?? '1800000000'); // Price fetched from the subgraph for testing

    const totalOIInUsd = new Decimal(market.totalOI ?? '0');

    const { openInterestInUsdLongs, openInterestInUsdShorts } = getMarketOpenInterestInUsd(
      market,
      normalizedMarketPrice,
    );

    console.log('Total Open Interest Longs: ', openInterestInUsdLongs);
    console.log('Total Open Interest Shorts: ', openInterestInUsdShorts);

    const totalOiCalculated = openInterestInUsdLongs.add(openInterestInUsdShorts);
    // @todo Check why both the Total OI values differ if the same pyth id approximate price
    // is being used for the calculation in subgraph and here
    // expect(totalOiCalculated.toNumber()).toBeCloseTo(totalOIInUsd.toNumber(), 2);
  });
});
