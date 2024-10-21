import Decimal from 'decimal.js';
import { Position } from '../interfaces/sdkTypes';
import { formatEther } from 'ethers';

export const getProfitOrLossInUsd = (
  positionData: Position,
  normalizedMarketPrice: Decimal,
  marketDecimals: number = 18,
): { totalProfitOrLoss: Decimal } => {
  let profitOrLoss: Decimal;
  const { avgPrice, positionSize, isLong } = positionData;
  const positionAvgPrice = new Decimal(avgPrice).div(Decimal.pow(10, marketDecimals));
  const positionSizeDecimal = new Decimal(Math.abs(Number(positionSize))).abs().div(Decimal.pow(10, marketDecimals));
  if (isLong) {
    // If long, profit when market price > avg price
    if (normalizedMarketPrice.gt(positionAvgPrice)) {
      profitOrLoss = normalizedMarketPrice.minus(positionAvgPrice);
    } else {
      profitOrLoss = positionAvgPrice.minus(normalizedMarketPrice);
      profitOrLoss.times(-1);
    }
  } else {
    // If short, profit when market price < avg price
    if (normalizedMarketPrice.gt(positionAvgPrice)) {
      profitOrLoss = normalizedMarketPrice.minus(positionAvgPrice);
    } else {
      profitOrLoss = positionAvgPrice.minus(normalizedMarketPrice);
      profitOrLoss.times(-1);
    }
  }

  const totalProfitOrLoss = positionSizeDecimal.times(profitOrLoss);

  return { totalProfitOrLoss };
};

export const calculatePositionLeverage = (
  position: Position,
  collateralPrice: number,
  marketPrice: number,
): { positionLeverage: Decimal } => {
  if (!position || !position.depositCollateral?.[0] || !position.depositCollateral[0].formattedDepositedAmount) {
    return { positionLeverage: new Decimal(0) };
  }

  // Calculate collateral in USDC
  const collateralUsed = new Decimal(position.depositCollateral[0].formattedDepositedAmount);
  const collateralInUSDC = collateralUsed.times(collateralPrice);

  // Calculate position size in USDC
  const positionSize = new Decimal(formatEther(BigInt(position.positionSize || 0)));
  const marketPriceDecimal = new Decimal(formatEther(BigInt(marketPrice || 0)));
  const positionSizeInUSDC = positionSize.times(marketPriceDecimal);

  // Calculate leverage if collateralInUSDC is greater than zero
  if (collateralInUSDC.gt(0)) {
    const calculatedLeverage = positionSizeInUSDC.div(collateralInUSDC);
    return { positionLeverage: calculatedLeverage };
  }
  return { positionLeverage: new Decimal(0) };
};
