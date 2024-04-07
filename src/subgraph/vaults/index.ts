import { request } from 'graphql-request';
import { Vault, VaultPosition, VaultPositionsResponse } from '../../interfaces';
import { fetchAllVaultsQuery, fetchMultiUserAllVaultsQuery, fetchUserAllVaultsQuery, fetchVaultAprDetails } from './subgraphQueries';
import { mapVaultsArrayToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { Chain as SupportedChain, availableVaultsPerChain } from '@parifi/references';

import { DECIMAL_ZERO, PRICE_FEED_DECIMALS, getNormalizedPriceByIdFromPriceIdArray } from '../../common';
import Decimal from 'decimal.js';
import { getLatestPricesFromPyth, normalizePythPriceForParifi } from '../../pyth/pyth';
import { AxiosInstance } from 'axios';

interface VaultData {
  userAddress: string;
  vaults: VaultPosition[];
}


interface TotalPoolsValueData {
  myBalance: number;
  normalizedPrice: Decimal;
  Symbol: string | undefined;
  priceId: string | undefined;
  totalVaultValue: number;
}

interface MultiUserTotalPoolsValue {
  userAddress: string;
  data: TotalPoolsValueData[] | 0;
  myTotalPoolValue: number;
}

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

export const getVaultDataByChain = async (chainId: SupportedChain, subgraphEndpoint: string) => {
  const vaults = await getAllVaults(subgraphEndpoint);

  return vaults.map((vault) => {
    const vaultAddress = availableVaultsPerChain[chainId].find(
      (vaultA) => vaultA.toLowerCase() === vault?.id?.toLowerCase(),
    );
    return {
      ...vault,
      id: vaultAddress ?? vault.id,
    };
  });
};

export const getUserVaultDataByChain = async (chainId: SupportedChain, subgraphEndpoint: string, user: string) => {
  let subgraphResponse: any = await request(subgraphEndpoint, fetchUserAllVaultsQuery(user));
  const vaults: VaultPositionsResponse = subgraphResponse;
  if (vaults.vaultPositions.length === 0) {
    return [];
  }
  return vaults.vaultPositions.map((vault) => {
    const vaultAddress = availableVaultsPerChain[chainId].find(
      (vaultA) => vaultA.toLowerCase() === vault.vault?.id?.toLowerCase(),
    );
    return {
      ...vault,
      vault: { ...vault.vault, id: vaultAddress ?? vault.vault.id },
    };
  });
};

export const getMultiUserVaultDataByChain = async (chainId: SupportedChain, subgraphEndpoint: string, userAddresses: string[]): Promise<VaultData[]> => {
  let subgraphResponse: VaultPositionsResponse = await request(subgraphEndpoint, fetchMultiUserAllVaultsQuery(userAddresses));
  const result = userAddresses.map((userAddress: string) => {
    const vaultPositionsByUser = subgraphResponse.vaultPositions.filter((vault) => vault.user.id === userAddress);
    if (!vaultPositionsByUser.length) return {userAddress, vaults: []}
    const _vaults =  vaultPositionsByUser.map((vault) => {
      const vaultAddress = availableVaultsPerChain[chainId].find(
        (vaultA) => vaultA.toLowerCase() === vault.vault?.id?.toLowerCase(),
      );
      return {
        ...vault,
        vault: { ...vault.vault, id: vaultAddress ?? vault.vault.id },
      };
    });
    return {userAddress, vaults: _vaults}
  });
  return result;
};

const calculateUserTotalPoolValue = async (vaults: VaultPosition[], pythClient: AxiosInstance): Promise<{data: TotalPoolsValueData[]; myTotalPoolValue: number}> => {
  const priceIds = vaults.map((v) => v.vault.depositToken?.pyth?.id);
  const res = await getLatestPricesFromPyth(priceIds as string[], pythClient);
  const priceInfos = res.map((pythPrice) => {
    const normalizedPrice = normalizePythPriceForParifi(Number(pythPrice.price.price), pythPrice.price.expo);
    const collateralPrice = new Decimal(normalizedPrice).div(10 ** PRICE_FEED_DECIMALS);
    const returnObj = { priceId: `0x${pythPrice.id}`, normalizedPrice: collateralPrice };
    return returnObj;
  });

  const data = vaults.map((vault) => {
    const normalizedPrice = getNormalizedPriceByIdFromPriceIdArray(
      vault.vault.depositToken?.pyth?.id as string,
      priceInfos,
    );
    const vaultPerShare = vault.vault.assetsPerShare;
    const userShare = vault.sharesBalance;
    const myBalance =
      (Number(userShare || 0) * Number(vaultPerShare || 0)) /
      Number(10 ** (vault.vault?.vaultDecimals || 18)) /
      Number(10 ** parseInt(vault.vault.depositToken?.decimals || ''));

    const totalVaultValue = myBalance * Number(normalizedPrice);
    const returnObj = {
      myBalance: myBalance,
      normalizedPrice: normalizedPrice,
      Symbol: vault.vault.depositToken?.symbol,
      priceId: vault.vault.depositToken?.pyth?.id,
      totalVaultValue: totalVaultValue,
    };
    return returnObj;
  }) as TotalPoolsValueData[];
  const myTotalPoolValue = data.reduce((a, b) => a + b.totalVaultValue, 0);
  return {data, myTotalPoolValue};
};

export const getUserTotalPoolsValue = async (
  userAddress: string,
  chainId: SupportedChain,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
) => {
  const vaults = await getUserVaultDataByChain(chainId, subgraphEndpoint, userAddress);
  if (vaults.length === 0) {
    return { data: 0, myTotalPoolValue: 0 };
  }
  const { data, myTotalPoolValue } = await calculateUserTotalPoolValue(vaults, pythClient);
  return { data, myTotalPoolValue };
};

export const getMultiUserTotalPoolsValue = async (
  userAddresses: string[],
  chainId: SupportedChain,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
): Promise<MultiUserTotalPoolsValue[]> => {
  const vaultsData = await getMultiUserVaultDataByChain(chainId, subgraphEndpoint, userAddresses);
  const result: MultiUserTotalPoolsValue[] = [];
  for (const userAddr of userAddresses) {
    const vaultsByUser = vaultsData.find((vault) => vault.userAddress === userAddr);
    const {userAddress, vaults} = vaultsByUser as VaultData;
    if (!vaults.length) {
      result.push({ userAddress, data: 0, myTotalPoolValue: 0 });
    }
    const { data, myTotalPoolValue } = await calculateUserTotalPoolValue(vaults, pythClient);
    result.push({ userAddress, data, myTotalPoolValue });
  };
  return result;
};

export const getTotalPoolsValue = async (
  chainId: SupportedChain,
  subgraphEndpoint: string,
  pythClient: AxiosInstance,
) => {
  const vaults = await getVaultDataByChain(chainId, subgraphEndpoint);
  const priceIds = vaults.map((v) => v.depositToken?.pyth?.id);
  const res = await getLatestPricesFromPyth(priceIds as string[], pythClient);
  const priceInfos = res.map((pythPrice) => {
    const normalizedPrice = normalizePythPriceForParifi(Number(pythPrice.price.price), pythPrice.price.expo);
    const collateralPrice = new Decimal(normalizedPrice).div(10 ** PRICE_FEED_DECIMALS);
    const returnObj = { priceId: `0x${pythPrice.id}`, normalizedPrice: collateralPrice };
    return returnObj;
  });

  const data = vaults.map((vault) => {
    const normalizedPrice = getNormalizedPriceByIdFromPriceIdArray(vault.depositToken?.pyth?.id as string, priceInfos);
    const totatVaultValue = (Number(vault.totalAssets) / 10 ** (vault.vaultDecimals || 18)) * Number(normalizedPrice);
    const returnObj = {
      totalAssets: vault.totalAssets,
      decimal: vault.vaultDecimals,
      normalizedPrice: normalizedPrice,
      Symbol: vault.depositToken?.symbol,
      priceId: vault.depositToken?.pyth?.id,
      totatVaultValue: totatVaultValue,
    };
    return returnObj;
  });
  const totalPoolValue = data.reduce((a, b) => a + b.totatVaultValue, 0);
  return { data, totalPoolValue };
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
    console.log(subgraphResponse);
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
