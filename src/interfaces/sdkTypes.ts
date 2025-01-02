import Decimal from 'decimal.js';
import { OrderStatus, PositionStatus, PythData, SnxAccountType } from './subgraphTypes';

////////////////////////////////////////////////////////////////
//////////////////////    Wallet   ////////////////////////////
////////////////////////////////////////////////////////////////

export type Wallet = {
  id: string;
  snxAccounts?: [SnxAccount];
};

////////////////////////////////////////////////////////////////
////////////////////    SNX Account   //////////////////////////
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
///////////////////////    Portfolio   /////////////////////////
////////////////////////////////////////////////////////////////

/// Interface to return portfolio total from the sdk
export type UserPortfolioData = {
  userAddress?: string;
  realizedPnl?: Decimal;
  unrealizedPnl?: Decimal;
  depositedLiquidity?: Decimal;
  depositedCollateral?: Decimal;
};

export interface ReferralRewardsInUsd {
  userAddress?: string;
  totalReferralRewardsInUsd?: Decimal;
  unclaimedReferralRewardsUsdc?: BigInt;
  unclaimedReferralRewardsWeth?: BigInt;
}

// Interface to return account specific data for Leaderboard stats
export interface LeaderboardUserData {
  userAddress?: string;
  totalOrdersCount?: number;
  totalPositionsCount?: number;
  countProfitablePositions?: number;
  countLossPositions?: number;
  countLiquidatedPositions?: number;
  totalVolumeInUsd?: Decimal;
  totalVolumeInUsdLongs?: Decimal;
  totalVolumeInUsdShorts?: Decimal;
  totalRealizedPnlPositions?: Decimal;
  totalAccruedBorrowingFeesInUsd?: Decimal;
}

export type Token = {
  id: string;
  name?: string;
  symbol?: string;
  decimals?: string;
  pyth?: PythData;
  lastPriceUSD?: string;
  lastPriceTimestamp?: string;
};
