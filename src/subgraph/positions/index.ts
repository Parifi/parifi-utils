import { request } from 'graphql-request';
import { Position } from '../../interfaces/subgraphTypes';
import {
  fetchPositionByIdQuery,
  fetchPositionsByUserQuery,
  fetchPositionsByUserQueryAndStatus,
} from './subgraphQueries';
import { mapPositionsArrayToInterface, mapSinglePositionToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';

// Get all positions by user address
export const getAllPositionsByUserAddress = async (
  subgraphEndpoint: string,
  userAddress: string,
  count: number = 10,
  skip: number = 0,
): Promise<Position[]> => {
  try {
    const query = fetchPositionsByUserQuery(userAddress, count, skip);
    let subgraphResponse: any = await request(subgraphEndpoint, query);
    const positions = mapPositionsArrayToInterface(subgraphResponse);
    if (positions) {
      return positions;
    }
    throw new NotFoundError('Positions not found');
  } catch (error) {
    throw error;
  }
};

// Get open positions by user address
export const getOpenPositionsByUserAddress = async (
  subgraphEndpoint: string,
  userAddress: string,
  count: number = 10,
  skip: number = 0,
): Promise<Position[]> => {
  try {
    const query = fetchPositionsByUserQueryAndStatus(userAddress, 'OPEN', count, skip);
    let subgraphResponse: any = await request(subgraphEndpoint, query);
    const positions = mapPositionsArrayToInterface(subgraphResponse);
    if (positions) {
      return positions;
    }
    throw new NotFoundError('Positions not found');
  } catch (error) {
    throw error;
  }
};

// Get open positions by user address
export const getClosedPositionsByUserAddress = async (
  subgraphEndpoint: string,
  userAddress: string,
  count: number = 10,
  skip: number = 0,
): Promise<Position[]> => {
  try {
    const query = fetchPositionsByUserQueryAndStatus(userAddress, 'CLOSED', count, skip);
    let subgraphResponse: any = await request(subgraphEndpoint, query);
    const positions = mapPositionsArrayToInterface(subgraphResponse);
    if (positions) {
      return positions;
    }
    throw new NotFoundError('Positions not found');
  } catch (error) {
    throw error;
  }
};

// Get LIQUIDATED positions by user address
export const getLiquidatedPositionsByUserAddress = async (
  subgraphEndpoint: string,
  userAddress: string,
  count: number = 10,
  skip: number = 0,
): Promise<Position[]> => {
  try {
    const query = fetchPositionsByUserQueryAndStatus(userAddress, 'LIQUIDATED', count, skip);
    let subgraphResponse: any = await request(subgraphEndpoint, query);
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
export const getPositionById = async (subgraphEndpoint: string, positionId: string): Promise<Position> => {
  try {
    const formattedPositionId = positionId.toLowerCase();
    let subgraphResponse: any = await request(subgraphEndpoint, fetchPositionByIdQuery(formattedPositionId));

    const position = mapSinglePositionToInterface(subgraphResponse.position);
    if (position) {
      return position;
    }
    throw new NotFoundError('Position not found');
  } catch (error) {
    throw error;
  }
};
