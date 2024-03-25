import Decimal from 'decimal.js';
import { request } from 'graphql-request';
import { fetchRealizedPnlData } from './subgraphQueries';


/// Returns the Realized PNL for positions and vaults for a user address
export const getRealizedPnlForUser = async (
  subgraphEndpoint: string,
  userAddress: string,
): Promise<{
  totalRealizedPnlPositions: Decimal;
  totalRealizedPnlVaults: Decimal;
}> => {
  try {
    // Interface to map fetched data
    interface RealizedPnlSubgraphResponse {
      account: {
        id: string;
        totalRealizedPnlPositions: string;
        totalRealizedPnlVaults: string;
      };
    }

    const query = fetchRealizedPnlData(userAddress);
    const subgraphResponse: RealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);

    const totalRealizedPnlPositions = new Decimal(subgraphResponse.account.totalRealizedPnlPositions);
    const totalRealizedPnlVaults = new Decimal(subgraphResponse.account.totalRealizedPnlVaults);

    return { totalRealizedPnlPositions, totalRealizedPnlVaults };
  } catch (error) {
    throw error;
  }
};
