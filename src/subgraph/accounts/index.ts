import Decimal from 'decimal.js';
import { request } from 'graphql-request';
import { fetchMultiUserRealizedPnlData, fetchRealizedPnlData } from './subgraphQueries';

interface Account {
  id: string;
  totalRealizedPnlPositions: string;
  totalRealizedPnlVaults: string;
}


interface RealizedPnlSubgraphResponse {
  account: Account;
}


interface MultiUserRealizedPnlSubgraphResponse {
  accounts: Account[];
}

export interface RealizedPnlForMultipleUsers {
  userAddress: string,
  totalRealizedPnlPositions: Decimal | undefined;
  totalRealizedPnlVaults: Decimal | undefined;
}

/// Returns the Realized PNL for positions and vaults for a user address
export const getRealizedPnlForUser = async (
  subgraphEndpoint: string,
  userAddress: string,
): Promise<{
  totalRealizedPnlPositions: Decimal;
  totalRealizedPnlVaults: Decimal;
}> => {
  try {
    const query = fetchRealizedPnlData(userAddress);
    const subgraphResponse: RealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);

    const totalRealizedPnlPositions = new Decimal(subgraphResponse.account.totalRealizedPnlPositions);
    const totalRealizedPnlVaults = new Decimal(subgraphResponse.account.totalRealizedPnlVaults);

    return { totalRealizedPnlPositions, totalRealizedPnlVaults };
  } catch (error) {
    throw error;
  }
};

/// Returns the Realized PNL for positions and vaults for multiple user addresses
export const getMultiUserRealizedPnl = async (
  subgraphEndpoint: string,
  userAddresses: string[],
): Promise<RealizedPnlForMultipleUsers[]> => {
  try {
    const query = fetchMultiUserRealizedPnlData(userAddresses);
    const subgraphResponse: MultiUserRealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);
    const result = userAddresses.map((userAddress: string) => {
      // check if values exist for current user address, esle set value to null
      const account = subgraphResponse.accounts.find((account: Account) => account.id === userAddress)
      return {
        userAddress,
        totalRealizedPnlPositions: account?.totalRealizedPnlPositions ? new Decimal(account?.totalRealizedPnlPositions) : undefined,
        totalRealizedPnlVaults: account?.totalRealizedPnlVaults ? new Decimal(account?.totalRealizedPnlVaults) : undefined,
      }
    });

    return result;
  } catch (error) {
    throw error;
  }
};
