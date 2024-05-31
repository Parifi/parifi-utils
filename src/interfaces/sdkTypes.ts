import Decimal from 'decimal.js';

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
