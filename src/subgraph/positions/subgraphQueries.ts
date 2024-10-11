import { gql } from 'graphql-request';

// Fetches all positions by a user (Both open and closed)
export const fetchPositionsByUserQuery = (userAddress: string, count: number = 10, skip: number = 0) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {user: "${userAddress.toLowerCase()}"}
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
        }
    }`;

// Fetches positions for a user address by status
export const fetchPositionsByUserQueryAndStatus = (
  userAddress: string,
  status: string,
  count: number = 10,
  skip: number = 0,
) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {
                user: "${userAddress.toLowerCase()}"
                status: "${status}"
                }
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
        }
    }`;

export const fetchPositionByIdQuery = (positionId: string) =>
  gql`
    {
        position(
            id: "${positionId}"
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
                id
            }
            snxAccount{
              id
            }
            isLong
            positionCollateral
            positionSize
            avgPrice
            avgPriceDec
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
        }
    }`;

export const fetchPriceIdsFromPositionIdsQuery = (positionIds: string[]) =>
  gql`
  {
    positions (
      where: {
        id_in: [${positionIds.map((id) => `"${id}"`).join(', ')}]
      }
    ) {
      id
      market {
        id,marketName,marketSymbol,feedId 
      }
    }
  }
`;

export const fetchPositionsToRefreshQuery = (count: number) => gql`
  {
    positions(where: { status: OPEN }, first: ${count}, orderBy: lastRefresh, orderDirection: asc) {
      id
    }
  }
`;

export const fetchPositionsToLiquidateQuery = (count: number) => gql`
  {
    positions(where: { status: OPEN, canBeLiquidated: true }, first: ${count}, orderBy: positionSize, orderDirection: desc) {
      id
    }
  }
`;

// Fetches the collateral related data for all positions of a `userAddress`
export const fetchAllPositionsForCollateralData = (userAddress: string) => gql`
  {
    positions(
      first: 1000
      orderBy: positionCollateral
      orderDirection: desc
      where: { user: "${userAddress}", status: OPEN }
    ) {
      id
      positionCollateral
      market {
        id,marketName,marketSymbol,feedId 
      }
    }
  }
`;

// Fetches the unrealized PNL for all positions of a `userAddress`
export const fetchAllPositionsUnrealizedPnl = (userAddress: string) => gql`
  {
    positions(
      first: 1000
      orderBy: positionCollateral
      orderDirection: desc
      where: { user: "${userAddress.toLowerCase()}", status: OPEN }
    ) {
      id
      
    }
  }
`;

// Fetches the order ids related to a specific position id
export const fetchAllOrdersForPosition = (positionId: string) => gql`
{
  orders(
    where: {position: "${positionId}"}
  ) {
    id
    user {
      id
    }
    market {
      id,marketName,marketSymbol,feedId 
    }
    
    orderType
    isLong
    isLimitOrder
    triggerAbove
    deadline
    deadlineISO
    deltaCollateral
    deltaSize
    deltaSizeUsd
    expectedPrice
    maxSlippage
    partnerAddress
    executionFee
    txHash
    createdTimestamp
    status
    settledTxHash
    settledTimestamp
    settledTimestampISO
    executionPrice
    settledBy {
      id
    }
    cancellationTxHash
    position {
      id
    }
  }
}`;

// Fetches all positions by a user (Both open and closed)
export const fetchPositionHistoryQuery = (userAddress: string, count: number = 100, skip: number = 0) =>
  gql`
    {
        positions(
            first: ${count}
            skip: ${skip}
            orderBy: createdTimestamp
            orderDirection: desc
            where: {user: "${userAddress.toLowerCase()}", status_not: OPEN}
        ) {
            id
            market {
              id,marketName,marketSymbol,feedId 
            }
            user {
            id
            }
            snxAccount{
              id
            }
            positionSize
            positionCollateral
            avgPrice
            avgPriceDec
            isLong
            createdTimestamp
            
            status
            txHash
            liquidationTxHash
            closingPrice
            realizedPnl
            realizedFee
            netRealizedPnl
            createdTimestamp
            lastRefresh
            lastRefreshISO
            canBeLiquidated
            accruedBorrowingFees
        }
    }`;
