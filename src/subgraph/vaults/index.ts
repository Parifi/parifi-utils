import Decimal from 'decimal.js';
import { AxiosInstance } from 'axios';
import { request } from 'graphql-request';

import { Vault, VaultCooldown, VaultPosition } from '../../interfaces';
import {
  fetchAllVaultsQuery,
  fetchCooldownDetails,
  fetchUserVaultPositionsQuery,
  fetchVaultAprDetails,
  fetchVaultVolumeData,
} from './subgraphQueries';
import {
  mapVaultCooldownArrayToInterface,
  mapVaultPositionsArrayToInterface,
  mapVaultsArrayToInterface,
} from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';

import { DECIMAL_ZERO, PRICE_FEED_PRECISION } from '../../common';
import { getLatestPricesNormalized } from '../../pyth/pyth';

// Get all vaults from subgraph
export const getAllVaults = async (subgraphEndpoint: string): Promise<Vault[]> => {
  try {
    let subgraphResponse: any = await request(subgraphEndpoint, fetchAllVaultsQuery());
    if (!subgraphResponse) throw Error(`Error While Fechting All Vaults`);
    const vaults = mapVaultsArrayToInterface(subgraphResponse);
    if (vaults && vaults?.length != 0) {
      return vaults;
    }
    throw new NotFoundError('Vaults not found');
  } catch (error) {
    throw error;
  }
};

export const getUserVaultData = async (subgraphEndpoint: string, user: string): Promise<VaultPosition[]> => {
  try {
    interface VaultPositionsResponse {
      vaultPositions: VaultPosition[];
    }

    let subgraphResponse: any = await request(subgraphEndpoint, fetchUserVaultPositionsQuery(user));
    if (!subgraphResponse) throw Error(`Error While Fechting User Vault Data`);
    const vaultPositions = mapVaultPositionsArrayToInterface(subgraphResponse);
    if (vaultPositions === undefined || vaultPositions?.length === 0) {
      return [];
    }
    return vaultPositions;
  } catch (error) {
    throw error;
  }
};

export const getUserTotalPoolsValue = async (
  subgraphEndpoint: string,
  userAddress: string,
  pythClient: AxiosInstance,
): Promise<{ userTotalPoolsValue: Decimal }> => {
  try {
    // Interface to map fetched data
    interface VaultPositionsResponse {
      vaultPositions: {
        user: {
          id: string;
        };
        vault: {
          id: string;
          assetsPerShare: string;
          sharesPerAsset: string;
          depositToken: {
            decimals: string;
            pyth: {
              id: string;
              price: string;
            };
          };
        };
        sharesBalance: string;
      }[];
    }

    /// Dictionary to store the final result of data
    let userTotalPoolsValue: Decimal = DECIMAL_ZERO;

    const query = fetchUserVaultPositionsQuery(userAddress);
    const subgraphResponse = await request(subgraphEndpoint, query);
    if (!subgraphResponse) throw new Error('While While Fechting User Total Pools Value');
    const mappedRes: VaultPositionsResponse = subgraphResponse as unknown as VaultPositionsResponse;

    const priceIds = mappedRes.vaultPositions.map((v) => v.vault.depositToken?.pyth?.id);
    const normalizedPythPrices = await getLatestPricesNormalized(priceIds as string[], pythClient);

    mappedRes.vaultPositions.map(async (vaultPosition) => {
      // Convert deposited liquidity amount to USD
      const sharesBalance = new Decimal(vaultPosition.sharesBalance);
      const tokenDecimalsFactor = new Decimal(10).pow(vaultPosition.vault.depositToken.decimals);
      const pythPrice = new Decimal(vaultPosition.vault.depositToken.pyth.price);

      const normalizedPrice = normalizedPythPrices.find(
        (prices) => prices.priceId === vaultPosition.vault.depositToken?.pyth?.id,
      )?.normalizedPrice;

      const amountUsd: Decimal = sharesBalance
        .mul(new Decimal(vaultPosition.vault.assetsPerShare))
        .mul(new Decimal(normalizedPrice ?? '0'))
        .div(PRICE_FEED_PRECISION)
        .div(tokenDecimalsFactor)
        .div(tokenDecimalsFactor);

      userTotalPoolsValue = userTotalPoolsValue.add(amountUsd);
    });

    return { userTotalPoolsValue };
  } catch (error) {
    throw error;
  }
};

export const getTotalPoolsValue = async (
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
): Promise<{ totalPoolsValue: Decimal }> => {
  const vaults = await getAllVaults(subgraphEndpoint);
  const priceIds = vaults.map((v) => v.depositToken?.pyth?.id);
  const normalizedPythPrices = await getLatestPricesNormalized(priceIds as string[], pythClient);

  let totalPoolsValue: Decimal = DECIMAL_ZERO;

  vaults.map((vault) => {
    const normalizedPrice = normalizedPythPrices.find(
      (prices) => prices.priceId === vault.depositToken?.pyth?.id,
    )?.normalizedPrice;

    if (normalizedPrice) {
      const depositsInUsd = new Decimal(vault.totalAssets as string)
        .mul(normalizedPrice)
        .div(PRICE_FEED_PRECISION)
        .div(new Decimal(10).pow(vault.vaultDecimals || 18));
      totalPoolsValue = totalPoolsValue.add(depositsInUsd);
    }
  });
  return { totalPoolsValue };
};

