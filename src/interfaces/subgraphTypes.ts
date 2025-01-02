//// NOTE: All fields from the subgraph interfaces have their type as string
//// and are marked as optional. This is because the logic to fetch these data might
//// differ based on the requirement or function, and only required fields are fetched
//// with queries to keep it concise and avoid fetching unnecessary data.

////////////////////////////////////////////////////////////////
////////////////////    ENUMS     //////////////////////////////
////////////////////////////////////////////////////////////////
export enum OrderType {
  OPEN_NEW_POSITION = 'OPEN_NEW_POSITION',
  CLOSE_POSITION = 'CLOSE_POSITION',
  INCREASE_POSITION = 'INCREASE_POSITION',
  DECREASE_POSITION = 'DECREASE_POSITION',
  CANCEL_ORDER = 'CANCEL_ORDER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  SETTLED = 'SETTLED',
  INVALID = 'INVALID',
}

export enum PositionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  LIQUIDATED = 'LIQUIDATED',
}
export enum SnxAccountType {
  /** Core Proxy Account */
  CORE = 'CORE',

  /** Perps Market Proxy Account */
  PERP = 'PERP',
}

////////////////////////////////////////////////////////////////
//////////////////////    ACCOUNT   ////////////////////////////
////////////////////////////////////////////////////////////////

export interface Wallet {
  /** User wallet address */
  id?: string;

  snxAccounts?: [SnxAccount];
}
////////////////////////////////////////////////////////////////
////////////////////// SNX ACCOUNT //////////////////////////
////////////////////////////////////////////////////////////////
export type SnxAccount = {
  id: string;
  type?: SnxAccountType;
  accountId?: string;
  owner?: Wallet;
  totalOrdersCount?: string;
  totalPositionsCount?: string;
  openPositionCount?: string;
  countProfitablePositions?: string;
  countLossPositions?: string;
  countLiquidatedPositions?: string;
  totalRealizedPnlPositions?: string;
  totalVolumeInUsd?: string;
  totalVolumeInUsdLongs?: string;
  totalVolumeInUsdShorts?: string;
  totalAccruedBorrowingFeesInUsd?: string;
  integratorFeesGenerated?: string;
  orders?: [Order];
  positions?: [Position];
  collateralDeposits?: [CollateralDeposit];
};

////////////////////////////////////////////////////////////////
////////////////////    Collaterals   //////////////////////////
////////////////////////////////////////////////////////////////

export type CollateralDeposit = {
  id: string;
  snxAccountId?: string; // " SNX Account id including the type PERP/CORE"
  collateralId?: string;
  collateralName?: string;
  collateralSymbol?: string;
  collateralDecimals?: string;
  collateralAddress?: string;
  currentDepositedAmount?: string;
  totalAmountDeposited?: string;
  totalAmountWithdrawn?: string;
  totalAmountLiquidated?: string;
};

export type Synth = { id: string; name?: string; symbol?: string; decimals?: number; synthAddress?: string };

////////////////////////////////////////////////////////////////
/////////////////////////    Market   //////////////////////////
////////////////////////////////////////////////////////////////

export type Market = {
  id: string;
  marketName?: string;
  marketSymbol?: string;
  feedId?: string;
  skew?: string;
  size?: string;
  maxOpenInterest?: string;
  interestRate?: string;
  currentFundingRate?: string;
  currentFundingVelocity?: string;
  indexPrice?: string;
  skewScale?: string;
  maxFundingVelocity?: string;
  makerFee?: string;
  takerFee?: string;
  maxMarketValue?: string;
  marketPrice?: string;
  initialMarginRatioD18?: string;
  maintenanceMarginRatioD18?: string;
  minimumInitialMarginRatioD18?: string;
  flagRewardRatioD18?: string;
  minimumPositionMargin?: string;
};

////////////////////////////////////////////////////////////////
/////////////////////////    Orders   //////////////////////////
////////////////////////////////////////////////////////////////

export type Order = {
  id: string;
  market?: Market;
  snxAccountId?: string; // " SNX Account id including the type PERP/CORE"
  isLimitOrder?: boolean;
  acceptablePrice?: string;
  commitmentTime?: string;
  expectedPriceTime?: string;
  settlementTime?: string;
  expirationTime?: string;
  trackingCode?: string;
  deltaSize?: string;
  deltaSizeUsd?: string;
  executionPrice?: string;
  collectedFees?: string;
  settlementReward?: string;
  referralFees?: string;
  partnerAddress?: string;
  txHash?: string;
  createdTimestamp?: string;
  status?: OrderStatus;
  settledTxHash?: string;
  settledTimestamp?: string;
  settledTimestampISO: string;
  settledBy?: Wallet;
};

////////////////////////////////////////////////////////////////
///////////////////////    Positions   /////////////////////////
////////////////////////////////////////////////////////////////

export type Position = {
  id: string;
  market?: Market;
  snxAccountId?: string; // " SNX Account id including the type PERP/CORE"
  isLong?: boolean;
  positionSize?: string;
  avgPrice?: string;
  avgPriceDec?: string;
  status?: PositionStatus;
  txHash?: string;
  liquidationTxHash?: string;
  closingPrice?: string;
  realizedPnl?: string;
  realizedFee?: string;
  netRealizedPnl?: string;
  createdTimestamp?: string;
  lastRefresh?: string;
  lastRefreshISO?: string;
  accruedBorrowingFees?: string;
  canBeLiquidated?: boolean;
};

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

  // //" The string of decimal places for token "
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
  id: string;

  price: PythPrice;

  ema_price: PythPrice;
}

// " The entity saves all the price feed updates on-chain (by Parifi) "
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

// " Pyth Feeds for Parifi market IDs/Token addresses "
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

export interface collateralDepositsPortfolioData {
  depositedAmount: string;
  collateralSymbol: string;
  collateralName: string;
  collateralDecimals: string;
}

export interface positionsPortfolio {
  snxAccount?: { accountId: string };
  status: string;
  market: {
    marketSymbol: string;
  };
  positionSize: string;
  avgPrice: string;
  realizedPnl: string;
  realizedFee: string;
  user?: {
    id: string;
  };
}

export interface PortfolioWallet {
  id: string; // Wallet ID
  snxAccounts: Array<{
    collateralDeposits: collateralDepositsPortfolioData[];
    positions: positionsPortfolio[];
  }>;
}
export interface PorfolioDataSubgraph {
  wallets: PortfolioWallet[]; // Array of Wallet objects
}

export type PriceObject = {
  id: string;
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
};

export type LeaderBoardClosedPosition = {
  id: string;
  user: {
    id: string;
  };
  positionSize: string;
  avgPriceDec: string;
  status: string;
  netRealizedPnl: string;
  realizedPnl: string;
  snxAccount: {
    accountId: string;
  };
};

export type LeaderBoardOpenPosition = {
  positionSize: string;
  avgPriceDec: string;
  id: string;
  market: {
    id: string;
  };
  user: {
    id: string;
  };
  snxAccount: {
    id: string;
    accountId: string;
  };
};

export type LiquidatePositionCollateral = {
  accountId: string;
  collateralDeposits: collateralDepositsPortfolioData[];
};
