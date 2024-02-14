import { PRECISION_MULTIPLIER, SECONDS_IN_A_YEAR, WAD } from '../../common/constants';
import { getDiff } from '../../common/helpers';
import { Market, Position } from '../../interfaces/subgraphTypes';
import { Decimal } from 'decimal.js';

// Returns Market Utilization for a Market
export const getMarketUtilization = (market: Market, isLong: boolean): Decimal => {
  const totalLongs = market.totalLongs ?? '0';
  const totalShorts = market.totalShorts ?? '0';
  const maxOpenInterest = market.maxOpenInterest ?? '0';

  return new Decimal(isLong ? totalLongs : totalShorts).times(PRECISION_MULTIPLIER).dividedBy(maxOpenInterest);
};

// Returns the market skew based on the total long and total short positions
export const getMarketSkew = (market: Market): Decimal => {
  const totalLongs = market.totalLongs ?? '0';
  const totalShorts = market.totalShorts ?? '0';

  if (new Decimal(totalLongs).add(totalShorts).eq(0)) return new Decimal(0);
  return getDiff(new Decimal(totalLongs), new Decimal(totalShorts))
    .times(PRECISION_MULTIPLIER)
    .dividedBy(new Decimal(totalLongs).add(totalShorts));
};

// Returns the Dynamic Borrow rate per second for a market
export const getDynamicBorrowRatePerSecond = (market: Market): Decimal => {
  const dynamicCoeff = market.dynamicCoeff ?? '0';
  const maxDynamicBorrowFee = market.maxDynamicBorrowFee ?? '0';

  const skew = getMarketSkew(market);

  // Computing e^-(dynamicCoeff * skew * wad /(PRECISION_MULTIPLIER * 100))
  const exponent = new Decimal(-1).times(dynamicCoeff).times(skew).dividedBy(PRECISION_MULTIPLIER.times(100));

  const eToTheExponent = Decimal.exp(exponent).times(WAD).floor();

  let dynamicBorrowRate = new Decimal(maxDynamicBorrowFee)
    .times(WAD)
    .times(WAD.minus(eToTheExponent))
    .dividedBy(WAD.plus(eToTheExponent));
  dynamicBorrowRate = dynamicBorrowRate.dividedBy(SECONDS_IN_A_YEAR.times(100));

  return dynamicBorrowRate.floor();
};

// Returns the calculated base borrow rate per second for a market
export const getBaseBorrowRatePerSecond = (
  market: Market,
): { baseBorrowRatePerSecondLong: Decimal; baseBorrowRatePerSecondShort: Decimal } => {
  const baseCoeff = market.baseCoeff ?? '0';
  const baseConst = market.baseConst ?? '0';

  const utilizationBpsLong = getMarketUtilization(market, true).times(100);
  const utilizationBpsShort = getMarketUtilization(market, false).times(100);

  // process to calculate baseBorrowRate
  let baseBorrowRateLong = WAD.times(
    new Decimal(baseCoeff).times(utilizationBpsLong).times(utilizationBpsLong).plus(baseConst),
  );
  baseBorrowRateLong = baseBorrowRateLong.dividedBy(new Decimal(10).pow(12).times(SECONDS_IN_A_YEAR));

  let baseBorrowRateShort = WAD.times(
    new Decimal(baseCoeff).times(utilizationBpsShort).times(utilizationBpsShort).plus(baseConst),
  );
  baseBorrowRateShort = baseBorrowRateShort.dividedBy(new Decimal(10).pow(12).times(SECONDS_IN_A_YEAR));

  return {
    baseBorrowRatePerSecondLong: baseBorrowRateLong.floor(),
    baseBorrowRatePerSecondShort: baseBorrowRateShort.floor(),
  };
};

// Returns th accrued borrowing fees in market values
export const getAccruedBorrowFeesInMarket = (position: Position, market: Market): Decimal => {
  const totalLongs = new Decimal(market.totalLongs ?? '0');
  const totalShorts = new Decimal(market.totalShorts ?? '0');

  const timeDelta = new Decimal(Math.floor(Date.now() / 1000)).minus(market.feeLastUpdatedTimestamp ?? '0');

  // Get latest base borrow rate for Longs and Shorts
  const baseBorrowRate = getBaseBorrowRatePerSecond(market);
  const baseBorrowRatePerSecondLong = new Decimal(baseBorrowRate.baseBorrowRatePerSecondLong);
  const baseBorrowRatePerSecondShort = new Decimal(baseBorrowRate.baseBorrowRatePerSecondShort);

  const newBaseFeeCumulativeLongs = new Decimal(market.baseFeeCumulativeLongs ?? '0').add(
    timeDelta.times(baseBorrowRatePerSecondLong),
  );
  const newBaseFeeCumulativeShorts = new Decimal(market.baseFeeCumulativeShorts ?? '0').add(
    timeDelta.times(baseBorrowRatePerSecondShort),
  );

  // Get latest dynamic borrow rate for Longs and Shorts
  const dynamicBorrowRatePerSecond = new Decimal(getDynamicBorrowRatePerSecond(market));
  let newDynamicFeeCumulativeLongs = new Decimal(market.dynamicFeeCumulativeLongs ?? '0');
  let newDynamicFeeCumulativeShorts = new Decimal(market.dynamicFeeCumulativeShorts ?? '0');

  if (totalLongs.gt(totalShorts)) {
    newDynamicFeeCumulativeLongs = newDynamicFeeCumulativeLongs.add(timeDelta.times(dynamicBorrowRatePerSecond));
  } else {
    newDynamicFeeCumulativeShorts = newDynamicFeeCumulativeShorts.add(timeDelta.times(dynamicBorrowRatePerSecond));
  }

  const currentFeeCumulative = position.isLong
    ? newBaseFeeCumulativeLongs.add(newDynamicFeeCumulativeLongs)
    : newBaseFeeCumulativeShorts.add(newDynamicFeeCumulativeShorts);

  const accruedFeesCumulative = getDiff(currentFeeCumulative, new Decimal(position.lastCumulativeFee ?? '0'));

  return new Decimal(position.positionSize ?? '0')
    .times(accruedFeesCumulative)
    .div(new Decimal(100).times(new Decimal(10).pow(18)))
    .ceil();
};
