import Decimal from 'decimal.js';

export const getProfitOrLossInUsd = (
  normalizedMarketPrice: number,
  avgPrice: number,
  positionSize: number,
  marketDecimals: number = 18,
): { totalProfitOrLoss: Decimal } => {
  const positionSizeDecimal = new Decimal(positionSize).div(Decimal.pow(10, marketDecimals));
  const avgPriceDecimal = new Decimal(avgPrice).div(Decimal.pow(10, marketDecimals));
  const profitOrLossPerToken = new Decimal(normalizedMarketPrice).minus(avgPriceDecimal);
  const totalProfitOrLoss = positionSizeDecimal.times(profitOrLossPerToken);
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

