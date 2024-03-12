////////////////////////////////////////////////////////////////
////////////////////    ENUMS     //////////////////////////////
////////////////////////////////////////////////////////////////
export enum OrderType {
  OPEN_NEW_POSITION,
  CLOSE_POSITION,
  INCREASE_POSITION,
  DECREASE_POSITION,
  CANCEL_ORDER,
}

export enum OrderStatus {
  PENDING,
  CANCELLED,
  SETTLED,
}

export enum PositionStatus {
  OPEN,
  CLOSED,
  LIQUIDATED,
}

////////////////////////////////////////////////////////////////
//////////////////////    ACCOUNT   ////////////////////////////
////////////////////////////////////////////////////////////////

export interface Account {
  // " User address "
  id?: string;

  // @note The below commented code is not required as they can be fetched
  // separately with another query. The code is kept commented here
  // to match the original subgraph schema
  // " User positions "
  // positions?: [Position]

  // " User orders "
  // orders?: [Order]

  // " Total count of orders "
  totalOrdersCount?: string;

  // " Total count of open user positions "
  openPositionsCount?: string;

  // " Total count of positions created by user - open and closed positions "
  totalPositionsCount?: string;

  // " Referral Fees claimed by partner/referrer in USD "
  referralFeesInUsd?: string;
}

////////////////////////////////////////////////////////////////
//////////////////////    MARKET    ////////////////////////////
////////////////////////////////////////////////////////////////

export interface Market {
  // " Market ID "
  id?: string;

  // " Vault Address "
  vaultAddress?: string;

  // " Deposit token (collateral token) "
  depositToken?: Token;

  // " Market status - true if active "
  isLive?: boolean;

  // " Market Decimals "
  marketDecimals?: string;

  // " Liquidation threshold "
  liquidationThreshold?: string;

  // " Minimum collateral required to open position "
  minCollateral?: string;

  // " Maximum leverage - 1e4 = 1x leverage "
  maxLeverage?: string;

  // " Opening fee in basis points "
  openingFee?: string;

  // " Closing fee in basis points "
  closingFee?: string;

  // " Liquidation fee (penalty) in basis points "
  liquidationFee?: string;

  // " Price deviation after which orders cannot be executed "
  maxPriceDeviation?: string;

  // " Market creation timestamp "
  createdTimestamp?: string;

  // " Last updated at "
  lastUpdated?: string;

  // " Maximum Open Interest "
  maxOpenInterest?: string;

  // " Total Longs "
  totalLongs?: string;

  // " Total Value of Longs in USD "
  avgPriceLongs?: string;

  // " Net PnL for Longs in USD "
  pnlLongs?: string;

  //  " Total Shorts "
  totalShorts?: string;

  // " Total Shorts in USD "
  avgPriceShorts?: string;

  // " Net PnL for Shorts in USD "
  pnlShorts?: string;

  // " Net PnL of the market in USD "
  netPnl?: string;

  // " Net PnL of the market in USD (decimal) "
  netPnlDec?: string;

  // " Total Open Interest in USD (decimal) "
  totalOI?: string;

  // " Total Open Interest (assets) "
  totalOIAssets?: string;

  // " If closeOnlyMode is true, no new positions can be opened. Only existing position can be closed "
  closeOnlyMode?: boolean;

  // " Timestamp when the cumulative fees were last updated "
  feeLastUpdatedTimestamp?: string;

  //  " Price deviation for Longs "
  priceDeviationLongs?: string;

  // " Price deviation for Shorts "
  priceDeviationShorts?: string;

  //  " Market utilization for Longs "
  utilizationLongs?: string;

  // " Market utilization for Shorts "
  utilizationShorts?: string;

  // " Market skew for Longs "
  marketSkew?: string;

  // " Cumulative Base Fees for Longs "
  baseFeeCumulativeLongs?: string;

  //  " Cumulative Base Fees for Shorts "
  baseFeeCumulativeShorts?: string;

  // " Cumulative Dynamic Fees for Long "
  dynamicFeeCumulativeLongs?: string;

  //  " Cumulative Dynamic Fees for Shorts "
  dynamicFeeCumulativeShorts?: string;

  // " Deviation Coefficient for liquidity curve "
  deviationCoeff?: string;

