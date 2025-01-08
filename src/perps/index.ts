import Decimal from 'decimal.js';
import {
  calculateCollateralFromSizeAndLeverage,
  calculateLeverageFromCollateralAndSize,
  calculateSizeFromCollateralAndLeverage,
  getProfitOrLossInUsd,
} from './positions';

export class Perps {
  constructor() {}

  getProfitOrLossInUsd = (marketPrice: number, avgPrice: number, positionSize: number): Decimal => {
    return getProfitOrLossInUsd(marketPrice, avgPrice, positionSize);
  };

  calculateSizeFromCollateralAndLeverage = ({
    collateralValueInUsd,
    leverage,
    marketPrice,
  }: {
    collateralValueInUsd: number;
    leverage: number;
    marketPrice: number;
  }): Decimal => {
    return calculateSizeFromCollateralAndLeverage(collateralValueInUsd, leverage, marketPrice);
  };

  calculateCollateralFromSizeAndLeverage = ({
    sizeInUsd,
    leverage,
    collateralPrice,
  }: {
    sizeInUsd: number;
    leverage: number;
    collateralPrice: number;
  }): Decimal => {
    return calculateCollateralFromSizeAndLeverage(sizeInUsd, leverage, collateralPrice);
  };

  calculateLeverageFromCollateralAndSize = ({
    collateralValueInUsd,
    sizeInUsd,
  }: {
    collateralValueInUsd: number;
    sizeInUsd: number;
  }): number => {
    return calculateLeverageFromCollateralAndSize(collateralValueInUsd, sizeInUsd);
  };
}
