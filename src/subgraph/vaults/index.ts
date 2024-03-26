import { request } from 'graphql-request';
import { Vault, VaultPositionsResponse } from '../../interfaces';
import { fetchAllVaultsQuery, fetchUserAllVaultsQuery } from './subgraphQueries';
import { mapVaultsArrayToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { Chain as SupportedChain, availableVaultsPerChain } from '@parifi/references';

// import { arbitrumGoerli, polygon, arbitrum, base, arbitrumSepolia } from 'viem/chains';
// import { Chain } from 'viem';
import { PRICE_FEED_DECIMALS, getNormalizedPriceByIdFromPriceIdArray } from '../../common';
import Decimal from 'decimal.js';
import { getLatestPricesFromPyth, normalizePythPriceForParifi } from '../../pyth/pyth';
import { AxiosInstance } from 'axios';

// const matchChain: Record<SupportedChain, Chain> = {
//   [SupportedChain.ARBITRUM_SEPOLIA]: arbitrumSepolia,
// };

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
  });
  const myTotalPoolValue = data.reduce((a, b) => a + b.totalVaultValue, 0);
  return { data, myTotalPoolValue };
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
