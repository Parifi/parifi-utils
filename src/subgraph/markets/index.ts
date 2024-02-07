import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Market, getSubgraphEndpoint } from '../common';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../common/mapper';

export const getAllMarketsFromSubgraph = async (chainId: Chain, subgraphEndpoint: string|undefined): Promise<Market[]> => {
  try {
    if(!subgraphEndpoint){
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
    }
    const subgraphResponse = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
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
export const getMarketById = async (chainId: Chain, marketId: string,subgraphEndpoint: string|undefined): Promise<Market> => {
  try {
    if(!subgraphEndpoint){
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
    }
    const formattedMarketId = marketId.toLowerCase();
    const subgraphResponse: any = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
    const market = mapSingleMarketToInterface(subgraphResponse.market);
    if (market && market.id === marketId) {
      return market;
    }
    throw new NotFoundError('Market does not exists');
  } catch (error) {
    throw error;
  }
};
