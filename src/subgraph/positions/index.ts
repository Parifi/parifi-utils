import { request } from 'graphql-request';
import { Position } from '../../interfaces/subgraphTypes';
import {
  fetchAllPositionsForCollateralData,
  fetchAllPositionsMultiUserUnrealizedPnl,
  fetchAllPositionsUnrealizedPnl,
  fetchPositionByIdQuery,
  fetchPositionsByUserQuery,
  fetchPositionsByUserQueryAndStatus,
  fetchPositionsToLiquidateQuery,
  fetchPositionsToRefreshQuery,
  fetchPriceIdsFromPositionIdsQuery,
} from './subgraphQueries';
import { mapPositionsArrayToInterface, mapSinglePositionToInterface } from '../../common/subgraphMapper';
import { NotFoundError } from '../../error/not-found.error';
import { DECIMAL_ZERO, EMPTY_BYTES32, PRICE_FEED_PRECISION, getUniqueValuesFromArray } from '../../common';
import Decimal from 'decimal.js';

/// Position Ids interface to format subgraph response to string array
interface PositionIdsSubgraphResponse {
  positions: {
    id: string;
  }[];
}

export interface MultiUserTotalUnrealizedPnlInUsd {
  userAddress: string;
  totalNetUnrealizedPnlInUsd: Decimal | undefined;
}

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

// Get all price IDs of tokens related to the position ids
export const getPythPriceIdsForPositionIds = async (
  subgraphEndpoint: string,
  positionIds: string[],
): Promise<string[]> => {
  try {
    const formattedPositionIds: string[] = positionIds.map((positionId) => positionId.toLowerCase());
    let subgraphResponse: any = await request(
      subgraphEndpoint,
      fetchPriceIdsFromPositionIdsQuery(formattedPositionIds),
    );

    const priceIds: string[] = [];

    const positions: Position[] = mapPositionsArrayToInterface(subgraphResponse) || [];
    if (positions.length != 0) {
      positions.map((position) => {
        if (position.market?.pyth?.id) {
          priceIds.push(position.market?.pyth?.id);
        }
      });
    }
    const uniquePriceIds = getUniqueValuesFromArray(priceIds);

    // Remove empty (0x00) price ids for positions where the Pyth data is not set
    return uniquePriceIds.filter((id) => id !== EMPTY_BYTES32);
  } catch (error) {
    console.log('Error mapping price ids');
    throw error;
  }
};

// Get `count` number of positions to refresh sorted by last refresh timestamp
export const getPositionsToRefresh = async (subgraphEndpoint: string, count: number = 20): Promise<string[]> => {
  try {
    const query = fetchPositionsToRefreshQuery(count);
    const subgraphResponse: PositionIdsSubgraphResponse = await request(subgraphEndpoint, query);
    return subgraphResponse.positions.map((position) => position.id);
  } catch (error) {
    throw error;
  }
};

// Get `count` number of positions that are available for liquidation sorted by position size
export const getPositionsToLiquidate = async (subgraphEndpoint: string, count: number = 10): Promise<string[]> => {
  try {
    const query = fetchPositionsToLiquidateQuery(count);
    const subgraphResponse: PositionIdsSubgraphResponse = await request(subgraphEndpoint, query);
    return subgraphResponse.positions.map((position) => position.id);
  } catch (error) {
    throw error;
  }
};

// Returns the USD value of collateral deposited across all the positions for a user address
export const getTotalDepositedCollateralInUsd = async (
  subgraphEndpoint: string,
  userAddress: string,
): Promise<Decimal> => {
  try {
    /// PositionCollateralSubgraphResponse interface to format subgraph response to string array
    interface PositionCollateralSubgraphResponse {
      positions: {
        id: string;
        positionCollateral: string;
        market: {
          depositToken: {
            decimals: string;
            pyth: {
              price: string;
            };
          };
        };
      }[];
    }

    let totalCollateralValueInUsd: Decimal = DECIMAL_ZERO;
    const query = fetchAllPositionsForCollateralData(userAddress);
    const subgraphResponse: PositionCollateralSubgraphResponse = await request(subgraphEndpoint, query);

    // For each position, calculate the USD value of the deposited collateral
    subgraphResponse.positions.forEach((position) => {
      const positionCollateral = new Decimal(position.positionCollateral);
      const pythPrice = position.market.depositToken.pyth.price;
      const tokenDecimalsFactor = new Decimal(10).pow(position.market.depositToken.decimals);

      let amountUsd: Decimal = positionCollateral.times(pythPrice).div(tokenDecimalsFactor).div(PRICE_FEED_PRECISION);
      totalCollateralValueInUsd = totalCollateralValueInUsd.plus(amountUsd);
    });
    return totalCollateralValueInUsd;
  } catch (error) {
    throw error;
  }
};

// Returns the USD value of unrealized P&L across all the positions for a user address
export const getTotalUnrealizedPnlInUsd = async (subgraphEndpoint: string, userAddress: string): Promise<Decimal> => {
  try {
    /// PositionCollateralSubgraphResponse interface to format subgraph response to string array
    interface PositionUnrealizedPnlSubgraphResponse {
      positions: {
        id: string;
        netUnrealizedPnlInUsd: string;
        user: {
          id: string;
        }
      }[];
    }

    let totalNetUnrealizedPnlInUsd: Decimal = DECIMAL_ZERO;
    const query = fetchAllPositionsUnrealizedPnl(userAddress);
    const subgraphResponse: PositionUnrealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);

    // For each position, calculate the USD value of the deposited collateral
    subgraphResponse.positions.forEach((position) => {
      const unrealizedPnlInUsd = new Decimal(position.netUnrealizedPnlInUsd);
      totalNetUnrealizedPnlInUsd = totalNetUnrealizedPnlInUsd.add(unrealizedPnlInUsd);
    });
    return totalNetUnrealizedPnlInUsd;
  } catch (error) {
    throw error;
  }
};

// Returns the USD value of unrealized P&L across all the positions for multiple user addresses
export const getMultiUserTotalUnrealizedPnlInUsd = async (subgraphEndpoint: string, userAddresses: string[]): Promise<MultiUserTotalUnrealizedPnlInUsd[]> => {
  try {
    /// PositionCollateralSubgraphResponse interface to format subgraph response to string array
    interface PositionUnrealizedPnlSubgraphResponse {
      positions: {
        id: string;
        netUnrealizedPnlInUsd: string;
        user: {
          id: string;
        }
      }[];
    }
    const query = fetchAllPositionsMultiUserUnrealizedPnl(userAddresses);
    const subgraphResponse: PositionUnrealizedPnlSubgraphResponse = await request(subgraphEndpoint, query);

    // For each user address's position, calculate the USD value of the deposited collateral
    const result = userAddresses.map((userAddress: string) => {
      let totalNetUnrealizedPnlInUsd: Decimal = DECIMAL_ZERO;
      const positions = subgraphResponse.positions.filter((position) => position.user.id === userAddress);
      // @todo should we set totalNetUnrealizedPnlInUsd to zero or undefined 
      // if position for given userAddress does not exists?
      // setting it to zero for now
      positions.map((position) => {
        const unrealizedPnlInUsd = new Decimal(position.netUnrealizedPnlInUsd);
        totalNetUnrealizedPnlInUsd = totalNetUnrealizedPnlInUsd.add(unrealizedPnlInUsd);
      });
      return {userAddress, totalNetUnrealizedPnlInUsd};
    });
    return result;
  } catch (error) {
    throw error;
  }
};
