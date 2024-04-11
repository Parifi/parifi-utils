import Decimal from 'decimal.js';

/// Interface to return portfolio total from the sdk
export type UserPortfolioData = {
  userAddress: string;
  realizedPnl: Decimal;
  unrealizedPnl: Decimal;
  depositedLiquidity: Decimal;
  depositedCollateral: Decimal;
};
