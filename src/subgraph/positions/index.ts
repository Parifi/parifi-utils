import { request } from 'graphql-request';
import { Chain } from '../../common/chain';
import { Position, getSubgraphEndpoint } from '../common';
import { fetchPositionByIdQuery, fetchPositionsByUserQuery } from './subgraphQueries';
import { mapPositionsArrayToInterface, mapSinglePositionToInterface } from '../common/mapper';

// Get all positions by user address
export const getAllPositionsByUserAddress = async (
  chainId: Chain,
  userAddress: string,
  subgraphEndpoint: string | undefined,
  count: number = 10,
): Promise<Position[]> => {
  try {
    if(!subgraphEndpoint){
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
    }
    const query = fetchPositionsByUserQuery(userAddress, count);

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
export const getPositionById = async (chainId: Chain, positionId: string,subgraphEndpoint: string | undefined): Promise<Position> => {
  try {
    if(!subgraphEndpoint){
      const subgraphEndpoint = getSubgraphEndpoint(chainId);
    }
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
