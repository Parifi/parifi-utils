import Decimal from 'decimal.js';
import { Chain } from '../../common';
import { getBaseBorrowRatePerSecond, getDynamicBorrowRatePerSecond, getMarketSkew } from '../../contract-logic';
import { Market } from '../../subgraph';

// Returns the total borrowing rate for a market per hour in percentage
export const getMarketBorrowingRatePerHour = (
  market: Market,
): { borrowingRatePerHourLong: Decimal; borrowingRatePerHourShorts: Decimal } => {
  const { baseBorrowRatePerSecondLong, baseBorrowRatePerSecondShort } = getBaseBorrowRatePerSecond(market);

  const dynamicBorrowRatePerSecond = getDynamicBorrowRatePerSecond(market);
  let borrowRateLongs: Decimal;
  let borrowRateShorts: Decimal;

  const totalLongs = new Decimal(market.totalLongs ?? '0');
  const totalShorts = new Decimal(market.totalShorts ?? '0');

  // Dynamic borrowing fee is only paid by the side which has higher open interest
  if (totalLongs.greaterThan(totalShorts)) {
    borrowRateLongs = baseBorrowRatePerSecondLong.add(dynamicBorrowRatePerSecond);
    borrowRateShorts = baseBorrowRatePerSecondShort;
  } else {
    borrowRateLongs = baseBorrowRatePerSecondLong;
    borrowRateShorts = baseBorrowRatePerSecondShort.add(dynamicBorrowRatePerSecond);
  }

  // Convert the per second rate to per hour
  return {
    borrowingRatePerHourLong: borrowRateLongs.mul(3600).div(new Decimal('10').pow(18)),
    borrowingRatePerHourShorts: borrowRateShorts.mul(3600).div(new Decimal('10').pow(18)),
  };
};
