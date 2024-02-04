import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Market, getSubgraphEndpoint } from '../common';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../common/mapper';

export const getAllMarketsFromSubgraph = async (chainId: Chain): Promise<Market[]> => {
  try {
    const subgraphEndpoint = getSubgraphEndpoint(chainId);
    const subgraphResponse = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
    const markets = mapMarketsArrayToInterface(subgraphResponse);
    if (markets) {
      return markets;
    }
    throw new Error('Markets not found');
  } catch (error) {
    console.log('Markets not found');
    throw error;
  }
};

// Get all details of a market from subgraph by market ID
export const getMarketById = async (chainId: Chain, marketId: string): Promise<Market> => {
  try {
    const subgraphEndpoint = getSubgraphEndpoint(chainId);
    const formattedMarketId = marketId.toLowerCase();
    const subgraphResponse: any = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
    const market = mapSingleMarketToInterface(subgraphResponse.market);
    if (market && market.id === marketId) {
      return market;
    }
    throw new Error('Market does not exists');
  } catch (error) {
    console.log('Market does not exists');
    throw error;
  }
};
