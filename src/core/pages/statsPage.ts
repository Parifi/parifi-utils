import Decimal from 'decimal.js';
import { DECIMAL_10, DECIMAL_ZERO, PRICE_FEED_DECIMALS } from '../../common';
import { getBaseBorrowRatePerSecond, getDynamicBorrowRatePerSecond } from '../data-fabric';
import { Market } from '../../interfaces/subgraphTypes';
import { getAllMarketsFromSubgraph } from '../../subgraph';
import { getLatestPricesFromPyth, getLatestPricesNormalized } from '../../pyth/pyth';
import { AxiosInstance } from 'axios';

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

// Returns the total Open Interest of market for longs and shorts in formatted USD
export const getMarketOpenInterestInUsd = (
  market: Market,
  normalizedMarketPrice: Decimal,
): { openInterestInUsdLongs: Decimal; openInterestInUsdShorts: Decimal } => {
  const totalLongs = new Decimal(market.totalLongs ?? '0');
  const totalShorts = new Decimal(market.totalShorts ?? '0');

  const marketDecimals = new Decimal(market.marketDecimals ?? '1');
  const decimalFactor = DECIMAL_10.pow(marketDecimals);

  const openInterestInUsdLongs = totalLongs
    .mul(normalizedMarketPrice)
    .div(decimalFactor)
    .div(DECIMAL_10.pow(PRICE_FEED_DECIMALS));

  const openInterestInUsdShorts = totalShorts
    .mul(normalizedMarketPrice)
    .div(decimalFactor)
    .div(DECIMAL_10.pow(PRICE_FEED_DECIMALS));

  return { openInterestInUsdLongs, openInterestInUsdShorts };
};

// Returns the Total Open Interest of protocol across all the markets in USD
export const getTotalOpenInterestInUsd = async (
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
): Promise<Decimal> => {
  let totalOpenInterestInUsd = DECIMAL_ZERO;

  const markets = await getAllMarketsFromSubgraph(subgraphEndpoint);
  const priceIds: string[] = [];
  markets.forEach((market) => {
    if (market.pyth?.id) {
      priceIds.push(market.pyth?.id);
    }
  });

  const latestPrices = await getLatestPricesNormalized(priceIds, pythClient);

  markets.forEach((market) => {
    const totalOi = new Decimal(market.totalLongs ?? 0).add(new Decimal(market.totalShorts ?? 0));
    const marketDecimals = new Decimal(market.marketDecimals ?? '1');
    const decimalFactor = DECIMAL_10.pow(marketDecimals);

    const normalizedMarketPrice =
      latestPrices.find((prices) => prices.priceId === market.pyth?.id)?.normalizedPrice || DECIMAL_ZERO;

    const openInterestInUsd = totalOi
      .mul(normalizedMarketPrice)
      .div(decimalFactor)
      .div(DECIMAL_10.pow(PRICE_FEED_DECIMALS));

    totalOpenInterestInUsd = totalOpenInterestInUsd.add(openInterestInUsd);
  });
  return totalOpenInterestInUsd;
};
