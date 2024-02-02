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
