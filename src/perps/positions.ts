import Decimal from 'decimal.js';

// Calculates the Profit/Loss of the position given marketPrice and avgPrice
// @param positionSize is negative for a short position and positive for Long position
export const getProfitOrLossInUsd = (marketPrice: number, avgPrice: number, positionSize: number): Decimal => {
  const profitOrLossPerToken = new Decimal(marketPrice).minus(avgPrice);
  return new Decimal(positionSize).times(profitOrLossPerToken);
};

// Calculates the formatted position size using collateral and leverage
// using equation: Size = Collateral * Leverage
export const calculateSizeFromCollateralAndLeverage = (
  collateralValueInUsd: number,
  leverage: number,
  marketPrice: number,
): Decimal => {
  const sizeInUsd = new Decimal(collateralValueInUsd).times(leverage);
  return sizeInUsd.div(marketPrice);
};

// Calculates the Collateral amount using size and leverage values
// using equation: Collateral = Size / Leverage
export const calculateCollateralFromSizeAndLeverage = (
  sizeInUsd: number,
  leverage: number,
  collateralPrice: number,
): Decimal => {
  const collateralInUsd = new Decimal(sizeInUsd).div(leverage);
  return collateralInUsd.div(collateralPrice);
};

// Calculates the leverage value of a position using size and collateral values
// using equation: Leverage = Size / Collateral
export const calculateLeverageFromCollateralAndSize = (collateralValueInUsd: number, sizeInUsd: number): number => {
  return sizeInUsd / collateralValueInUsd;
};
