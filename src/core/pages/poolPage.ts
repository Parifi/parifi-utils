import Decimal from 'decimal.js';
import { getAllVaults, getUserVaultData } from '../../subgraph/vaults';
import { DECIMAL_10, MAX_FEE } from '../../common';
import { UserVaultData } from '../../interfaces/sdkTypes';

// Add Vault and Position data for a user address. If the user has no vault deposits/withdrawals, it will
// return the user specific fields with 0 values. Other global values for vaults will be populated
export const getPoolPageData = async (subgraphEndpoint: string, userAddress: string): Promise<UserVaultData[]> => {
  const userVaultData: UserVaultData[] = [];
  const vaults = await getAllVaults(subgraphEndpoint);
  const vaultPositions = await getUserVaultData(subgraphEndpoint, userAddress);

  // Initialize UserVaultData object and populate values
  vaults.forEach((vault) => {
    const vaultPosition = vaultPositions.find((v) => v.vault?.id === vault.id);
    const assetBalance =
      (BigInt(vaultPosition?.sharesBalance ?? 0) * BigInt(vault.assetsPerShare ?? 0)) /
      BigInt(10 ** (vault.vaultDecimals ?? 1));

    // Calculate the PNL for each token based on the average mint price and the current price
    // of assets per share
    const pnlPerToken = new Decimal(vault.assetsPerShare ?? 0).minus(vaultPosition?.avgMintPrice ?? 0);

    const currentUnrealizedPNL = new Decimal(vaultPosition?.sharesBalance ?? 0)
      .times(pnlPerToken)
      .div(DECIMAL_10.pow(vault.vaultDecimals ?? 0));

    const userData: UserVaultData = {
      vaultId: vault.id ?? '0x',
      vaultSymbol: vault.vaultSymbol ?? 'pfERC20',
      withdrawalFee: Number(vault.withdrawalFee) ?? 0,
      withdrawalFeePercent: new Decimal(vault.withdrawalFee ?? 0).div(MAX_FEE),
      maxFee: MAX_FEE.toNumber(),
      asset: vault.depositToken?.id ?? '0x',
      assetBalance: assetBalance,
      vaultBalance: BigInt(vaultPosition?.sharesBalance ?? 0),
      totalShares: BigInt(vault.totalShares ?? 0),
      totalAssets: BigInt(vault.totalAssets ?? 0),
      userSharePercent: new Decimal(vaultPosition?.sharesBalance ?? 0).div(vault.totalShares ?? 1),
      cooldownStarted: BigInt(vaultPosition?.cooldownInitiatedTimestamp ?? 0),
      cooldownWindowInSeconds: BigInt(vault.cooldownPeriod ?? '0'),
      withdrawalWindowInSeconds: BigInt(vault.withdrawalWindow ?? '0'),
      totalAssetsGain: currentUnrealizedPNL.add(vaultPosition?.realizedPNL ?? 0),
      realizedPNL: new Decimal(vaultPosition?.realizedPNL ?? 0),
      unrealizedPNL: currentUnrealizedPNL,
      realizedPNLInUsd: new Decimal(vaultPosition?.realizedPNLInUsd ?? 0),
    };

    userVaultData.push(userData);
  });
  return userVaultData;
};
