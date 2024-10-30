import Decimal from 'decimal.js';
import { calculatePositionLeverage, getProfitOrLossInUsd } from './positions';
import { Position } from '../interfaces/sdkTypes';

export class Perps {
  constructor() {}
  getProfitOrLossInUsd = (
    marketPrice: number,
    avgPrice: number,
    positionSize: number,
  ): { totalProfitOrLoss: Decimal } => {
    return getProfitOrLossInUsd(marketPrice, avgPrice, positionSize);
  };

  calculatePositionLeverage = ({
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
    return calculatePositionLeverage({ collateralAmount, size, collateralPrice, marketPrice });
  };
}
