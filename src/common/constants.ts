import { Decimal } from 'decimal.js';

export const PRECISION_MULTIPLIER = new Decimal('10000');
export const DEVIATION_PRECISION_MULTIPLIER = new Decimal(10).pow(12);
export const SECONDS_IN_A_YEAR = new Decimal(365 * 24 * 60 * 60);
export const MAX_FEE = new Decimal(10000000); // 1% = 100_000
export const WAD = new Decimal(10).pow(18); // 10^18
export const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const PRICE_FEED_DECIMALS = 8;
export const PRICE_FEED_PRECISION = new Decimal(10).pow(PRICE_FEED_DECIMALS);
export const DECIMAL_10 = new Decimal(10);
export const DECIMAL_ZERO = new Decimal(0);
export const DEFAULT_BATCH_COUNT = 10;

export const GAS_LIMIT_SETTLEMENT = 10000000   // 10M gas
export const GAS_LIMIT_LIQUIDATION = 15000000   // 15M gas

export const ONE_GWEI = 1000000000 // 10^9
export const DEFAULT_GAS_PRICE = 2 * ONE_GWEI // 1 gwei


// Constants for Pyth price ids of collaterals
export const PYTH_ETH_USD_PRICE_ID_BETA = '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6';
export const PYTH_ETH_USD_PRICE_ID_STABLE = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

export const PYTH_USDC_USD_PRICE_ID_BETA = '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722';
export const PYTH_USDC_USD_PRICE_ID_STABLE = '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a';