  // " Deviation constant for liquidity curve "
  deviationConst?: string;

  // " Base coefficient for base borrowing fees "
  baseCoeff?: string;

  // " Base constant for base borrowing fees "
  baseConst?: string;

  // " Maximum Dynamic borrowing fees "
  maxDynamicBorrowFee?: string;

  // " Dynamic coefficient for Dynamic borrowing fees "
  dynamicCoeff?: string;

  // " Market transaction creation hash "
  transactionHash?: string;

  // " Address of market creator "
  senderAddress?: string;

  // " Pyth Price Id "
  pyth?: PythData;
}

////////////////////////////////////////////////////////////////
//////////////////////    ORDERS    ////////////////////////////
////////////////////////////////////////////////////////////////

export interface Order {
  // " Order ID "
  id?: string;

  // " Market details for the created order "
  market?: Market;

  // " Account/Address of the order "
  user?: Account;

  // " 0 => OPEN, 1 => CLOSE, 2 => INCREASE, 3 => DECREASE "
  orderType?: OrderType;

  // " True if LONG order "
  isLong?: boolean;

  // " True if it is a limit order "
  isLimitOrder?: boolean;

  // " Used to indicate if the order should be triggered above or below the expectedPrice "
  triggerAbove?: boolean;

  // " Timestamp after which order cannot be executed, 0 in case of no deadline "
  deadline?: string;

  // " Timestamp after which order cannot be executed in string "
  deadlineISO?: string;

  // " Delta Collateral amount to create/increase/decrease position "
  deltaCollateral?: string;

  // " Delta position size to create/increase/decrease position "
  deltaSize?: string;

  // " Delta position size to create/increase/decrease position in USD "
  deltaSizeUsd?: string;

  // " Desired Value for order execution "
  expectedPrice?: string;

  // "Maximum allowed slippage in executionPrice from expectedPrice (in basis points)"
  maxSlippage?: string;

  // " Partner address that referred the order "
  partnerAddress?: string;

  // " Execution Fee "
  executionFee?: string;

  // " Transaction hash for order creation "
  txHash?: string;

  // " Order creation timestamp "
  createdTimestamp?: string;

  // " Status of the order (pending, cancelled, settled) "
  status?: OrderStatus;

  // " Order settlement tx hash "
  settledTxHash?: string;

  // " Order settlement timestamp "
  settledTimestamp?: string;

  // " Order settlement timestamp in ISO string "
  settledTimestampISO?: string;

  //  " Order Execution Price during settlement "
  executionPrice?: string;

  // " Order settled by "
  settledBy?: Account;

  // " Order cancellation tx hash "
  cancellationTxHash?: string;

  // " Related Position ID "
  positionId?: Position;
}

////////////////////////////////////////////////////////////////
//////////////////////    POSITION    //////////////////////////
////////////////////////////////////////////////////////////////
export interface Position {
  // " Position ID "
  id?: string;

  // " Market details for the position "
  market?: Market;

  // " User address "
  user?: Account;

  // " True if it is a LONG position "
  isLong?: boolean;

  // " Collateral amount deposited backing this position "
  positionCollateral?: string;

  // " Size of the position "
  positionSize?: string;

  // " Average price of the position "
  avgPrice?: string;

  // " Average price of the position in decimals "
  avgPriceDec?: string;

  // " Last cumulative fee that was charged "
  lastCumulativeFee?: string;

  // @note The below commented code is not required as they can be fetched
  // separately with another query. The code is kept commented here
  // to match the original subgraph schema
  // " Orders related to this position "
  // orders?: [Order]

  // " Position status "
  status?: PositionStatus;

  // " Creation tx hash "
  txHash?: string;

  // " Liquidation tx hash "
  liquidationTxHash?: string;

  // " Closing Price of the position. In case of liquidation, this is the liquidation price "
  closingPrice?: string;

  //  " Realized PNL in USD (decimals) "
  realizedPnl?: string;

  // " Realized PNL in collateral"
  realizedPnlCollateral?: string;

  // " Amount of opening, closing, liquidation and borrow fees paid in USD (decimals)"
  realizedFee?: string;

  // " Amount of opening, closing, liquidation and borrow fees paid in collateral"
  realizedFeeCollateral?: string;

