import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { getSubgraphEndpoint } from '../common';
import { fetchPositionByIdQuery, fetchPositionsByUserQuery } from './subgraphQueries';
import { mapPositionsArrayToInterface, mapSinglePositionToInterface } from '../common/mapper';

// Get all positions by user address
export const getAllPositionsByUserAddress = async (chainId: Chain, userAddress: string, count: number = 10) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const query = fetchPositionsByUserQuery(userAddress, count);

  const subgraphResponse = await request(subgraphEndpoint, query);
  return mapPositionsArrayToInterface(subgraphResponse);
};

// Get position from subgraph by position ID
export const getPositionById = async (chainId: Chain, positionId: string) => {
  const subgraphEndpoint = getSubgraphEndpoint(chainId);

  const formattedPositionId = positionId.toLowerCase();

  const subgraphResponse: any = await request(subgraphEndpoint, fetchPositionByIdQuery(formattedPositionId));
  return mapSinglePositionToInterface(subgraphResponse.position);
};
