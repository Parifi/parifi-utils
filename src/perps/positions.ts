import Decimal from 'decimal.js';

export const getProfitOrLossInUsd = (
  normalizedMarketPrice: number,
  avgPrice: number,
  positionSize: number,
  isLong: boolean,
  marketDecimals: number = 18,
): { totalProfitOrLoss: Decimal } => {
  let profitOrLoss: Decimal;
  const positionAvgPrice = new Decimal(avgPrice).div(Decimal.pow(10, marketDecimals));
  const positionSizeDecimal = new Decimal(Math.abs(Number(positionSize))).abs().div(Decimal.pow(10, marketDecimals));
  const normalizedMarketPriceDecimal = new Decimal(normalizedMarketPrice).div(Decimal.pow(10, marketDecimals));
  if (isLong) {
    profitOrLoss = normalizedMarketPriceDecimal.minus(positionAvgPrice);
  } else {
    profitOrLoss = positionAvgPrice.minus(normalizedMarketPriceDecimal);
  }

  // Adjust the sign for short positions (profit is positive when market price is lower)
  if (!isLong) {
    profitOrLoss = profitOrLoss.times(new Decimal(-1));
  }

  const totalProfitOrLoss = positionSizeDecimal.times(profitOrLoss);

  return { totalProfitOrLoss };
};
export const calculatePositionLeverage = ({
  collateralAmount,
  size,
  collateralPrice,
  marketPrice,
}: {
  collateralAmount: number;
  size: number;
  collateralPrice: number;
  marketPrice: number;
}): { positionLeverage: Decimal } => {
  // Calculate collateral in USDC
  const collateralUsed = new Decimal(collateralAmount);
  const collateralInUSDC = collateralUsed.times(collateralPrice);

  // Calculate position size in USDC
  const positionSize = new Decimal(size);
  const marketPriceDecimal = new Decimal(marketPrice);
  const positionSizeInUSDC = positionSize.times(marketPriceDecimal);

  // Calculate leverage if collateralInUSDC is greater than zero
  if (collateralInUSDC.gt(0)) {
    const calculatedLeverage = positionSizeInUSDC.div(collateralInUSDC);
    return { positionLeverage: calculatedLeverage };
  }

  return { positionLeverage: new Decimal(0) };
};

