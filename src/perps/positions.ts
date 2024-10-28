import Decimal from 'decimal.js';

export const getProfitOrLossInUsd = (
  normalizedMarketPrice: Decimal,
  avgPrice: Decimal,
  positionSize: Decimal,
  marketDecimals: number = 18,
): { totalProfitOrLoss: Decimal } => {
  // Initialize position size and prices as Decimals without Number conversion
  const positionSizeDecimal = positionSize.div(Decimal.pow(10, marketDecimals));
  const avgPriceDecimal = avgPrice.div(Decimal.pow(10, marketDecimals));
  const profitOrLossPerToken = normalizedMarketPrice.minus(avgPriceDecimal);
  const totalProfitOrLoss = positionSizeDecimal.times(profitOrLossPerToken);
  console.log("totalProfitOrLoss",totalProfitOrLoss)
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

