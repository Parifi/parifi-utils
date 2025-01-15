import { Decimal } from 'decimal.js';
import { formatEther, parseEther } from 'viem';

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

export function convertWeiToEther(amountInWei: string | bigint | undefined): number {
  if (amountInWei == undefined) {
    throw new Error('Invalid amount received during conversion: undefined');
  }
  if (typeof amountInWei == 'bigint') {
    return Number(formatEther(amountInWei));
  } else if (typeof amountInWei == 'string') {
    return Number(formatEther(BigInt(amountInWei)));
  } else {
    throw new Error('Expected string or bigint for conversion');
  }
}

export function convertEtherToWei(amount: string | number | undefined): bigint {
  if (amount == undefined) {
    throw new Error('Invalid amount received during conversion: undefined');
  }
  if (typeof amount == 'number') {
    return parseEther(amount.toString());
  } else if (typeof amount == 'string') {
    return parseEther(amount);
  } else {
    throw new Error('Expected string or bigint for conversion');
  }
}
