import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Position, getSubgraphEndpoint } from '../common';
import { fetchPositionByIdQuery, fetchPositionsByUserQuery } from './subgraphQueries';
import { mapPositionsArrayToInterface, mapSinglePositionToInterface } from '../common/mapper';
import { NotFoundError } from '../../error/not-found.error';

// Get all positions by user address
export const getAllPositionsByUserAddress = async (
  chainId: Chain,
  userAddress: string,
  count: number = 10,
  skip: number = 0
): Promise<Position[]> => {
  try {
    const subgraphEndpoint = getSubgraphEndpoint(chainId);
    const query = fetchPositionsByUserQuery(userAddress, count, skip);

    const subgraphResponse = await request(subgraphEndpoint, query);
    const positions = mapPositionsArrayToInterface(subgraphResponse);
    if (positions) {
      return positions;
    }
    throw new NotFoundError('Positions not found');
  } catch (error) {
    throw error;
  }
};

// Get position from subgraph by position ID
export const getPositionById = async (chainId: Chain, positionId: string): Promise<Position> => {
  try {
    const subgraphEndpoint = getSubgraphEndpoint(chainId);
    const formattedPositionId = positionId.toLowerCase();

    const subgraphResponse: any = await request(subgraphEndpoint, fetchPositionByIdQuery(formattedPositionId));
    const position = mapSinglePositionToInterface(subgraphResponse.position);
    if (position) {
      return position;
    }
    throw new NotFoundError('Position not found');
  } catch (error) {
    throw error;
  }
};
