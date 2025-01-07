import { Decimal } from 'decimal.js';

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
