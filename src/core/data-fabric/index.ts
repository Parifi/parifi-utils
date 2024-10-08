// import { DECIMAL_10, DECIMAL_ZERO, PRECISION_MULTIPLIER, SECONDS_IN_A_YEAR, WAD } from '../../common/constants';
// import { getDiff } from '../../common/helpers';
// import { InvalidValueError } from '../../error/invalid-value.error';
// import { Market, Position } from '../../interfaces/subgraphTypes';
// import { Decimal } from 'decimal.js';

import { Chain } from "@parifi/references";
import { SynthetixSdk } from "@parifi/synthetix-sdk-ts";

// // Returns Market Utilization for a Market
// export const getMarketUtilization = (market: Market, isLong: boolean): Decimal => {
//   if (!market.totalLongs || !market.totalShorts || !market.maxOpenInterest) {
//     throw new InvalidValueError('Total Longs/Shorts');
//   }

//   const totalLongs = new Decimal(market.totalLongs);
//   const totalShorts = new Decimal(market.totalShorts);
//   const maxOpenInterest = new Decimal(market.maxOpenInterest);

//   // Throw an error is maxOi is 0 to prevent divide by zero error
//   if (maxOpenInterest.isZero()) throw new Error('Max OI is zero. Invalid market config');

//   return new Decimal(isLong ? totalLongs : totalShorts).times(PRECISION_MULTIPLIER).dividedBy(maxOpenInterest);
// };

// // Returns the market skew based on the total long and total short positions
// export const getMarketSkew = (market: Market): Decimal => {
//   if (!market.totalLongs || !market.totalShorts) {
//     throw new InvalidValueError('Total Longs/Shorts');
//   }

//   const totalLongs = new Decimal(market.totalLongs);
//   const totalShorts = new Decimal(market.totalShorts);
//   const diff = getDiff(totalLongs, totalShorts);

//   if (diff.isZero()) return DECIMAL_ZERO;
//   return diff.times(PRECISION_MULTIPLIER).dividedBy(totalLongs.add(totalShorts));
// };

// // Returns the market skew in percentage based on the total long and total short positions
// export const getMarketSkewPercent = (market: Market): Decimal => {
//   return getMarketSkew(market).times(100);
// };

// // Returns the market skew in percentage for interface UI display
// export const getMarketSkewUi = (market: Market): { skewLongs: Decimal; skewShorts: Decimal } => {
//   if (!market.totalLongs || !market.totalShorts) {
//     throw new InvalidValueError('Total Longs/Shorts');
//   }
//   const skewPercent = getMarketSkewPercent(market).div(PRECISION_MULTIPLIER);

//   // If both longs and shorts have equal value, then skew is 50% for each side and market is balanced
//   const skewHigh = skewPercent.greaterThan(new Decimal(50)) ? skewPercent : new Decimal(50).add(skewPercent);
//   const skewLow = new Decimal(100).minus(skewHigh);

//   if (new Decimal(market.totalLongs).greaterThan(new Decimal(market.totalShorts))) {
//     return { skewLongs: skewHigh, skewShorts: skewLow };
//   } else {
//     return { skewLongs: skewLow, skewShorts: skewHigh };
//   }
// };

// // Returns the Dynamic Borrow rate per second for a market
// export const getDynamicBorrowRatePerSecond = (market: Market): Decimal => {
//   if (!market.dynamicCoeff || !market.maxDynamicBorrowFee) {
//     throw new InvalidValueError('dynamicCoeff/maxDynamicBorrowFee');
//   }

//   const maxDynamicBorrowFee = new Decimal(market.maxDynamicBorrowFee);
//   const skew = getMarketSkew(market);

//   // Computing e^-(dynamicCoeff * skew * wad /(PRECISION_MULTIPLIER * 100))
//   const exponent = new Decimal(-1).times(market.dynamicCoeff).times(skew).dividedBy(PRECISION_MULTIPLIER.times(100));

//   const eToTheExponent = Decimal.exp(exponent).times(WAD).floor();

//   let dynamicBorrowRate = maxDynamicBorrowFee
//     .times(WAD)
//     .times(WAD.minus(eToTheExponent))
//     .dividedBy(WAD.plus(eToTheExponent));
//   dynamicBorrowRate = dynamicBorrowRate.dividedBy(SECONDS_IN_A_YEAR.times(100));

//   return dynamicBorrowRate.floor();
// };

// // Returns the calculated base borrow rate per second for a market
// export const getBaseBorrowRatePerSecond = (
//   market: Market,
// ): { baseBorrowRatePerSecondLong: Decimal; baseBorrowRatePerSecondShort: Decimal } => {
//   if (!market.baseCoeff || !market.baseConst) {
//     throw new InvalidValueError('baseCoeff/baseConst');
//   }

//   const baseCoeff = new Decimal(market.baseCoeff);
//   const baseConst = new Decimal(market.baseConst);

//   const utilizationBpsLong = getMarketUtilization(market, true).times(100);
//   const utilizationBpsShort = getMarketUtilization(market, false).times(100);

//   // process to calculate baseBorrowRate
//   let baseBorrowRateLong = WAD.times(
//     new Decimal(baseCoeff).times(utilizationBpsLong).times(utilizationBpsLong).plus(baseConst),
//   );
//   baseBorrowRateLong = baseBorrowRateLong.dividedBy(DECIMAL_10.pow(12).times(SECONDS_IN_A_YEAR));

//   let baseBorrowRateShort = WAD.times(baseCoeff.times(utilizationBpsShort).times(utilizationBpsShort).plus(baseConst));
//   baseBorrowRateShort = baseBorrowRateShort.dividedBy(DECIMAL_10.pow(12).times(SECONDS_IN_A_YEAR));

//   return {
//     baseBorrowRatePerSecondLong: baseBorrowRateLong.floor(),
//     baseBorrowRatePerSecondShort: baseBorrowRateShort.floor(),
//   };
// };

// // Returns th accrued borrowing fees in market values
// Optimized function to get Pyth network URLs
export const getPythNetworkUrl = (() => {
    const benchmark = 'https://benchmarks.pyth.network';
    const hermes = process.env.NEXT_PUBLIC_HERMES || 'https://hermes.pyth.network';
    return { hermes, benchmark };
  })();
  
  export const alchemyRpcPerChain = {
    [Chain.ARBITRUM_MAINNET]: `https://arb-mainnet.g.alchemy.com/v2/pkGkXwClv6s-PfIbD2v6HvVOIjzncw2Q`,
  };
  
  const config = {
    rpcConfig: {
      chainId: Chain.ARBITRUM_MAINNET,
      rpcEndpoint: alchemyRpcPerChain[Chain.ARBITRUM_MAINNET],
      preset: 'main',
    },
    pythConfig: {
      pythEndpoint: getPythNetworkUrl.hermes,
    },
    partnerConfig: {},
    accountConfig: {
      address: '0xC517B4aBBC2190468B6F6277E3886b70b23eF739',
    },
  };
  
  let synthetixSdk: SynthetixSdk | null = null;
  
  export const getSynthetixSdk = async (): Promise<SynthetixSdk> => {
    if (!synthetixSdk) {
      synthetixSdk = new SynthetixSdk(config);
      await synthetixSdk.init();
    }
    return synthetixSdk;
  };
  
  export const getAccruedFeesInMarket = async (marketIdOrName: string | number, accountId: bigint): Promise<any> => {
    const sdk = await getSynthetixSdk();
    const position = await sdk.perps.getOpenPosition(marketIdOrName, accountId);
    return position.accruedFunding;
  };
  