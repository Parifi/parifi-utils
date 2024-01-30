import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { getSubgraphEndpoint } from '../common';
import { fetchAllMarketsDataQuery, fetchMarketByIdQuery } from './subgraphQueries';
import { mapMarketsArrayToInterface, mapSingleMarketToInterface } from '../common/mapper';

export const getAllMarketsFromSubgraph = async (chainId: Chain) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);
  console.log('subgraphEndpoint', subgraphEndpoint);

  const subgraphResponse = await request(subgraphEndpoint, fetchAllMarketsDataQuery);

  return mapMarketsArrayToInterface(subgraphResponse);
};

// Get all details of a market from subgraph by market ID
export const getMarketById = async (chainId: Chain, marketId: string) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const formattedMarketId = marketId.toLowerCase();

  const subgraphResponse: any = await request(subgraphEndpoint, fetchMarketByIdQuery(formattedMarketId));
  console.log(subgraphResponse);
  return mapSingleMarketToInterface(subgraphResponse.market);
};
