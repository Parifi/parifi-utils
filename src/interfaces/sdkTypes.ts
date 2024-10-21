import Decimal from 'decimal.js';
import { OrderStatus, PositionStatus, PythData, SnxAccountType } from './subgraphTypes';

/// Interface to return portfolio total from the sdk
export type UserPortfolioData = {
  userAddress: string;
  realizedPnl: Decimal;
  unrealizedPnl: Decimal;
  depositedLiquidity: Decimal;
  depositedCollateral: Decimal;
};

export interface NormalizedPrice {
  priceId: string;
  normalizedPrice: Decimal;
}
export interface UserVaultData {
  vaultId: string; // Address of the vault contract
  vaultSymbol: string; // Vault Symbol eg. pfUSDC, pfWETH
  withdrawalFee: number; // // Withdrawal fee with decimals, 100% = 10_000_000
  withdrawalFeePercent: Decimal;
  maxFee: number; // Constant = 10_000_000
  asset: string; // Address of the vault deposit token
  assetBalance: bigint; // User balance of deposited asset after conversion at current rates
  vaultBalance: bigint; // User balance of vault shares in vault tokens, eg. in pfUSDC
  totalShares: bigint; // Total shares minted by the vault
  totalAssets: bigint; // Total assets deposited in the vault
  userSharePercent: Decimal; // Users percentage holding of shares compared to the total shares
  cooldownStarted: bigint; // Timestamp when the cooldown was started
  cooldownWindowInSeconds: bigint; // Waiting period for cooldown in seconds
  withdrawalWindowInSeconds: bigint; // Time in seconds after cooldown when deposited assets can be withdrawn
  totalAssetsGain: Decimal;
  realizedPNL: Decimal;
  unrealizedPNL: Decimal;
  realizedPNLInUsd: Decimal;
}

export interface ReferralRewardsInUsd {
  userAddress: string;
  totalReferralRewardsInUsd: Decimal;
  unclaimedReferralRewardsUsdc: BigInt;
  unclaimedReferralRewardsWeth: BigInt;
}

// Interface to return account specific data for Leaderboard stats
export interface LeaderboardUserData {
  userAddress: string;
  totalOrdersCount: number;
  totalPositionsCount: number;
  countProfitablePositions: number;
  countLossPositions: number;
  countLiquidatedPositions: number;
  totalVolumeInUsd: Decimal;
  totalVolumeInUsdLongs: Decimal;
  totalVolumeInUsdShorts: Decimal;
  totalRealizedPnlPositions: Decimal;
  totalAccruedBorrowingFeesInUsd: Decimal;
}

export type Market = {
  id: string;
  marketName: string;
  marketSymbol: string;
  marketPrice: string;
  feedId: string;
  size: string;
  skew: string;
  maxOpenInterest: string;
  maxMarketValue: string;
  interestRate: string;
  currentFundingRate: string;
  currentFundingVelocity: string;
  indexPrice: string;
  maxFundingVelocity: string;
  skewScale: string;
  makerFee: string;
  takerFee: string;
  initialMarginRatioD18: string;
  minimumPositionMargin: string;
  maintenanceMarginRatioD18: string;
  minimumInitialMarginRatioD18: string;
};

export type Wallet = {
  id: string;
  positions?: Position[];
  orders?: Order[];
  totalOrdersCount: string;
  totalPositionsCount: string;
  openPositionCount: string;
  countProfitablePositions: string;
  countLossPositions: string;
  countLiquidatedPositions: string;
  totalRealizedPnlPositions: string;
  totalVolumeInUsd: string;
  totalVolumeInUsdLongs: string;
  totalVolumeInUsdShorts: string;
  totalAccruedBorrowingFeesInUsd?: string;
};

export type Order = {
  id: string;
  market?: Market;
  user?: Wallet;
  isLimitOrder: boolean;
  expectedPrice: string;
  expectedPriceTime?: string;
  settlementTime?: string;
  deadline: string;
  trackingCode?: string;
  deltaCollateral: string;
  deltaSize: string;
  deltaSizeUsd: string;
  executionPrice: string;
  executionFee: string;
  referralFees?: string;
  txHash: string;
  createdTimestamp: string;
  status: OrderStatus;
  settledTxHash?: string;
  settledTimestamp?: string;
  settledTimestampISO: string;
  settledBy?: Wallet;
  positionId?: Position;
  formattedDeltaSize?: string;
  formattedExecutionPrice?: string;
  formateedExpectedPrice?: string;
  snxAccount?: {
    id?: string;
    accountId?: string;
  };
  depositCollateral?: DepositCollateral[];
};

export type DepositCollateral = {
  id: string;
  depositedAmount: string;
  collateralName: string;
  collateralSymbol: string;
  collateralDecimals: string;
  collateralAddress: string;
  snxAccount: {
    id: string;
    accountId: string;
  };
  formattedDepositedAmount: string;
};

export type Position = {
  id: string;
  market?: Market;
  user?: Wallet;
  isLong: boolean;
  positionCollateral: string;
  positionSize: string;
  avgPrice: string;
  formattedAvgPrice: string;
  orders?: Order[];
  status: PositionStatus;
  txHash: string;
  liquidationTxHash?: string;
  closingPrice?: string;
  formattedClosingPrice?: string;
  realizedPnl: string;
  realizedFee: string;
  formattedRealizedFee: string;
  netRealizedPnl: string;
  createdTimestamp: string;
  lastRefresh: string;
  lastRefreshISO: string;
  accruedBorrowingFees: string;
  canBeLiquidated: boolean;
  snxAccount?: {
    id?: string;
    accountId?: string;
  };
  depositCollateral?: DepositCollateral[];
};

export type Token = {
  id?: string;
  name?: string;
  symbol?: string;
  decimals?: string;
  pyth?: PythData;
  lastPriceUSD?: string;
  lastPriceTimestamp?: string;
};

export type SnxAccount = {
  id: string;
  type: SnxAccountType;
  accountId: string;
  owner: Wallet;
  totalOrdersCount: string;
  totalPositionsCount: string;
  orders: Order[];
};
