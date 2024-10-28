import Decimal from 'decimal.js';
import {  calculatePositionLeverage, getProfitOrLossInUsd } from './positions';
import { Position } from '../interfaces/sdkTypes';

export class Perps {
  constructor() {}
  getProfitOrLossInUsd = (
    normalizedMarketPrice: Decimal,
    avgPrice: Decimal,
    positionSize: Decimal,
    marketDecimals: number = 18,
  ): { totalProfitOrLoss: Decimal } => {
    return getProfitOrLossInUsd(normalizedMarketPrice, avgPrice, positionSize, marketDecimals);
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
