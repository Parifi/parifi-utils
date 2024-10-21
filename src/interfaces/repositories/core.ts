import Decimal from 'decimal.js';

export type CalculateSizeFromCollateral = {
  amount: Decimal;
  leverage: Decimal;
  executionFeeInCollateral: Decimal;
  openingFee: Decimal;
  normalizedMarketPrice: Decimal;
  normalizedCollateralPrice: Decimal;
};

export interface CoreRepository {
  calculateSizeFromCollateral(data: CalculateSizeFromCollateral): Decimal;
}
