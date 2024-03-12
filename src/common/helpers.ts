import { Decimal } from 'decimal.js';

export const getDiff = (a: Decimal, b: Decimal): Decimal => {
  return a.gt(b) ? a.minus(b) : b.minus(a);
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
