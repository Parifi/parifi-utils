import Decimal from 'decimal.js';
import { AxiosInstance } from 'axios';
import { request } from 'graphql-request';

import { Vault, VaultPosition } from '../../interfaces';
import { fetchAllVaultsQuery, fetchUserVaultPositionsQuery, fetchVaultAprDetails } from './subgraphQueries';
import { mapVaultPositionsArrayToInterface, mapVaultsArrayToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';

import { DECIMAL_ZERO, PRICE_FEED_PRECISION } from '../../common';
import { getLatestPricesNormalized } from '../../pyth/pyth';

// Get all vaults from subgraph
export const getAllVaults = async (subgraphEndpoint: string): Promise<Vault[]> => {
  try {
    let subgraphResponse: any = await request(subgraphEndpoint, fetchAllVaultsQuery());
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
    const vaultDatas = subgraphResponse.vaultDailyDatas;

    // If no APR data found, return 0;
    if (vaultDatas.length == 0) {
      return { apr7Days, apr30Days, aprAllTime };
    } else {
      // Set All Time APR for the vault from response
      aprAllTime = vaultDatas[0].vault.allTimeApr;
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
    return { apr7Days: apr7Days.div(7), apr30Days: apr30Days.div(30), aprAllTime: aprAllTime };
  } catch (error) {
    throw error;
  }
};
