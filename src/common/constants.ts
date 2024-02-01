import { Decimal } from 'decimal.js';

export const PRECISION_MULTIPLIER = new Decimal('10000');
export const DEVIATION_PRECISION_MULTIPLIER = new Decimal(10).pow(12);
export const SECONDS_IN_A_YEAR = new Decimal(365 * 24 * 60 * 60);
export const MAX_FEE = new Decimal(10000000); // 1% = 100_000
export const WAD = new Decimal(10).pow(18); // 10^18
export const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const PRICE_FEED_DECIMALS = 8;
