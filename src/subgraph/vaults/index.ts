import { request } from 'graphql-request';
import { Vault } from '../../interfaces';
import { fetchAllVaultsQuery } from './subgraphQueries';
import { mapVaultsArrayToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';

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
