import { Decimal } from 'decimal.js';

export const PRECISION_MULTIPLIER = new Decimal('10000');
export const DEVIATION_PRECISION_MULTIPLIER = new Decimal(10).pow(12);
export const SECONDS_IN_A_YEAR = new Decimal(365 * 24 * 60 * 60);
export const MAX_FEE = new Decimal(10000000); // 1% = 100_000
export const WAD = new Decimal(10).pow(18); // 10^18
export const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
// export const PRICE_FEED_DECIMALS = 18;
// export const PRICE_FEED_PRECISION = new Decimal(10).pow(PRICE_FEED_DECIMALS);
export const DECIMAL_10 = new Decimal(10);
export const DECIMAL_ZERO = new Decimal(0);
export const DEFAULT_BATCH_COUNT = 10;
export const BIGINT_ZERO = BigInt(0);

export const GAS_LIMIT_SETTLEMENT = 10000000; // 10M gas
export const GAS_LIMIT_LIQUIDATION = 15000000; // 15M gas

export const ONE_GWEI = 1000000000; // 10^9
export const DEFAULT_GAS_PRICE = 2 * ONE_GWEI; // 1 gwei

// Constants for Pyth price ids of collaterals
export const PYTH_ETH_USD_PRICE_ID_BETA = '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6';
export const PYTH_ETH_USD_PRICE_ID_STABLE = '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace';

export const PYTH_USDC_USD_PRICE_ID_BETA = '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722';
export const PYTH_USDC_USD_PRICE_ID_STABLE = '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a';

// Constants for Pimlico relayer
export const FACTORY_ADDRESS_SIMPLE_ACCOUNT = '0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985';

// Temporary constants
export const SUBGRAPH_HELPER_ADDRESS = '0xf012d32505df6853187170F00C7b789A8ecC41c2';

export const SYMBOL_TO_PYTH_FEED = new Map<string, string>([
  // market
  ['BTC', '0xc9d8b075a5c69303365ae23633d4e085199bf5c520a3b90fed1322a0342ffc33'],
  ['SOL', '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d'],
  ['WIF', '0x4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc'],
  ['ETH', '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace'],
  ['AAVE', '0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445'],
  ['ADA', '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d'],
  ['ARB', '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5'],
  ['AVAX', '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7'],
  ['BCH', '0x3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3'],
  ['BNB', '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f'],
  ['CRV', '0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8'],
  ['DOGE', '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c'],
  ['DYDX', '0x6489800bb8974169adfe35937bf6736507097d13c190d760c557108c7e93a81b'],
  ['GMX', '0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf'],
  ['LINK', '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221'],
  ['LTC', '0x6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54'],
  ['MKR', '0x9375299e31c0deb9c6bc378e6329aab44cb48ec655552a70d4b9050346a30378'],
  ['NEAR', '0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750'],
  ['OP', '0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf'],
  ['ORDI', '0x193c739db502aadcef37c2589738b1e37bdb257d58cf1ab3c7ebc8e6df4e3ec0'],
  ['PEPE', '0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4'],
  ['POL', '0xffd11c5a1cfd42f80afb2df4d9f264c15f956d68153335374ec10722edd70472'],
  ['PYTH', '0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff'],
  ['RUNE', '0x5fcf71143bb70d41af4fa9aa1287e2efd3c5911cee59f909f915c9f61baacb1e'],
  ['SHIB', '0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a'],
  ['STX', '0xec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17'],
  ['TIA', '0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723'],
  ['UNI', '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501'],
  ['XLM', '0xb7a8eba68a997cd0210c2e1e4ee811ad2d174b3611c22d9ebf16f4cb7e9ba850'],
  ['XRP', '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8'],
  // collateral
  ['USDC', '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a'],
  ['USDE', '0x6ec879b1e9963de5ee97e9c8710b742d6228252a5e2ca12d4ae81d7fe5ee8c5d'],
  ['DAI', '0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd'],
]);

export const collateralMappingWithRegularSymbol = new Map<string, string>([
  ['seth', 'eth'],
  ['wbtc', 'btc'],
  ['fbtc', 'btc'],
  ['wsteth', 'eth'],
  ['fdai', 'dai'],
  ['susdc', 'usdc'],
  ['susde', 'usde'],
  ['steth', 'eth'],
  ['fsol', 'sol'],
  ['fusdc', 'usdc'],
  ['fusdt', 'usdt'],
  ['ssol', 'sol'],
  ['sdai', 'dai'],
  ['usdx', 'usdc'],
  ['stbtc', 'btc'],
]);