  // " Net Realized PNL in usd (decimal) "
  netRealizedPnl?: string;

  // //" Timestamp when position was created "
  createdTimestamp?: string;

  // //" Last position updated timestamp "
  lastRefresh?: string;

  // " Last position updated timestamp in string "
  lastRefreshISO?: string;
}

////////////////////////////////////////////////////////////////
//////////////////////    TOKEN    /////////////////////////////
////////////////////////////////////////////////////////////////
export interface Token {
  // //" Smart contract address of the token "
  id?: string;

  // //" Token name "
  name?: string;

  // //" Token Symbol "
  symbol?: string;

  // //" The number of decimal places for token "
  decimals?: string;

  // //" Reference to Pyth and price data "
  pyth?: PythData;

  // //" To store price snapshots of the token on price updates from Pyth  "
  lastPriceUSD?: string;

  // //" Timestamp of lastPriceUsd "
  lastPriceTimestamp?: string;
}

////////////////////////////////////////////////////////////////
////////////////////////    PYTH    ////////////////////////////
////////////////////////////////////////////////////////////////

// Pyth price data interface for prices received from Pyth
export interface PythPrice {
  price: string;

  conf: string;

  expo: number;

  publish_time: number;
}

// Interface for response received for Pyth Price data
export interface PythPriceResponse {
  // Pyth Price ID
  id?: string;

  price: PythPrice;

  ema_price: PythPrice;
}

export interface PriceFeedSnapshot {
  //" Price ID + Timestamp "
  id?: string;

  //" Pyth network price ID "
  priceId?: string;

  //" Publish Timestamp "
  publishTime?: string;

  //" Price "
  price?: string;

  //" Price confidence "
  confidence?: string;
}

export interface PythData {
  // " Pyth Price ID for market/token "
  id?: string;

  // " Market ID "
  marketId?: string;

  // " Token Address "
  tokenAddress?: string;

  // " Price "
  price?: string;

  // " Last updated timestamp "
  lastUpdatedTimestamp?: string;
}

export interface BatchExecute {
  id: string;
  priceUpdateData: string[];
}

////////////////////////////////////////////////////////////////
//////////////////////    VAULTS    ////////////////////////////
////////////////////////////////////////////////////////////////

export interface Vault {
  // " ID - Address of the Vault contract "
  id?: string;

  // " Vault Name "
  vaultName?: string;

  // " Vault Symbol (e.g pfWETH, pfUSDC, etc.)"
  vaultSymbol?: string;

  // "Vault decimals "
  vaultDecimals?: number;

  // " Deposit token "
  depositToken?: Token;

  // " Vault Status - To indicate if deposits & withdrawals are enabled/disabled using pause/unpause"
  isPaused?: boolean;

  // " Fee Manager Address "
  feeManagerAddress?: string;

  // " Total assets currently deposited "
  totalAssets?: string;

  // " Total shares minted (i.e total supply of the shares token)"
  totalShares?: string;

  // " Assets received when 1 share token (with decimals) is redeemed for asset "
  assetsPerShare?: string;

  // " Assets received when 1 share token (with decimals) is redeemed for asset (in decimals)"
  assetsPerShareDec?: string;

  // " Shares received when 1 asset token (with decimals) is deposited to the vault "
  sharesPerAsset?: string;

  // " Withdrawal fee in basis points "
  withdrawalFee?: string;

  // " Fees received from Trader losses "
  profitFromTraderLosses?: string;

  // " Loss from Trader profits "
  lossFromTraderProfits?: string;

  // " Cooldown Period in seconds "
  cooldownPeriod?: string;

  // " Withdrawal Window in seconds"
  withdrawalWindow?: string;

  // Vault PNL info can be fetched using a separate query
  // to avoid nested data structure
  // vaultPnl?: [VaultPnl]
}

export interface VaultPosition {
  vault: Vault;
  sharesBalance: string;
  totalMinted: string;
  totalRedeemed: string;
  totalDeposited: string;
  totalWithdrawn: string;
  avgMintPrice: string;
  avgMintPriceDec: string;
  unrealizedPNL: string;
  realizedPNL: string;
  realizedPNLInUsd: string;
  id: string;
}

export interface VaultPositionsResponse {
  vaultPositions: VaultPosition[];
}
