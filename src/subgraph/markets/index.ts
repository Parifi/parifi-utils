import { request } from 'graphql-request';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { Market } from '../../interfaces/sdkTypes';
import { Market as MarketSg } from '../../interfaces/subgraphTypes';

// Returns data for all the markets from subgraph.
// If the subgraph query fails, the function returns an empty array
export const getAllMarketsFromSubgraph = async (subgraphEndpoint: string): Promise<Market[]> => {
  try {
    const subgraphResponse: { markets: MarketSg[] } = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
    if (!subgraphResponse) throw Error(`Error while fetching markets`);

    const markets = mapMarketsArrayToInterface(subgraphResponse.markets)?.filter(
      (market): market is Market => !!market,
    );
    if (markets) return markets;
    throw new NotFoundError('Markets not found');
  } catch (error) {
    console.log('Markets not found. Subgraph request failed', error);
    return [];
  }
};

// Get all details of a market from subgraph by market ID
// Throws error when query fails or market not found
export const getMarketById = async (subgraphEndpoint: string, marketId: string): Promise<Market> => {
  try {
    const subgraphResponse: any = await request(subgraphEndpoint, fetchMarketByIdQuery(marketId));
    if (!subgraphResponse) throw Error(`Error while fetching markets`);

    if (subgraphResponse) {
      const market = mapSingleMarketToInterface(subgraphResponse.market);
      if (market && market.id === marketId) {
        return market;
      }
    }
    throw Error(`Market with Market Id ${marketId} Not Found`);
  } catch (error) {
    console.log(`Market with Market Id ${marketId} Not Found`, error);
    throw error;
  }
};
