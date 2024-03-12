import { request } from 'graphql-request';
import { Vault, VaultPosition, VaultPositionsResponse } from '../../interfaces';
import { fetchAllVaultsQuery, fetchUserAllVaultsQuery } from './subgraphQueries';
import { mapVaultsArrayToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { Chain as SupportedChain, availableVaultsPerChain } from '@parifi/references';

import { arbitrumGoerli, polygon, arbitrum, base, arbitrumSepolia } from 'viem/chains';
import { Chain } from 'viem';

const matchChain: Record<SupportedChain, Chain> = {
  [SupportedChain.ARBITRUM_GOERLI]: arbitrumGoerli,
  [SupportedChain.ARBITRUM_SEPOLIA]: arbitrumSepolia,
  [SupportedChain.ARBITRUM]: arbitrum,
  [SupportedChain.POLYGON]: polygon,
  [SupportedChain.BASE]: base,
};

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

export const getChainVaultData = async (chainId: SupportedChain, subgraphEndpoint: string) => {
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
