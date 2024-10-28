import Decimal from 'decimal.js';
import {  calculatePositionLeverage, getProfitOrLossInUsd } from './positions';
import { Position } from '../interfaces/sdkTypes';

export class Perps {
  constructor() {}
  getProfitOrLossInUsd = (
    normalizedMarketPrice: number,
    avgPrice: number,
    positionSize: number,
    isLong: boolean,
    marketDecimals: number = 18,
  ): { totalProfitOrLoss: Decimal } => {
    return getProfitOrLossInUsd(normalizedMarketPrice, avgPrice, positionSize, isLong, marketDecimals);
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