export const getVaultApr = async (
  subgraphEndpoint: string,
  vaultId: string,
): Promise<{ apr7Days: Decimal; apr30Days: Decimal; aprAllTime: Decimal }> => {
  // Interface for subgraph response
  interface VaultAprInterface {
    vaultDailyDatas: {
      apr: Decimal;
      vault: {
        allTimeApr: Decimal;
      };
    }[];
  }

  let apr7Days: Decimal = DECIMAL_ZERO;
  let apr30Days: Decimal = DECIMAL_ZERO;
  let aprAllTime: Decimal = DECIMAL_ZERO;

  try {
    const subgraphResponse: VaultAprInterface = await request(subgraphEndpoint, fetchVaultAprDetails(vaultId));
    if (!subgraphResponse) throw new Error('While While Fechting VaultApr');
    const vaultDatas = subgraphResponse.vaultDailyDatas;

    // If no APR data found, return 0;
    if (vaultDatas.length == 0) {
      return { apr7Days, apr30Days, aprAllTime };
    } else {
      // Set All Time APR for the vault from response
      aprAllTime = vaultDatas[0].vault.allTimeApr;
    }

    // If less than 7 days data for APR is available, return average APR of available data
    if (vaultDatas.length < 7) {
      const sumApr = vaultDatas.reduce((accumulator, currentValue) => {
        if (currentValue !== null) {
          return accumulator + Number(currentValue.apr);
        } else {
          return accumulator; // Skip null values
        }
      }, 0);
      apr7Days = new Decimal(sumApr).div(vaultDatas.length);
      return { apr7Days, apr30Days, aprAllTime };
    }

    /// Calculate the APR of vault based on timeframe data. If enough data points are not available,
    /// the value is set to 0;
    for (let index = 0; index < vaultDatas.length; index++) {
      const vaultData = vaultDatas[index];

      // Do not calculate 7 day APR if less than 7 days of data is available
      if (index < 7 && vaultDatas.length >= 7) {
        apr7Days = apr7Days.add(vaultData.apr);
      }

      // Do not calculate 30 day APR if less than 30 days of data is available
      if (index < 30 && vaultDatas.length >= 30) {
        apr30Days = apr30Days.add(vaultData.apr);
      }
    }
    return { apr7Days: apr7Days.mul(365).div(7), apr30Days: apr30Days.mul(365).div(30), aprAllTime: aprAllTime };
  } catch (error) {
    // Instead of throwing error in case of a failure,
    // the function will instead return gracefully with 0 values and console log the error
    console.log(error);
    return { apr7Days, apr30Days, aprAllTime };
  }
};

export const getUserVaultCoolDowns = async (
  subgraphEndpoint: string,
  userAddress: string,
): Promise<VaultCooldown[]> => {
  const response = await request(subgraphEndpoint, fetchCooldownDetails(userAddress));
  if (!response) throw new Error('While While Fechting User Vault Cool Downs');
  const vaultCooldowns = mapVaultCooldownArrayToInterface(response);
  if (vaultCooldowns) {
    return vaultCooldowns;
  }
  return [];
};

// Returns the Last 24 hour volume for the vaults in USD
export const getPoolVolume24h = async (subgraphEndpoint: string): Promise<{ [vaultId: string]: Decimal }> => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const oneDayInSeconds = 60 * 60 * 24;

  interface VaultTransaction {
    vault: {
      id: string;
    };
    timestamp: string;
    amountUSD: string;
  }

  interface VaultResponse {
    vaultDeposits: VaultTransaction[];
    vaultWithdraws: VaultTransaction[];
  }

  const query = fetchVaultVolumeData(currentTimestamp - oneDayInSeconds);
  const transactions: VaultResponse = await request(subgraphEndpoint, query);
  const volumeByVault: { [vaultId: string]: Decimal } = {};
  if (!transactions) throw new Error('While Fechting Vault Volume Data');
  // Calculate the sum of USD value of all deposit transactions
  transactions.vaultDeposits.forEach((deposit) => {
    if (!volumeByVault[deposit.vault.id]) {
      volumeByVault[deposit.vault.id] = DECIMAL_ZERO;
    }
    volumeByVault[deposit.vault.id] = volumeByVault[deposit.vault.id].add(deposit.amountUSD);
  });

  // Calculate the sum of USD value of all withdraw transactions
  transactions.vaultWithdraws.forEach((withdrawal) => {
    if (!volumeByVault[withdrawal.vault.id]) {
      volumeByVault[withdrawal.vault.id] = DECIMAL_ZERO;
    }
    volumeByVault[withdrawal.vault.id] = volumeByVault[withdrawal.vault.id].add(withdrawal.amountUSD);
  });

  return volumeByVault;
};
