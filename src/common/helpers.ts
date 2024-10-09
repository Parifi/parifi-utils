import { Decimal } from 'decimal.js';
import {
  PYTH_ETH_USD_PRICE_ID_BETA,
  PYTH_ETH_USD_PRICE_ID_STABLE,
  PYTH_USDC_USD_PRICE_ID_BETA,
  PYTH_USDC_USD_PRICE_ID_STABLE,
} from './constants';
import { DepositCollateral } from '../interfaces/sdkTypes';

export const getDiff = (a: Decimal, b: Decimal): Decimal => {
  return a.gt(b) ? a.minus(b) : b.minus(a);
};

export const addDelay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getCurrentTimestampInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

export const getUniqueValuesFromArray = (originalArray: string[]): string[] => {
  const uniqueArray: string[] = [];
  const seenValues = new Set<string>();

  originalArray.forEach((item) => {
    // Check if the value is not already seen
    if (!seenValues.has(item)) {
      // Add the value to the uniqueArray
      uniqueArray.push(item);
      // Mark the value as seen in the set
      seenValues.add(item);
    }
  });
  return uniqueArray;
};

export function getNormalizedPriceByIdFromPriceIdArray(
  priceId: string,
  prices: { priceId: string | undefined; normalizedPrice: Decimal }[],
) {
  // Loop through the prices array
  for (const price of prices) {
    // Check if the priceId matches
    if (price.priceId == priceId) {
      // Return the normalizedPrice if matched
      return price.normalizedPrice;
    }
  }
  // Return 0 if no matching priceId found
  return 0;
}

// Returns the Pyth price IDs of collateral tokens
export const getPriceIdsForCollaterals = (isStable: boolean): string[] => {
  if (isStable) {
    // Return Pyth Stable price ids
    return [PYTH_ETH_USD_PRICE_ID_STABLE, PYTH_USDC_USD_PRICE_ID_STABLE];
  } else {
    // Return Pyth Beta price ids
    return [PYTH_ETH_USD_PRICE_ID_BETA, PYTH_USDC_USD_PRICE_ID_BETA];
  }
};

// Return Pyth price ids with price ids of collateral tokens
export const addPythPriceIdsForCollateralTokens = (isStable: boolean = true, priceIds: string[]): string[] => {
  const collateralPriceIds = getPriceIdsForCollaterals(isStable);
  priceIds.concat(collateralPriceIds);
  return getUniqueValuesFromArray(priceIds);
};

export const aggregateDepositsBySnxAccountId = (data: DepositCollateral[] | undefined): DepositCollateral[] => {
  if (!data) return [];
  // Use reduce to group by snxAccountId and sum the deposited amounts
  const aggregated = data.reduce<Record<string, DepositCollateral>>((acc, item) => {
    const {
      id,
      snxAccountId,
      formattedDepositedAmount,
      collateralAddress,
      collateralDecimals,
      collateralName,
      collateralSymbol,
      depositedAmount,
    } = item;

    // If snxAccountId is already in the accumulator, add to its depositedAmount
    if (acc[snxAccountId]) {
      acc[snxAccountId].formattedDepositedAmount = (
        parseFloat(acc[snxAccountId].formattedDepositedAmount) + parseFloat(formattedDepositedAmount)
      ).toString();
      acc[snxAccountId].depositedAmount = (
        parseFloat(acc[snxAccountId].depositedAmount) + parseFloat(depositedAmount)
      ).toString();
    } else {
      // If snxAccountId is not in the accumulator, initialize it
      acc[snxAccountId] = {
        id,
        snxAccountId,
        collateralDecimals,
        collateralAddress,
        collateralName,
        collateralSymbol,
        depositedAmount,
        formattedDepositedAmount: formattedDepositedAmount,
      };
    }

    return acc;
  }, {});

  // Convert the object back to an array
  return Object.values(aggregated);
};
