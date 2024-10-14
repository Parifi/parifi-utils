import Decimal from 'decimal.js';
import {
  calculatePositionLeverage,
  getProfitOrLossInUsd,
} from './positions';
import { Position } from '../interfaces/sdkTypes';



export class Perps {
  constructor(
  ) {}
  getProfitOrLossInUsd = (
    userPosition: Position,
    normalizedMarketPrice: Decimal,
    marketDecimals: number,
  ): { totalProfitOrLoss: Decimal } => {
    return getProfitOrLossInUsd(userPosition, normalizedMarketPrice, marketDecimals);
  };
  calculatePositionLeverage = (
    position:Position , collateralInUsd:number
  ): { positionLeverage: Decimal } => {
    return calculatePositionLeverage(position,collateralInUsd);
  };



}
