import { request } from 'graphql-request';
import { Market } from '../../interfaces/subgraphTypes';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';

export const getAllMarketsFromSubgraph = async (subgraphEndpoint: string): Promise<Market[]> => {
  try {
    const subgraphResponse: any = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
    if (!subgraphResponse) throw Error(`Error While Fechting All Market`);
    const markets = mapMarketsArrayToInterface(subgraphResponse);
    if (markets) {
      return markets;
    }
    throw new NotFoundError('Markets not found');
  } catch (error) {
    throw error;
  }
};

// Get all details of a market from subgraph by market ID
export const getMarketById = async (subgraphEndpoint: string, marketId: string): Promise<Market> => {
  try {
    const formattedMarketId = marketId.toLowerCase();
    const subgraphResponse: any = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
    if (!subgraphResponse) throw Error(`Error While Fechting Market By Id`);
    if (subgraphResponse) {
      const market = mapSingleMarketToInterface(subgraphResponse.market);
      if (market && market.id === marketId) {
        return market;
      }
    }
    throw Error(`Market with Market Id ${formattedMarketId} Not Found`);
  } catch (error) {
    throw error;
  }
};
