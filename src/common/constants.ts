import { Decimal } from 'decimal.js';

export const PRECISION_MULTIPLIER = new Decimal('10000');
export const DEVIATION_PRECISION_MULTIPLIER = new Decimal(10).pow(12);
export const SECONDS_IN_A_YEAR = new Decimal(365 * 24 * 60 * 60);
