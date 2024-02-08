import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Market, getSubgraphEndpoint } from '../common';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../common/mapper';
import { NotFoundError } from '../../error/not-found.error';

export const getAllMarketsFromSubgraph = async (chainId: Chain, subgraphEndpoint?: string): Promise<Market[]> => {
  try {
    let subgraphResponse;
    if (subgraphEndpoint) {
      subgraphResponse = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
    } else {
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
      subgraphResponse = await request(subgraphEndpoint, fetchAllMarketsDataQuery);
    }
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
export const getMarketById = async (chainId: Chain, marketId: string, subgraphEndpoint?: string): Promise<Market> => {
  try {
    let subgraphResponse: any;
    const formattedMarketId = marketId.toLowerCase();
    if (subgraphEndpoint) {
      subgraphResponse = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
    } else {
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
      subgraphResponse = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
    }
    const market = mapSingleMarketToInterface(subgraphResponse.market);
    if (market && market.id === marketId) {
      return market;
    }
    throw new NotFoundError('Market does not exists');
  } catch (error) {
    throw error;
  }
};
