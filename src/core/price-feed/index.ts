import { Decimal } from 'decimal.js';
import { DECIMAL_10 } from '../../common';

// Converts the amount of market tokens to collateral tokens considering the decimal
// values of both market and collateral tokens
// Normalized price is the price of market and collateral with 8 decimals
// The value returned by the function contains `collateralDecimals` number of decimal digits
export const convertMarketAmountToCollateral = (
  marketAmount: Decimal,
  marketDecimals: Decimal,
  collateralDecimals: Decimal,
  normalizedMarketPrice: Decimal,
  normalizedCollateralPrice: Decimal,
): Decimal => {
  const numeratorMultiplier = DECIMAL_10.pow(collateralDecimals);
  const denominatorMultiplier = DECIMAL_10.pow(marketDecimals);

  let tokenAmount = normalizedMarketPrice.mul(marketAmount).mul(numeratorMultiplier);
  return tokenAmount.div(normalizedCollateralPrice).div(denominatorMultiplier);
};

// Converts marketAmount to USD with 8 decimals
export const convertMarketAmountToUsd = (
  marketAmount: Decimal,
  marketDecimals: Decimal,
  normalizedMarketPrice: Decimal,
): Decimal => {
  const denominatorMultiplier = DECIMAL_10.pow(marketDecimals);
  return marketAmount.mul(normalizedMarketPrice).div(denominatorMultiplier);
};

// Converts the amount of collateral to USD with 8 decimals
export const convertCollateralAmountToUsd = (
  collateralAmount: Decimal,
  collateralDecimals: Decimal,
  normalizedCollateralPrice: Decimal,
): Decimal => {
  const denominatorMultiplier = DECIMAL_10.pow(collateralDecimals);
  return collateralAmount.mul(normalizedCollateralPrice).div(denominatorMultiplier);
};
