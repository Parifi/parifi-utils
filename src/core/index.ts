import { CalculateSizeFromCollateral, CoreRepository } from '../interfaces/repositories/core';

export class Core implements CoreRepository {
  calculateSizeFromCollateral({
    amount,
    normalizedCollateralPrice,
    executionFeeInCollateral,
    openingFee,
    leverage,
    normalizedMarketPrice,
  }: CalculateSizeFromCollateral) {
    const collateralInUsd = amount.mul(normalizedCollateralPrice);
    const executionFeeInUsd = executionFeeInCollateral.mul(normalizedCollateralPrice);

    const sizeInUsd = collateralInUsd.sub(executionFeeInUsd).div(openingFee.add(1).div(leverage));

    return sizeInUsd.div(normalizedMarketPrice);
  }
}
